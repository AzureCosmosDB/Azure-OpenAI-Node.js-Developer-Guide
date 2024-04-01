require('dotenv').config();
const { MongoClient } = require('mongodb');
const { OpenAIClient, AzureKeyCredential} = require("@azure/openai");

// set up the MongoDB client
const dbClient = new MongoClient(process.env.AZURE_COSMOSDB_CONNECTION_STRING);
// set up the Azure OpenAI client 
const embeddingsDeploymentName = "embeddings";
const aoaiClient = new OpenAIClient("https://" + process.env.AZURE_OPENAI_API_INSTANCE_NAME + ".openai.azure.com/", 
                    new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY));

async function main() {
    try {
        await dbClient.connect();
        console.log('Connected to MongoDB');
        const db = dbClient.db('cosmic_works');

        // Load product data
        console.log('Loading product data')
        // Initialize the product collection pointer (will automatically be created if it doesn't exist)
        const productCollection = db.collection('products');
        // Load the product data from the raw data from Cosmic Works while also removing the system properties
        const productRawData = "https://cosmosdbcosmicworks.blob.core.windows.net/cosmic-works-small/product.json";
        const productData = (await (await fetch(productRawData)).json())
                                .map(prod => cleanData(prod));
        // Delete all existing products and insert the new data
        await productCollection.deleteMany({});
        // Utilize bulkWrite to insert all the products at once
        var result = await productCollection.bulkWrite(
            productData.map((product) => ({
                insertOne: {
                    document: product
                }
            }))
        );
        console.log(`${result.insertedCount} products inserted`);

        await addCollectionContentVectorField(db, 'products');
       
    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
        console.log('Disconnected from MongoDB');
    }
}

async function generateEmbeddings(text) {
    const embeddings = await aoaiClient.getEmbeddings(embeddingsDeploymentName, text);
    // Rest period to avoid rate limiting on Azure OpenAI  
    await new Promise(resolve => setTimeout(resolve, 500));
    return embeddings.data[0].embedding;
}

async function addCollectionContentVectorField(db, collectionName) {
    const collection = db.collection(collectionName); 
    const docs = await collection.find({}).toArray();
    const bulkOperations = [];
    console.log(`Generating content vectors for ${docs.length} documents in ${collectionName} collection`);
    for (let i=0; i<docs.length; i++) {
        const doc = docs[i];
        // do not include contentVector field in the content to be embedded
        if ('contentVector' in doc) {
            delete doc['contentVector'];
        }
        const content = JSON.stringify(doc);
        const contentVector = await generateEmbeddings(content);
        bulkOperations.push({
            updateOne: {
                filter: { '_id': doc['_id'] },
                update: { '$set': { 'contentVector': contentVector } },
                upsert: true
            }
        });
        //output progress every 25 documents
        if ((i+1) % 25 === 0 || i === docs.length-1) {          
            console.log(`Generated ${i+1} content vectors of ${docs.length} in the ${collectionName} collection`);
        }
    }
    if (bulkOperations.length > 0) {
        console.log(`Persisting the generated content vectors in the ${collectionName} collection using bulkWrite upserts`);
        await collection.bulkWrite(bulkOperations);
        console.log(`Finished persisting the content vectors to the ${collectionName} collection`);
    }

    //check to see if the vector index already exists on the collection
    console.log(`Checking if vector index exists in the ${collectionName} collection`)
    const vectorIndexExists = await collection.indexExists('VectorSearchIndex');
    if (!vectorIndexExists) {
        await db.command({
            "createIndexes": collectionName,
            "indexes": [
              {
                "name": "VectorSearchIndex",
                "key": {
                  "contentVector": "cosmosSearch"
                },
                "cosmosSearchOptions": {                  
                  "kind": "vector-ivf",
                  "numLists": 1,
                  "similarity": "COS",
                  "dimensions": 1536
                }
              }
            ]
        });
        console.log(`Created vector index on contentVector field on ${collectionName} collection`);
    }
    else {
        console.log(`Vector index already exists on contentVector field in the ${collectionName} collection`);
    }
}

main().catch(console.error);
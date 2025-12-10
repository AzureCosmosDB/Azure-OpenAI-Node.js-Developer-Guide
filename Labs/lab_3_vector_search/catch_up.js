require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main() {    
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('cosmic_works');

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

        // Load customer and sales data
        console.log('Retrieving combined Customer/Sales data');
        const customerCollection = db.collection('customers');
        const salesCollection = db.collection('sales');
        const custSalesRawData = "https://cosmosdbcosmicworks.blob.core.windows.net/cosmic-works-small/customer.json";
        const custSalesData = (await (await fetch(custSalesRawData)).json())
                                .map(custSales => cleanData(custSales));   
        
        console.log("Split customer and sales data");
        const customerData = custSalesData.filter(cust => cust["type"] === "customer");
        const salesData = custSalesData.filter(sales => sales["type"] === "salesOrder");
        
        console.log("Loading customer data");
        await customerCollection.deleteMany({});
        result = await customerCollection.insertMany(customerData);
        console.log(`${result.insertedCount} customers inserted`);
        
        console.log("Loading sales data");
        await salesCollection.deleteMany({});
        result = await salesCollection.insertMany(salesData);
        console.log(`${result.insertedCount} sales inserted`);
        
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

function cleanData(obj) {
    cleaned =  Object.fromEntries(
        Object.entries(obj).filter(([key, _]) => !key.startsWith('_'))
    );
    //rename id field to _id
    cleaned["_id"] = cleaned["id"];
    delete cleaned["id"];
    return cleaned;
}  

main().catch(console.error);
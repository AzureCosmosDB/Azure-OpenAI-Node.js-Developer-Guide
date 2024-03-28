require('dotenv').config();
const { MongoClient } = require('mongodb');

// set up the MongoDB client
const dbClient = new MongoClient(process.env.AZURE_COSMOSDB_CONNECTION_STRING);

async function main() {
    try {
        await dbClient.connect();
        console.log("Connected to MongoDB");

    } catch (err) {
        console.error(err);
    } finally {
        await dbClient.close();
        console.log('Disconnected from MongoDB');
    }
}

main().catch(console.error);
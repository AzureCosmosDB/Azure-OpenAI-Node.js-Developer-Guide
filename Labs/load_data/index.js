require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main() {    
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('cosmic_works');

        
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

function removePropertiesStartingWithUnderscore(obj) {
    // Remove the system properties from source data
    return Object.fromEntries(  
      Object.entries(obj).filter(([key, _]) => !key.startsWith('_'))  
    );  
}

main().catch(console.error);
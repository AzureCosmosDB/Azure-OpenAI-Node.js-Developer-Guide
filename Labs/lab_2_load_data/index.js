require("dotenv").config();
const { MongoClient } = require("mongodb");
const fs = require("fs");

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("cosmic_works");
    console.log("Using database cosmic_works");

    // Load product data
    console.log("Loading product data");
    // Initialize the product collection pointer (will automatically be created if it doesn't exist)
    const productCollection = db.collection("products");
    // Load the product data from the local product.json file while also removing the system properties
    const productRawData = fs.readFileSync("product.json", "utf8");
    const productData = JSON.parse(productRawData).map((prod) =>
      cleanData(prod)
    );

    // // Delete any existing products
    // console.log("Deleting existing products");
    // await productCollection.deleteMany({});

    var result = await productCollection.bulkWrite(
      productData.map((product) => ({
        updateOne: {
          filter: { sku: product.sku },
          update: { $set: product },
          upsert: true,
        },
      }))
    );
    console.log(`${result.upsertedCount} products upserted`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

function cleanData(obj) {
  cleaned = Object.fromEntries(
    Object.entries(obj).filter(([key, _]) => !key.startsWith("_"))
  );
  //rename id field to _id
  cleaned["_id"] = cleaned["id"];
  delete cleaned["id"];
  return cleaned;
}

main().catch(console.error);

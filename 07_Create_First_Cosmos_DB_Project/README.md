# Create your first Cosmos DB project

This section will cover how to create your first Cosmos DB project. We'll create a simple application to demonstrate the basic CRUD operations. We'll also cover using the Azure Cosmos DB Emulator to test code locally.

## Emulator support

Azure Cosmos DB has an emulator that can be used to develop code locally. The emulator supports the API for NoSQL and the API for MongoDB. The use of the emulator does not require an Azure subscription, nor does it incur any costs, so it is ideal for local development and testing. The Azure Cosmos DB emulator can also be utilized with unit tests in a [GitHub Actions CI workflow](https://learn.microsoft.com/azure/cosmos-db/how-to-develop-emulator?tabs=windows%2Cpython&pivots=api-mongodb#use-the-emulator-in-a-github-actions-ci-workflow).

There is not 100% feature parity between the emulator and the cloud service. Visit the [Azure Cosmos DB emulator](https://learn.microsoft.com/azure/cosmos-db/emulator) documentation for more details.

For Windows machines, the emulator can be installed via an installer. There is a Windows container using Docker available. However, it does not currently support the API for Mongo DB. A Docker image is also available for Linux that does support the API for Mongo DB.

Learn more about the pre-requisites and installation of the emulator [here](https://learn.microsoft.com/azure/cosmos-db/how-to-develop-emulator?tabs=windows%2Cpython&pivots=api-mongodb).

>**NOTE**: When using the Azure CosmosDB emulator using the API for MongoDB it must be started with the [MongoDB endpoint options enabled](https://learn.microsoft.com/azure/cosmos-db/how-to-develop-emulator?tabs=windows%2Cpython&pivots=api-mongodb#start-the-emulator) at the command-line.

**The Azure Cosmos DB emulator does not support vector search. To complete the vector search and AI-related labs, a vCore-based Azure Cosmos DB for MongoDB account in Azure is required.**

## Authentication

Authentication to Azure Cosmos DB API for Mongo DB uses a connection string. The connection string is a URL that contains the authentication information for the Azure Cosmos DB account or local emulator. The username and password used when provisioning the Azure Cosmos DB API for MongoDB service are used in the connection string when authenticating to Azure.

### Retrieving the connection string from the Cosmos DB Emulator

The splash screen or **Quickstart** section of the Cosmos DB Emulator will display the connection string. Access this screen through the following URL: `https://localhost:8081/_explorer/index.html`.

![The Azure Cosmos DB emulator screen displays with the local host url, the Quickstart tab, and the Mongo connection string highlighted.](media/emulator_connection_string.png)

### Retrieving the connection string from the Azure portal

Retrieve the connection string from the Azure portal by navigating to the Azure Cosmos DB account and selecting the **Connection String** menu item on the left-hand side of the screen. The connection string contains tokens for the username and password that must be replaced with the username and password used when provisioning the Azure Cosmos DB API for MongoDB service.

![The Azure CosmosDb API for MongoDB Connection strings screen displays with the copy button next to the connection string highlighted.](media/azure_connection_string.png)

## Lab - Create your first Cosmos DB for MongoDB application

In this lab, we'll create a Cosmos DB for the MongoDB application using the **mongodb** NPM package that includes the MongoDB Node.js Driver and its dependencies. Both the Azure Cosmos DB Emulator and Azure Cosmos DB account in Azure are supported for completion of this lab.

Please visit the lab repository to complete [this lab](https://github.com/AzureCosmosDB/Azure-OpenAI-Node.js-Developer-Guide/blob/main/Labs/first_cosmos_db_application/README.md).

The following concepts are covered in detail in this lab:

### Creating a MongoDB database client

The `mongodb` NPM package is used to create a MongoDB database client. The client enables both DDL (data definition language) and DML (data manipulation language) operations.

```javascript
const client = new MongoClient(process.env.MONGODB_URI);
```

### Creating a database

When using the `mongodb` client, the creation of a database is automatic when referenced. No specific api calls to create a database are required, if a database already exists, a reference to the database is returned.

>**Note:**: That the creation of databases and collections are lazy, meaning they will not be created until a document is inserted into a collection.

```javascript
const db = client.db('cosmic_works');
```

### Creating a collection

Similar behavior to the creation of a database is experienced when creating a collection. If the collection does not exist, it will be created once a document is inserted into the collection.

```javascript
const products = db.collection('products');
```

### Creating a document

The `insertOne` method is used to insert a document into a collection. The document is a product document.

```javascript
const result = await products.insertOne(product);
```

### Reading a document

The `findOne` method is used to retrieve a single document from a collection. The method returns the product document.

```javascript
const product = await products.findOne({ _id: '2BA4A26C-A8DB-4645-BEB9-F7D42F50262E' });
```

### Updating a document

The `findOneAndUpdate` method is used to update a single document in a collection. The method returns the updated document object.

```javascript
const options = { returnDocument: 'after' };
const updated = await products.findOneAndUpdate(
    { _id: '2BA4A26C-A8DB-4645-BEB9-F7D42F50262E' },
    { $set: { price: 14242.42 } },
    options);
```

### Deleting a document

The `deleteOne` method is used to delete a single document from a collection.

```javascript
const result = await products.deleteOne({ _id: '2BA4A26C-A8DB-4645-BEB9-F7D42F50262E' });
```

### Querying documents

The `find` method is used to query documents from a collection. The method returns a cursor object that can be converted to an array using the `toArray` method.

```javascript
const allProducts = await products.find({}).toArray();
```

# Create your first Azure Cosmos DB project

This section will cover how to create your first Azure Cosmos DB project.
We'll create a simple application to demonstrate the basic CRUD operations.
We'll also cover using a local DocumentDB Docker container to test code locally.

## Local development support

For local development and testing, the [DocumentDB Docker container](https://github.com/microsoft/documentdb) can be used.
This approach does not require an Azure subscription and is ideal for local development.

Run the DocumentDB container using Docker:

```console
docker pull ghcr.io/documentdb/documentdb/documentdb-local:latest

docker run -dt -p 10260:10260 --name documentdb-local ghcr.io/documentdb/documentdb/documentdb-local:latest --username <YOUR_USERNAME> --password <YOUR_PASSWORD>
```

### Retrieving the connection string for local development

The connection string for the local DocumentDB container is:
`mongodb://<USERNAME>:<PASSWORD>@localhost:10260/?tls=true&tlsAllowInvalidCertificates=true`

Replace `<USERNAME>` and `<PASSWORD>` with the credentials you specified when starting the container.

DocumentDB has vector search capabilities out of the box, allowing you to run your AI workloads locally.
For more information on using vector search locally, see the [DocumentDB documentation](https://documentdb.io/docs).

## Authentication

Authentication to Azure DocumentDB uses a connection string.
The connection string is a URL that contains the authentication information for the Azure DocumentDB cluster or local development environment.
The username and password used when provisioning the Azure DocumentDB service are used in the connection string when authenticating to Azure.

### Retrieving the connection string from the Azure portal

Retrieve the connection string from the Azure portal by navigating to the Azure DocumentDB cluster and selecting the **Connection String** menu item on the left-hand side of the screen.
The connection string contains tokens for the username and password that must be replaced with the username and password used when provisioning the Azure DocumentDB service.

![The Azure DocumentDB Connection strings screen displays with the copy button next to the connection string highlighted.](media/azure_connection_string.png)

## Lab - Create your first Azure DocumentDB application

In this lab, we'll create an Azure DocumentDB application using the **mongodb** NPM package that includes the MongoDB Node.js Driver and its dependencies.
Both the Azure Cosmos DB Emulator and Azure DocumentDB cluster in Azure are supported for completion of this lab.

Please visit the lab repository to complete [this lab](https://github.com/AzureCosmosDB/Azure-OpenAI-Node.js-Developer-Guide/blob/main/Labs/lab_1_first_application/README.md).

The following concepts are covered in detail in this lab:

### Creating a database client

The `mongodb` package is used to create an Azure DocumentDB database client.
The client enables both DDL (data definition language) and DML (data manipulation language) operations.

```javascript
const client = new MongoClient(process.env.MONGODB_URI);
```

### Creating a database

When using the MongoClient, the creation of a database is automatic when referenced.
No specific api calls to create a database are required, if a database already exists, a reference to the database is returned.

> **Note:**: That the creation of databases and collections are lazy, meaning they will not be created until a document is inserted into a collection.

```javascript
const db = client.db("cosmic_works");
```

### Creating a collection

Similar behavior to the creation of a database is experienced when creating a collection.
If the collection does not exist, it will be created once a document is inserted into the collection.

```javascript
const products = db.collection("products");
```

### Creating a document

The `insertOne` method is used to insert a document into a collection.
The document is a product dictionary object.

```javascript
const result = await products.insertOne(product);
const productId = result.insertedId;
```

### Reading a document

The `findOne` method is used to retrieve a single document from a collection.
The method returns a product dictionary object.

```javascript
const product = await products.findOne({ _id: productId });
```

### Updating a document

The `findOneAndUpdate` method is used to update a single document in a collection.
The method returns a product dictionary object.

```javascript
const options = { returnDocument: "after" };
const updated = await products.findOneAndUpdate(
  { _id: productId },
  { $set: { price: 14242.42 } },
  options
);
```

### Deleting a document

The `deleteOne` method is used to delete a single document from a collection.

```javascript
const result = await products.deleteOne({ _id: productId });
```

### Querying documents

The `find` method is used to query documents from a collection.
The method returns a cursor object that can be converted to an array using the `toArray` method.

```javascript
const allProducts = await products.find({}).toArray();
```


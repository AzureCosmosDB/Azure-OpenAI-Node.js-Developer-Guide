# Load data into Azure Cosmos DB API for MongoDB

The previous lab demonstrated how to add data to a collection individually. This lab will demonstrate how to load data using bulk operations into multiple collections. This data will be used in subsequent labs to explain further the capabilities of Azure Cosmos DB API for MongoDB with respect to AI.

When loading data, bulk operations are preferred over adding each document individually. Bulk operations involve performing multiple database operations as a batch rather than executing them simultaneously. This approach is more efficient and provides several benefits:

1. Performance: By issuing load operations in bulk, the lab can significantly reduce the overhead of network round-trips and database operations. This results in faster data loading and improved overall performance.

2. Scalability: Bulk operations allow the lab to handle large volumes of data efficiently. They can quickly process and load a substantial amount of customer, product, and sales data, enabling them to scale their operations as needed.

3. Atomicity: Bulk operations ensure that all database changes within a batch are treated as a single transaction. The entire batch can be rolled back if any document fails to load, maintaining data integrity and consistency.

4. Simplified code logic: By using bulk operations, the lab can simplify its code logic and reduce the number of database queries. This results in cleaner, more manageable code and reduces the likelihood of errors or inconsistencies.

## Lab - Load data into Azure Cosmos DB API for MongoDB collections

This lab will load the Cosmic Works Customer, Product, and Sales data into Azure Cosmos DB API for MongoDB collections using bulk operations. Both the Azure Cosmos DB Emulator and Azure Cosmos DB account in Azure are supported for completion of this lab.

Please visit the lab repository to complete [this lab](https://github.com/AzureCosmosDB/Azure-OpenAI-Node.js-Developer-Guide/blob/main/Labs/load_data/README.md).

This lab demonstrates the use of bulk operations to load product, customer, and sales data into Azure Cosmos DB API for MongoDB collections. As an example, the following code snippet inserts product data using the `bulkWrite` method allowing for insert functionality using the `InsertOne` operation. The bulkWrite method is used to perform multiple write operations in a single batch, write operations can include a mixture of insert, update, and delete operations:

```javascript
var result = await productCollection.bulkWrite(
        productData.map((product) => ({
            insertOne: {
                document: product
            }
        }))
    );
```

The lab continues with bulk loading customer and sales data, this time with the `insertMany` method. The insertMany method is used to insert multiple documents into a collection, it differs from the bulkWrite method in that it only supports insert operations. The following code snippet demonstrates the use of the simplified `insertMany` method to insert customer data:

```javascript
var result = await customerCollection.insertMany(customerData);
```

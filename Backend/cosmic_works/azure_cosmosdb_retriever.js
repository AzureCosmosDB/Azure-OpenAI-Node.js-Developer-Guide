const { Document } = require("@langchain/core/documents");
const { BaseRetriever } = require("@langchain/core/retrievers");

class AzureCosmosDBRetriever extends BaseRetriever {
    constructor(client, embeddings, config) {
        super();
        this.client = client;
        this.embeddings = embeddings;
        this.databaseName = config.databaseName;
        this.collectionName = config.collectionName;
        this.embeddingKey = config.embeddingKey;
        this.textKey = config.textKey;
        this.k = config.k ?? 4;
    }

    async _getRelevantDocuments(query) {
        const vector = await this.embeddings.embedQuery(query);
        const results = await this.client
            .db(this.databaseName)
            .collection(this.collectionName)
            .aggregate([
                {
                    $search: {
                        cosmosSearch: {
                            vector,
                            path: this.embeddingKey,
                            k: this.k
                        },
                        returnStoredSource: true
                    }
                },
                {
                    $project: {
                        similarityScore: { $meta: "searchScore" },
                        document: "$$ROOT"
                    }
                }
            ])
            .toArray();

        return results.map(({ document }) => new Document({
            pageContent: document[this.textKey],
            metadata: document
        }));
    }
}

module.exports = AzureCosmosDBRetriever;

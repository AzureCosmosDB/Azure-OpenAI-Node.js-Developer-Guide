import { OpenAIClient, OpenAIEmbeddings } from "@langchain/azure-openai";
import { ConversationalRetrievalAgent } from "@langchain/agents";

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING
const AOAI_ENDPOINT = process.env.AOAI_ENDPOINT
const AOAI_KEY = process.env.AOAI_KEY
const AOAI_API_VERSION = "2023-09-01-preview"
const COMPLETIONS_DEPLOYMENT = "completions"
const EMBEDDINGS_DEPLOYMENT = "embeddings"

// https://js.langchain.com/docs/integrations/chat/azure
const llm = new OpenAIClient({
    temperature: 0,
    azureOpenAIEndpoint: AOAI_ENDPOINT,
    azureOpenAIApiKey: AOAI_KEY,
    azureOpenAIApiVersion: AOAI_API_VERSION,
    azureOpenAIApiDeploymentName: COMPLETIONS_DEPLOYMENT
});

// https://js.langchain.com/docs/integrations/text_embedding/azure_openai
const embeddings = new OpenAIEmbeddings({
    azureOpenAIEndpoint: AOAI_ENDPOINT,
    azureOpenAIApiKey: AOAI_KEY,
    azureOpenAIApiVersion: AOAI_API_VERSION,
    azureOpenAIApiDeploymentName: EMBEDDINGS_DEPLOYMENT
    // chuck_size=10
});

const system_message = `You are a helpful, fun and friendly sales assistant for Cosmic Works, 
a bicycle and bicycle accessories store.

Your name is Cosmo.

You are designed to answer questions about the products that Cosmic Works sells, 
the customers that buy them, and the sales orders that are placed by customers.

If you don't know the answer to a question, respond with "I don't know."

Only answer questions related to Cosmic Works products, customers, and sales orders.

If a question is not related to Cosmic Works products, customers, or sales orders,
respond with "I only answer questions about Cosmic Works"`;


const retriever = new VectorStoreRetriever({
    // ...
  });

const agent = new ConversationalRetrievalAgent({
    retriever,
    // ...
  });


class CosmicWorksAIAgent {

}

module.exports = CosmicWorksAIAgent;
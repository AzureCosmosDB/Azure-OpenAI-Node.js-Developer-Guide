// import { AzureCosmosDBVectorStore, AzureCosmosDBSimilarityType } from "@langchain/community/vectorstores/azure_cosmosdb";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
// import { TextLoader } from "langchain/document_loaders/fs/text";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// https://js.langchain.com/docs/integrations/vectorstores/azure_cosmosdb

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING
const AOAI_ENDPOINT = process.env.AOAI_ENDPOINT
const AOAI_KEY = process.env.AOAI_KEY
const AOAI_API_VERSION = "2023-09-01-preview"
const COMPLETIONS_DEPLOYMENT = "completions"
const EMBEDDINGS_DEPLOYMENT = "embeddings"

// const aoaiClient = new OpenAIClient(
//   AOAI_ENDPOINT,
//   new AzureKeyCredential(AOAI_KEY)
//   );

// https://python.langchain.com/docs/integrations/llms/azure_openai
// https://js.langchain.com/docs/use_cases/question_answering/conversational_retrieval_agents?ref=blog.langchain.dev

const system_message = `You are a helpful, fun and friendly sales assistant for Cosmic Works, 
a bicycle and bicycle accessories store.

Your name is Cosmo.

You are designed to answer questions about the products that Cosmic Works sells, 
the customers that buy them, and the sales orders that are placed by customers.

If you don't know the answer to a question, respond with "I don't know."

Only answer questions related to Cosmic Works products, customers, and sales orders.

If a question is not related to Cosmic Works products, customers, or sales orders,
respond with "I only answer questions about Cosmic Works"`;

class CosmicWorks {
  static async run(prompt) {
    const model = new ChatOpenAI({
      deployment_name: COMPLETIONS_DEPLOYMENT,
      temperature: 0,
      //modelName: "gpt-3.5-turbo-1106",
    });
    const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        system_message, //"Answer the user's questions based on the below context:\n\n{context}",
      ],
      ["human", "{input}"],
    ]);

    const combineDocsChain = await createStuffDocumentsChain({
      llm: model,
      prompt: questionAnsweringPrompt,
    });

    const chain = await createRetrievalChain({
      retriever: store.asRetriever(),
      combineDocsChain,
    });

    // const vectorStore = new AzureCosmosDBVectorStore({
    //   embedding: model,
    //   connectionString: DB_CONNECTION_STRING,
    //   //database: "YOUR_DATABASE",
    //   collection: COMPLETIONS_DEPLOYMENT, //"YOUR_COLLECTION",
    // });

    // // Add the vector store to LangChain
    // langchain.addVectorStore(vectorStore);


    const res = await chain.invoke({
      input: prompt //"What is the president's top priority regarding prices?",
    });

    return res.answer;
  }
};

module.exports = CosmicWorks;

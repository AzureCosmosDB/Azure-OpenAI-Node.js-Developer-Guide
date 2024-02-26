# Lab - Backend API

In the previous lab, a LangChain agent was created armed with tools to do vector lookups and concrete document id lookups via function calling. In this lab, the agent functionality needs to be extracted into a backend api for the frontend application that will allow users to interact with the agent.

## Setup the lab environment

To simplify code, the LangChain package makes use of environment variables. The `.env` file in this lab will reflect the naming conventions of the LangChain packages and differs from previous labs.

1. Open the `.env` file in the Visual Studio Code editor.

2. Add the following settings to the `.env` file, populating the MongoDB connection string and replacing the values from the deployed Azure OpenAI service:

    ```bash
    AZURE_COSMOSDB_CONNECTION_STRING=<mongodb_uri>
    AZURE_OPENAI_API_INSTANCE_NAME=<openai-service-name>
    AZURE_OPENAI_API_KEY=<azure_openai_api_key>
    AZURE_OPENAI_API_DEPLOYMENT_NAME=completions
    AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME=embeddings
    AZURE_OPENAI_API_VERSION=2023-09-01-preview
    ```

    Replace `<mongodb_uri>` with the MongoDB connection string. Replace `<openai-service-name>` with the name of the deployed OpenAI service, and `<azure_openai_api_key>` with the Azure OpenAI API key. Leave all other values untouched.

    >**Note**: The Azure OpenAI service name is not the full endpoint. Only the service name is required. For example, if the endpoint is `https://myservicename.openai.azure.com/`, then the service name is `myservicename`.

3. In Visual Studio Code, open a terminal window and navigate to the lab folder `langchain`.

4. Install the required packages by running the following command in the terminal window:

    ```bash
    npm install
    ```

## Pre-requisites

This lab expects that data is already loaded into the Azure Cosmos DB API for MongoDB collections, and the `contentVector` field is populated (along with a vector index created). You can run the `catch_up.js` script to load sample data, generate/populate the `contentVector` field and create the vector search index in each collection.

>**Note**: This script will take a few minutes to run. This script will load data, generate the `contentVector` field, and create the vector index in the `products` collection only. This `products` collection is the focus of the instructions provided in this lab.

1. In the Visual Studio Code terminal, ensure you are in the `langchain` lab directory.

2. Run the `catch_up.js` script to satisfy the lab pre-requisites.

    ```bash
    node catch_up.js
    ```

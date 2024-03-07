# Lab - Explore and use Azure OpenAI models from code

## OpenAI Client Library

When integrating Azure OpenAI service in a solution written in Node.js, the OpenAI NPM client library is used. This library is maintained by OpenAI, and is compatible with the Azure OpenAI service.

Install the latest openai client library using `npm`:

```bash
npm install @langchain/openai
```

Create a new `app.js` file for the Node.js program, and add the following variable definition using `require` so the app can use the OpenAI library.

```javascript
const { ChatOpenAI } = require("@langchain/openai");
```

## Chat completions

Create the Azure OpenAi client to call the Azure OpenAI Chat completion API:

```javascript
const llm = new ChatOpenAI({
  temperature: 0,
  azureOpenAIApiInstanceName: "<azure-openai-service-name>",
  azureOpenAIApiKey: "<azure-openai-key>",
  azureOpenAIApiVersion: "2023-05-15", 
  azureOpenAIApiDeploymentName: "completions"
});
```

> **Note**: The `azureOpenAIApiVersion` is included to specify the API version for calls to the Azure OpenAI service.

Once the Azure OpenAI client to be used for Chat completion has been created, the next step is to call the `.invoke` method on the client to perform a chat completion.

```javascript
var chatResponse = chatClient.invoke([
    ["system", "You are a helpful, fun and friendly sales assistant for Cosmic Works, a bicycle and bicycle accessories store."],
    ["user", "Do you sell bicycles?"],
    ["assistant", "Yes, we do sell bicycles. What kind of bicycle are you looking for?"],
    ["user", "I'm not sure what I'm looking for. Could you help me decide?"]
]);
```

The `.invoke` method returns a Javascript Promise object for asynchronous programming. In this example the next step is to call the `.then` method on the promise, passing it a function that writes the `.content` response string from the Azure OpenAI service to the console.

```javascript
chatResponse.then((res) => {
    var message = res.content;
    console.log(message);
});
```

The response from the Azure OpenAI service should be similar to the following:

`Of course! I'd be happy to help you find the perfect bicycle. First, let's start with some basic questions. Are you looking for a bike for commuting, mountain biking, road cycling, or something else?`

> **Note**: The [`openai` Node.js library documentation](https://platform.openai.com/docs/guides/text-generation/chat-completions-api?lang=node.js) has further information on making Chat Completion calls to the service.
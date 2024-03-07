# Lab - Explore and use Azure OpenAI models from code

## OpenAI Client Library

When integrating Azure OpenAI service in a solution written in Node.js, the OpenAI NPM client library is used. This library is maintained by OpenAI, and is compatible with the Azure OpenAI service.

Install the latest openai client library using `npm`:

```bash
npm install @azure/openai
```

Create a new `app.js` file for the Node.js program, and add the following variable definition using `require` so the app can use the OpenAI library.

```javascript
const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
```

## Chat completions

Create the Azure OpenAI client to call the Azure OpenAI Chat completion API:

```javascript
const client = new OpenAIClient(
    , //"<azure-openai-service-endpoint",
    new AzureKeyCredential("bc391df99b50462092a77d5bf1445f44") //"<azure-openai-service-key>")
    );
```

Once the Azure OpenAI client to be used for Chat completion has been created, the next step is to call the `.getCompletions` method on the client to perform a chat completion.

```javascript
const chatResponse = client.getChatCompletions(
    "completions", // deployment name
    [
        {role: "system", content: "You are a helpful, fun and friendly sales assistant for Cosmic Works, a bicycle and bicycle accessories store."},
        {role: "user", content: "Do you sell bicycles?"},
        {role: "assistant", content: "Yes, we do sell bicycles. What kind of bicycle are you looking for?"},
        {role: "user", content: "I'm not sure what I'm looking for. Could you help me decide?"}
    ]);
```

The `.getCompletions` method returns a Javascript Promise object for asynchronous programming. In this example the next step is to call the `.then` method on the promise, passing it a function that writes the response from Azure OpenAI to the console.

```javascript
chatResponse.then((result) => {
    for (const choice of result.choices) {
        console.log(choice.text);
    }
}).catch((err) => console.log(`Error: ${err}`));
```

The response from the Azure OpenAI service should be similar to the following:

`Of course! I'd be happy to help you find the perfect bicycle. First, let's start with some basic questions. Are you looking for a bike for commuting, mountain biking, road cycling, or something else?`

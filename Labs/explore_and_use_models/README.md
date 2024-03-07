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
    "<azure-openai-service-endpoint",
    new AzureKeyCredential("<azure-openai-service-key>")
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
        console.log(choice.message.content);
    }
}).catch((err) => console.log(`Error: ${err}`));
```

The response from the Azure OpenAI service should be similar to the following:

```text
Absolutely, I'd be glad to help you find the perfect bicycle. To narrow down the options, let's consider a few questions:

1. **Purpose**: What do you want to use the bike for? Are you looking for a bike for commuting, road cycling, mountain biking, recreational riding, or maybe a versatile hybrid?

2. **Riding Surface**: Where do you plan to ride? Are you going to be on paved roads, trails, or a mix of both?

3. **Experience Level**: Are you a beginner, intermediate, or experienced cyclist?

4. **Comfort and Fit**: Do you have any specific comfort needs or preferences? For example, some riders prefer a more upright riding position, while others might want a bike that allows for a more aggressive posture.

5. **Budget**: How much are you looking to spend on your new bike?

6. **Features**: Are there any specific features you're interested in? For example, some people want a bike with space for luggage racks and fenders, while others might prioritize a lightweight frame and high-performance components.

7. **Frequency of Use**: How often do you anticipate riding the bike?

Once I have a better understanding of what you're looking for, I can recommend some options that would be a good fit for your needs.
```

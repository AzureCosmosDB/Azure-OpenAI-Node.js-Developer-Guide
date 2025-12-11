const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const client = new OpenAIClient(
    "<azure-openai-service-endpoint",
    new AzureKeyCredential("<azure-openai-service-key>")
    );

const chatResponse = client.getChatCompletions(
    "completions", // deployment name
    [
        {role: "system", content: "You are a helpful, fun and friendly sales assistant for Cosmic Works, a bicycle and bicycle accessories store."},
        {role: "user", content: "Do you sell bicycles?"},
        {role: "assistant", content: "Yes, we do sell bicycles. What kind of bicycle are you looking for?"},
        {role: "user", content: "I'm not sure what I'm looking for. Could you help me decide?"}
    ]);

chatResponse.then((result) => {
    for (const choice of result.choices) {
        console.log(choice.message.content);
    }
}).catch((err) => {
    console.log(JSON.stringify(err));
    console.log(`Error: ${err}`)
});

/*
https://learn.microsoft.com/en-us/azure/ai-services/openai/quickstart?tabs=command-line%2Cpython&pivots=programming-language-javascript
*/
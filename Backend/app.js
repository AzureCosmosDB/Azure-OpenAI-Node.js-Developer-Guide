const express = require('express')
const swagger = require('./swagger')

const app = express()

/* Health probe endpoint. */
/**
 * @openapi
 * /:
 *   get:
 *     description: Health probe endpoint
 *     responses:
 *       200:
 *         description: Returns status=ready json
 */
app.get('/', (req, res) => {
    res.send({"status": "ready"});
});

/**
 * @openapi
 * /ai:
 *   get:
 *     description: Run the Cosmic Works AI agent
 *     responses:
 *       200:
 *         description: Returns the OpenAI response.
 */
app.get('/ai', async (req, res) => {
    const CosmicWorksAIAgent = await import('cosmic_works');
    var prompt = req.query.prompt;
    var session_id = req.query.session_id;
    var result = CosmicWorksAIAgent(prompt);
    res.send({ message: result });
    //res.status(301).send()
})

swagger(app)

app.listen(80, () => {
    console.log('Server started on port 80');
});

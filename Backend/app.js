const express = require('express');
const swagger = require('./swagger');
const CosmicWorks = require('./cosmic_works/cosmic_works');  

const app = express();
app.use(express.json());

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

app.post('/ai', async (req, res) => {    
    const agent = new CosmicWorks();
    var prompt = req.body.prompt;
    var session_id = req.body.session_id;    
    var result = await agent.executeAgent(prompt);    
    res.send({ message: result });    
})


swagger(app)

app.listen(4242, () => {
    console.log('Server started on port 4242');
});

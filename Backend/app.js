const express = require('express');
const cors = require('cors')
const swagger = require('./swagger');
const CosmicWorksAIAgent = require('./cosmic_works/cosmic_works_ai_agent');

const app = express();
app.use(express.json());
app.use(cors()); // enable all CORS requests


// This map is to store agents and their chat history for each session.
// This is for demonstration only and should be hydrated by storing these
// values in a database rather than in-memory.
let agentInstancesMap = new Map();

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
    res.send({ "status": "ready" });
});


/**
 * @openapi
 * /ai:
 *   post:
 *     description: Run the Cosmic Works AI agent
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 default: ""
 *               session_id:
 *                 type: string
 *                 default: "1234"
 *     responses:
 *       200:
 *         description: Returns the OpenAI response.
 */
app.post('/ai', async (req, res) => {
    let agent = {};
    let prompt = req.body.prompt;
    let session_id = req.body.session_id;

    if (agentInstancesMap.has(session_id)) {
        agent = agentInstancesMap.get(session_id);
    } else {
        agent = new CosmicWorksAIAgent();
        agentInstancesMap.set(session_id, agent);
    }

    let result = await agent.executeAgent(prompt);
    res.send({ message: result });
});

swagger(app)


// parse out hosting port from cmd arguments if passed in
// otherwise default to port 4242
var port = (() => {
    const { argv } = require('node:process');
    var port = 4242; // default
    if (argv){
        argv.forEach((v, i) => {
            if (v && (v.toLowerCase().startsWith('port=')))
            {
                port = v.substring(5);
            }
        });
    }
    return port;
})();

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

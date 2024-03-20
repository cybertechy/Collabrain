const express = require('express');
const router = express.Router();

const API_TOKEN = "ASK OWNER"
const Account = "ASK OWNER";
const Model = "ASK OWNER";


const fetchDataFromAI = async function run(input) {

    let messages = [
        { role: "system", content: "Produce a small and accurate mermaid syntax flowchart / graph for the topic .No description only mermaid syntax answer. Assume you have to create a diagram if not specified." },
        {
            role: "user",
            content: input
        }
    ]


    let body = {
        messages,
        max_tokens: 300,
    }
    const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${Account}/ai/run/${Model}`,
        {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            method: "POST",
            body: JSON.stringify(body),
        }
    );

    const result = await response.json();
    return result;
}

router.get("/", async (req, res) => {
    const query = req.query.query;
    let queryResult = await fetchDataFromAI(query);

    // use regex and get content betwen the ```
    let content = String(queryResult.result.response)
    if(!content) {
        res.json({error: "No content found"});
        return;
    }
    

    let parts = content.split("```");
    if(parts.length < 2) {
        res.json({error: "No mermaid syntax found"});
        return;
    }

    let match = parts[1].match(/[^]*[^]*/);
    // Remove the word mermaid from the string
    let mermaid = match[0].replace("mermaid", "");
    
    queryResult = {
        mermaid: mermaid
    }

    res.json(queryResult);
});


module.exports = router;
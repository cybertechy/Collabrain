const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const API_TOKEN = process.env.AI_API_TOKEN;
const Account = process.env.AI_ACCOUNT;
const Model = process.env.AI_MODEL;


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
    let queryResult 
    try {
        queryResult = await fetchDataFromAI(query);
    } catch (e) {
        res.status(500).json({ error: "Error in AI model" });
        return;
    }

    // use regex and get content betwen the ```
    if (!queryResult?.result) {
        res.json({ error: "No result found" });
        return;
    }

    let content = String(queryResult.result.response)
    if (!content) {
        res.json({ error: "No content found" });
        return;
    }


    let parts = content.split("```");
    if (parts.length < 2) {
        res.json({ error: "No mermaid syntax found" });
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
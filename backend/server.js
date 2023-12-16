const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const port = 8080;

// Get the Routes
const AuthRoutes = require("./routes/Authentication.js");


// Use the Routes
app.use("/api/auth", AuthRoutes);

app.get("/api/home", (req, res) =>
{
	res.json({message: "Hello World!"});
});

app.listen(port, () =>
{
	console.log(`Server started at: http://localhost:${port}`);
});
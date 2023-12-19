const express = require('express');
const app = express();
const db = require("./firebase.js");

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const port = 8080;

// Get the Routes
// const AuthRoutes = require("./routes/Authentication.js");


// Use the Routes
// app.use("/api/auth", AuthRoutes);

app.get("/api/home", (req, res) =>
{
	res.json({message: "Hello World!"});
});

app.get("/api/add", (req, res) =>
{
	data = {
		name: "John Doe",
		email: "johndoe@gmail.com",
		password: "password",
	}
	db.addData("users", data);
	res.json({message: "Success!"});
});

app.listen(port, () =>
{
	console.log(`Server started at: http://localhost:${port}`);
});
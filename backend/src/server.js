const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./api/helpers/firebase");
const docRoute = require("./api/routes/Doc");
const strRoute = require("./api/routes/Storage");
const profileRoute = require("./api/routes/Profile");

const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use("/api/doc", docRoute);
app.use("/api/storage",strRoute);
app.use("/api/profile",profileRoute);

app.get("/api/users", (req, res) =>
{
	// Get up to 1000 users
	db.admin.auth().listUsers().then(records =>
	{
		res.json(records.users);
	})

	// Get specific user
	// db.admin.auth().getUser(req.query.uid).then(user => 
	// {
	// 	res.json(user);
	// });
});

app.get("/api/home", (req, res) =>
{
	res.json({ message: "Running" });
});

app.listen(port, () =>
{
	console.log(`Server started at: http://localhost:${port}`);
});
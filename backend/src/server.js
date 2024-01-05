const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./api/helpers/firebase");
const docRoute = require("./api/routes/Doc");
const strRoute = require("./api/routes/Storage");
const chatRoute = require("./api/routes/Chat");
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require("socket.io");

const port = process.env.PORT || 8080;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(bodyParser.json());
app.use(cors());
app.use("/api/doc", docRoute);
app.use("/api/storage", strRoute);
app.use("/api/chat", chatRoute);

app.get("/api/user", (req, res) =>
{
	// Get up to 1000 users
	db.admin.auth().listUsers().then(records =>
	{
		res.json(records.users);
	});
});

app.get("/api/user/:id", (req, res) =>
{
	// Get specific user
	db.admin.auth().getUser(req.params.id).then(user => 
	{
		res.json(user);
	});
});

app.get("/api/home", (req, res) =>
{
	res.json({ message: "Running" });
});

io.on('connection', (socket) =>
{
	socket.on('user', (msg) =>
	{
		console.log(`user ${msg.id} connected`);
	});

	socket.on('disconnect', () =>
	{
		console.log('user disconnected');
	});
});

server.listen(port, () =>
{
	console.log(`Server started at: http://localhost:${port}`);
});
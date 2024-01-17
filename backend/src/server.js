// Libs
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const http = require('http');
const { Server } = require("socket.io");

// Routes
const docRoute = require("./api/routes/Doc");
const strRoute = require("./api/routes/Storage");
const chatRoute = require("./api/routes/Chat");
const teamsRoute = require("./api/routes/Teams");

// Helpers
const db = require("./api/helpers/firebase");
const sock_server = require("./api/helpers/socket");
const userRoute = require("./api/routes/User");

const app = express();
const port = process.env.PORT || 8080;
const server = http.createServer(app);

sock_server.init(server);

app.use(bodyParser.json());
app.use(cors());
app.use("/api/doc", docRoute);
app.use("/api/storage", strRoute);
app.use("/api/chat", chatRoute);
app.use("/api/team",teamsRoute);
app.use("/api/user",userRoute);

app.get("/api/home", (req, res) =>
{
	res.json({ message: "Running" });
});

app.get("/api/cons", (req, res) =>
{
	res.json({ count: Object.keys(sock_server.curr_links).length,
		cons: sock_server.curr_links });
});

server.listen(port, () =>
{
	console.log(`Server started at: http://localhost:${port}`);
});
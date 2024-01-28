// Libs
const express = require("express");
const cors = require("cors");
const db = require("./api/helpers/firebase");
const docRoute = require("./api/routes/Doc");
const strRoute = require("./api/routes/Storage");
const contentMapRoute = require("./api/routes/ContentMap");

const bodyParser = require('body-parser');
const http = require('http');
const treblle = require('@treblle/express')

// Routes
const chatRoute = require("./api/routes/Chat");
const teamsRoute = require("./api/routes/Teams");
const userRoute = require("./api/routes/User");
const dashboardRoute = require("./api/routes/Dashboard");

// Helpers
const sockServer = require("./api/helpers/socket");

const app = express();
const port = process.env.PORT || 8080;
const server = http.createServer(app);

app.use(
	treblle({
	  apiKey: "FWAsJIjJ9SUC48XJ52CmWPzrH5V5dDn7",
	  projectId: "4n251kwdeS2Q4FUt",
	  additionalFieldsToMask: [],
	})
  );

sockServer.init(server);

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
app.use("/api/chats", chatRoute);
app.use("/api/teams",teamsRoute);
app.use("/api/users",userRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/contentmap",contentMapRoute);

app.get("/api/home", (req, res) =>
{
	res.json({ message: "Running" });
});

app.get("/api/cons", (req, res) =>
{
	res.json({ count: Object.keys(sockServer.currLinks).length,
		cons: sockServer.currLinks });
});

server.listen(port, () =>
{
	console.log(`Server started at: http://localhost:${port}`);
});
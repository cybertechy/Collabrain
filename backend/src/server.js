// Libs
const express = require("express");
const cors = require("cors");

const bodyParser = require('body-parser');
const http = require('http');
const fb = require('./api/helpers/firebase');
const dotenv = require('dotenv');


// Routes
const chatRoute = require("./api/routes/Chat");
const teamsRoute = require("./api/routes/Teams");
const userRoute = require("./api/routes/User");
const dashboardRoute = require("./api/routes/Dashboard");
const mapRoute = require("./api/routes/ContentMap");
const reportReport = require("./api/routes/Report");
const notificationsRoute = require("./api/routes/Notifications");
const docRoute = require("./api/routes/Doc");
const storageRoute = require("./api/routes/Storage");
const aiRoute = require("./api/routes/AI");
const statsRoute = require("./api/routes/Stats");
const twoFARoute = require("./api/routes/twoFA");
const callRoute = require("./api/routes/Call");

// Helpers
const sockServer = require("./api/helpers/socket");

// Config
dotenv.config();
const app = express();
const port = process.env.PORT || 8080;
const server = http.createServer(app);


// Database usage counter
let APIUsageCount = fb.getObjectFromRealtimeDB("usageCount").then((data) => { return data || 0; });
fb.listenToRealtimeDB("usageCount", (data) => {
	if(Number.isInteger(data)) APIUsageCount = data || 0;
});

// Middleware to increment database usage count
app.use((req, res, next) => {
    APIUsageCount++;
	fb.addObjectToRealtimeDB("usageCount", APIUsageCount);
    next();
});

// Set headers 
app.use(function(req, res, next) {

	// allow requests from any origin
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	// x-rate-limit
	res.setHeader('X-RateLimit-Limit', 25);
	res.setHeader('X-RateLimit-Reset', 1000);

	//CSP
	res.setHeader("Content-Security-Policy", "default-src 'self'");
	res.setHeader("X-Content-Security-Policy", "default-src 'self'");
	res.setHeader("X-WebKit-CSP", "default-src 'self'");

	// Content type
	res.setHeader('Content-Type', 'application/json');	
	next();
});

sockServer.init(server);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
app.use("/api/chats", chatRoute);
app.use("/api/teams", teamsRoute);
app.use("/api/users", userRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/maps", mapRoute);
app.use("/api/reports", reportReport);
app.use("/api/notifications", notificationsRoute);
app.use("/api/docs", docRoute); 
app.use("/api/storage", storageRoute);
app.use("/api/stats", statsRoute);
app.use("/api/ai", aiRoute);
app.use("/api/2FA", twoFARoute);
app.use("/api/calls", callRoute);

// Endpoint to display DB usage
app.get("/api/dbUsage", (req, res) => {
    res.json({ message: "Database Usage", count: APIUsageCount });
});
app.get("/api/home", (req, res) =>
{
	res.json({ message: "Running" });
});

app.get("/api/cons", (req, res) =>
{
	res.json({
		count: Object.keys(sockServer.currLinks).length,
		cons: sockServer.currLinks
	});
});

server.listen(port, () =>
{
	console.log(`Server started at: http://localhost:${port}`);
});
// Libs
const express = require("express");
const cors = require("cors");

const bodyParser = require('body-parser');
const http = require('http');
const treblle = require('@treblle/express');
const { rateLimit } = require("express-rate-limit")

// Routes
const chatRoute = require("./api/routes/Chat");
const teamsRoute = require("./api/routes/Teams");
const userRoute = require("./api/routes/User");
const dashboardRoute = require("./api/routes/Dashboard");
const mapRoute = require("./api/routes/ContentMap");
const reportReport = require("./api/routes/Report");
const notificationsRoute = require("./api/routes/Notifications");
const storageRoute = require("./api/routes/Storage");
//const statsRoute = require("./api/routes/Stats");

// Helpers
const sockServer = require("./api/helpers/socket");

// Config
const limiter = rateLimit({
	windowMs: 1000, // 2 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 2 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

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

	// // Cache the data
	// res.setHeader('Cache-Control', 'public, max-age=31557600');

	
	next();
});

app.use(limiter);

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
app.use("/api/storage", storageRoute);
//app.use("/api/stats", statsRoute);


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

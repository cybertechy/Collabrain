const express = require('express');
const app = express();
const db = require("./api/helpers/firebase.js");
const docRoute = require("./api/routes/Doc.js");

const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use("/api/doc", docRoute);

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

// app.get("/api/doc/new", (req, res) =>
// {
// 	db.verifyUser(req.query.token).then(user =>
// 	{
// 		if (!user)
// 			res.json({ message: "Invalid token" });

// 		// Get doc data and create it in Firestore
// 		db.createDoc(`${user.uid}/docs`, { owner: user.uid, title: req.query.title, content: req.query.content })
// 			.then(() => { res.json({ message: "Success!" }); }).catch((error) => { res.json({ message: error }); });
// 	});

// 	res.json({ message: "Success!" });
// });

// app.get("/api/doc/remove", (req, res) =>
// {
// 	db.verifyUser(req.query.token).then(user =>
// 	{
// 		if (!user)
// 			res.json({ message: "Invalid token" });

// 		// Remove doc from Firestore
// 		db.removeDoc(`${user.uid}/docs`, req.query.docID)
// 			.then(() => { res.json({ message: "Success!" }); }).catch((error) => { res.json({ message: error }); });
// 	});

// 	res.json({ message: "Success!" });
// });

// app.get("/api/doc/update", (req, res) =>
// {
// 	db.verifyUser(req.query.token).then(user =>
// 	{
// 		if (!user)
// 			res.json({ message: "Invalid token" });

// 		// Update doc in Firestore
// 		db.updateDoc(`${user.uid}/docs`, req.query.docID, { title: req.query.title, content: req.query.content })
// 			.then(() => { res.json({ message: "Success!" }); }).catch((error) => { res.json({ message: error }); });
// 	});

// 	res.json({ message: "Success!" });
// });

// app.get("/api/doc/get", (req, res) =>
// {
// 	db.verifyUser(req.query.token).then(user =>
// 	{
// 		if (!user)
// 			res.json({ message: "Invalid token" });

// 		// Get doc from Firestore
// 		db.getDoc(`${user.uid}/docs`, req.query.docID)
// 			.then(doc => { res.json(doc); }).catch((error) => { res.json({ message: error }); });
// 	});

// 	res.json({ message: "Success!" });
// });

app.listen(port, () =>
{
	console.log(`Server started at: http://localhost:${port}`);
});
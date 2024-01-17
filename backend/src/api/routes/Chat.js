const express = require('express');
const router = express.Router();
const db = require("../helpers/firebase");

router.get("/:team/:channel", (req, res) =>
{
	res.json({ message: "Success" });
});


module.exports = router;
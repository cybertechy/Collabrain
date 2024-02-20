const express = require('express');
const router = express.Router();
const fb = require("../helpers/firebase");

// Get the number of active users for a specific week
router.get('/weekly/:year/:week', async (req, res) => {
    const { year, week } = req.params;
    const weekDocId = `week-${year}-${week}`;

    try {
        const doc = await fb.admin.firestore().collection('stats').doc(weekDocId).get();
        if (!doc.exists) {
            return res.status(404).send({ error: 'Week stats not found' });
        }
        return res.status(200).send(doc.data());
    } catch (error) {
        console.error('Error fetching weekly stats:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

// Get the number of active users for a specific month
router.get('/monthly/:year/:month', async (req, res) => {
    const { year, month } = req.params;
    const monthDocId = `month-${year}-${month}`;

    try {
        const doc = await fb.admin.firestore().collection('stats').doc(monthDocId).get();
        if (!doc.exists) {
            return res.status(404).send({ error: 'Month stats not found' });
        }
        return res.status(200).send(doc.data());
    } catch (error) {
        console.error('Error fetching monthly stats:', error);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

module.exports = router;
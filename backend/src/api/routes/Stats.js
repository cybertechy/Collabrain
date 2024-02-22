const express = require('express');
const router = express.Router();
const { db, getWeekNumber, getCurrentMonth } = require("../helpers/firebase");

// Endpoint to get weekly active users
router.get('/weekly-active-users', async (req, res) => {
    const [year, weekNumber] = getWeekNumber(new Date());
    const weekDocId = `week-${year}-${weekNumber}`;
    try {
        const doc = await db.collection('stats').doc(weekDocId).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'No data found for this week.' });
        }
        return res.json(doc.data().activeUserIDs);
    } catch (error) {
        console.error('Error fetching weekly active users:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to get monthly active users
router.get('/monthly-active-users', async (req, res) => {
    const monthDocId = `month-${getCurrentMonth()}`;
    try {
        const doc = await db.collection('stats').doc(monthDocId).get();
        if (!doc.exists) {
            return res.status(404).json({ message: 'No data found for this month.' });
        }
        return res.json(doc.data().activeUserIDs);
    } catch (error) {
        console.error('Error fetching monthly active users:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { db, getCurrentMonth, getUserMetrics } = require("../helpers/firebase");
const dbUsageCount = require("../../../../backend/src/server.js");

// Endpoint to retrieve the total time spent by a specific user
router.get('/user-time-spent/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const userRef = db.collection('users').doc(userId);
        const doc = await userRef.get();
        if (!doc.exists) {
            return res.status(404).send('User not found');
        }
        const userData = doc.data();
       
        const timeSpent = userData.timeSpent || 0;
        res.json({ userId, timeSpent });
    } catch (error) {
        console.error('Error getting user time spent:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to retrieve the number of active users for a given week or month
router.get('/active-users', async (req, res) => {
    const { period, year, weekNumber, month } = req.query;
    let docId;

    if (period === 'week') {
        docId = `week-${year}-${weekNumber}`;
    } else if (period === 'month') {
        docId = `month-${year}-${month}`;
    } else {
        return res.status(400).send('Invalid period specified. Please use "week" or "month".');
    }
    try {
        const statsRef = db.collection('stats').doc(docId);
        const doc = await statsRef.get();
        if (!doc.exists) {
            return res.status(404).send('Stats document not found.');
        }
        const data = doc.data();
        const activeUserCount = data.activeUserIDs ? data.activeUserIDs.length : 0;
        res.json({ period: docId, activeUserCount });
    } catch (error) {
        console.error('Error retrieving active users:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Endpoint to get metrics for a random user
router.get('/random-user-metrics', async (req, res) => {
    try {
      const userMetrics = await getUserMetrics();
      if (!userMetrics) {
        return res.status(404).send('User metrics not found');
      }
      // Ensure the response includes all expected fields
      const response = {
        userId: userMetrics.userId,
        score: userMetrics.score || 0, // Provide default values if the fields are undefined
        monthlyMessageCount: userMetrics.monthlyMessageCount || 0,
        timeSpent: userMetrics.timeSpent || 0
      };
      res.json(response);
    } catch (error) {
      console.error('Failed to get random user metrics:', error);
      res.status(500).send('Internal Server Error');
    }
  });


// Endpoint to retrieve the monthly message count for a user
router.get('/monthly-messages/:userId', async (req, res) => {
    const userId = req.params.userId;
    const currentMonth = getCurrentMonth();
    const userRef = db.collection('users').doc(userId);
    
    try {
        const doc = await userRef.get();
        if (!doc.exists) {
            return res.status(404).send('User not found');
        }
        const userData = doc.data();
        const monthlyMessageCount = userData.monthlyMessageCount ? userData.monthlyMessageCount[currentMonth] : 0;
        res.json({
            userId,
            month: currentMonth,
            monthlyMessageCount
        });
    } catch (error) {
        console.error('Error retrieving monthly message count:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to retrieve the number of active members in a team
router.get('/team/:teamId/active-members', async (req, res) => {
    const { teamId } = req.params;
    try {
        const teamRef = db.collection('teams').doc(teamId);
        const doc = await teamRef.get();
        if (!doc.exists) {
            return res.status(404).send('Team not found');
        }
        const teamData = doc.data();
        const activeMembersCount = teamData.activeUserIDs ? teamData.activeUserIDs.length : 0;
        res.json({
            teamId,
            activeMembersCount
        });
    } catch (error) {
        console.error('Error retrieving active team members:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
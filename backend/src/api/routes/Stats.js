const express = require('express');
const router = express.Router();
const { db, getWeekNumber, getCurrentMonth, getUserMetrics } = require("../helpers/firebase");
const dbUsageCount = require("../../../../backend/src/server.js");

// Endpoint to retrieve the total time spent by a specific user, as well as their monthly message count
router.get('/userinfo/:userId', async (req, res) => {
    const userId = req.params.userId;
    const currentMonth = getCurrentMonth();
    try {
        const userRef = db.collection('users').doc(userId);
        const doc = await userRef.get();
        if (!doc.exists) {
            return res.status(404).send('User not found');
        }
        const userData = doc.data();
        const timeSpent = userData.timeSpent || 0;
        const monthlyMessageCount = userData.monthlyMessageCount ? userData.monthlyMessageCount[currentMonth] : 0;
        
        res.json({
            userId,
            timeSpent,
            month: currentMonth,
            monthlyMessageCount
        });
    } catch (error) {
        console.error('Error getting user stats:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to retrieve the number of active users for the current week and month
router.get('/active-users', async (req, res) => {
    const now = new Date();
    const [currentYear, currentWeekNumber] = getWeekNumber(now);
    const currentMonth = getCurrentMonth(); // Returns "YYYY-MM"

    const weekDocId = `week-${currentYear}-${currentWeekNumber}`;
    const monthDocId = `month-${currentMonth}`;

    try {
        const weekStats = await db.collection('stats').doc(weekDocId).get();
        const monthStats = await db.collection('stats').doc(monthDocId).get();

        const weeklyActiveUsers = weekStats.exists ? (weekStats.data().activeUserIDs || []).length : 0;
        const monthlyActiveUsers = monthStats.exists ? (monthStats.data().activeUserIDs || []).length : 0;

        res.json({
            weekly: { period: weekDocId, activeUserCount: weeklyActiveUsers },
            monthly: { period: monthDocId, activeUserCount: monthlyActiveUsers }
        });
    } catch (error) {
        console.error('Error retrieving active users summary:', error);
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
     
      const response = {
        userId: userMetrics.userId,
        score: userMetrics.score || 0,
        monthlyMessageCount: userMetrics.monthlyMessageCount || 0,
        timeSpent: userMetrics.timeSpent || 0
      };
      res.json(response);
    } catch (error) {
      console.error('Failed to get random user metrics:', error);
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
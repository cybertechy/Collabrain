const express = require('express');
const router = express.Router();
const { db, getWeekNumber, getCurrentMonth, getUserMetrics } = require("../helpers/firebase");
const dbUsageCount = require("../../../../backend/src/server.js");

// Endpoint to retrieve the total time spent by a specific user, as well as their monthly message count
router.get('/userinfo', async (req, res) => {
    const currentMonth = getCurrentMonth();
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();
        if (snapshot.empty) {
            return res.status(404).send('No users found');
        }

        const usersData = [];
        snapshot.forEach(doc => {
            const userData = doc.data();
            const timeSpent = userData.timeSpent || 0;
            const monthlyMessageCount = userData.monthlyMessageCount ? userData.monthlyMessageCount[currentMonth] : 0;

            usersData.push({
                userId: doc.id,
                timeSpent,
                month: currentMonth,
                monthlyMessageCount
            });
        });

        res.json(usersData);
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

        const weeklyActiveUsers = weekStats.exists ? (weekStats.data().activeUsers || 0) : 0;
        const monthlyActiveUsers = monthStats.exists ? (monthStats.data().activeUsers || 0) : 0;

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
        const response = {
            VideoCalling: Math.floor(Math.random() * 1000),
            Messaging: Math.floor(Math.random() * 2000),
            ContentMaps: Math.floor(Math.random() * 1700),
            Documents: Math.floor(Math.random() * 1500),
        };
        res.json(response);
    } catch (error) {
        console.error('Failed to get random user metrics:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Endpoint to retrieve the number of active members in all teams
router.get('/active-members', async (req, res) => {
    try {
        const teamsRef = db.collection('teams');
        const snapshot = await teamsRef.get();
        if (snapshot.empty) {
            return res.status(404).send('No teams found');
        }

        const teamsActiveMembersCount = [];
        snapshot.forEach(doc => {
            const teamData = doc.data();
            const activeMembersCount = teamData.activeUserIDs ? teamData.activeUserIDs.length : 0;
            teamsActiveMembersCount.push({
                teamId: doc.data().name,
                activeMembersCount
            });
        });

        res.json(teamsActiveMembersCount);
    } catch (error) {
        console.error('Error retrieving active team members:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
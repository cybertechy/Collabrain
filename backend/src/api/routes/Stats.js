const express = require('express');
const router = express.Router();
const { db, getCurrentMonth, getUserMetrics } = require("../helpers/firebase");
const dbUsageCount = require("../../../../backend/src/server.js");

// Unified Stats Endpoint
router.get('/stats', async (req, res) => {
    const { type, userId, teamId, period, year, weekNumber, month } = req.query;

    try {
        switch (type) {
            case 'user-time-spent':
                await getUserTimeSpent(userId, res);
                break;
            case 'active-users':
                await getActiveUsers(period, year, weekNumber, month, res);
                break;
            case 'random-user-metrics':
                await getRandomUserMetrics(res);
                break;
            case 'database-usage':
                getDatabaseUsage(res);
                break;
            case 'monthly-messages':
                await getMonthlyMessages(userId, res);
                break;
            case 'team-active-members':
                await getTeamActiveMembers(teamId, res);
                break;
            default:
                res.status(400).send('Invalid statistics type specified.');
        }
    } catch (error) {
        console.error(`Error retrieving ${type}:`, error);
        res.status(500).send('Internal Server Error');
    }
});

// Retrieves the total time spent on the platform by a specific user
async function getUserTimeSpent(userId, res) {
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    if (!doc.exists) {
        res.status(404).send('User not found');
        return;
    }
    const userData = doc.data();
    const timeSpent = userData.timeSpent || 0;
    res.json({ userId, timeSpent });
}

// Retrieves the number of active users for a given week or month
async function getActiveUsers(period, year, weekNumber, month, res) {
    let docId;
    if (period === 'week') {
        docId = `week-${year}-${weekNumber}`;
    } else if (period === 'month') {
        docId = `month-${year}-${month}`;
    }
    const statsRef = db.collection('stats').doc(docId);
    const doc = await statsRef.get();
    if (!doc.exists) {
        return res.status(404).send('Stats document not found.');
    }
    const data = doc.data();
    const activeUserCount = data.activeUserIDs ? data.activeUserIDs.length : 0;
    res.json({ period: docId, activeUserCount });
}

// Retrieves metrics of a random user
async function getRandomUserMetrics(res) {
    const userData = await getUserMetrics();
        if (userData) {
            res.json(userData);
        } else {
            res.status(404).send('No user metrics found.');
        }
}

// Retrieves database usage count
function getDatabaseUsage(res) {
   res.json({ message: 'Database Usage Count', count: dbUsageCount});
}

// Retrieves the monthly message count for a user
async function getMonthlyMessages(userId, res) {
    const currentMonth = getCurrentMonth(); 
    const userRef = db.collection('users').doc(userId);
    
    const doc = await userRef.get();
    if (!doc.exists) {
        return res.status(404).send('User not found');
    }
    
    const userData = doc.data();
    const monthlyMessageCount = userData.monthlyMessageCount ? userData.monthlyMessageCount[currentMonth] : 0;
    res.json({userId, month: currentMonth, monthlyMessageCount});
}

// Retrieves the number of active members in a team
async function getTeamActiveMembers(teamId, res) {
    const teamRef = db.collection('teams').doc(teamId);
    const doc = await teamRef.get();
    if (!doc.exists) {
        return res.status(404).send('Team not found');
    }
    const teamData = doc.data();
    const activeMembersCount = teamData.activeUserIDs ? teamData.activeUserIDs.length : 0;
    res.json({ teamId, activeMembersCount});
}

module.exports = router;

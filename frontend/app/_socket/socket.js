const { io } = require('socket.io-client');
const { getUserID, getToken } = require('_firebase/auth');

function initializeSocket(url)
{
	alert('Initializing socket');
	const socket = io(url);

	socket.on('connect', () =>
	{
		console.log('Connected to server');
	});

	socket.on('disconnect ', () =>
	{
		console.log('Disconnected from server');
	});
}

module.exports = {
	initializeSocket
};
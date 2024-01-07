const { io } = require('socket.io-client');
const { getUserID } = require('_firebase/firebase');

let socket;

const emit = (event, data) => socket.emit(event, data);

function init(url)
{
	socket = io(url);

	socket.on('connect', () =>
	{
		console.log('Connected to server');
		socket.emit('user', { id: getUserID() });
	});

	socket.on('disconnect ', () =>
	{
		console.log('Disconnected from server');
	});
}

module.exports = {
	init,
	emit
};
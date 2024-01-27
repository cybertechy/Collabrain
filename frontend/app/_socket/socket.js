const { io } = require('socket.io-client');
const { getUserID } = require('_firebase/firebase');

let cli;

function init(url)
{
	if (cli)
		return cli;

	cli = io(url);

	cli.on('connect', () =>
	{
		console.log('Connected to server');
		cli.emit('user', { id: getUserID() });
	});

	cli.on('disconnect ', () =>
	{
		console.log('Disconnected from server');
	});

	return cli;
}

module.exports = {
	init,
};
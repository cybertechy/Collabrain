const { Server } = require("socket.io");
const db = require("./firebase");

/** @type Server */
let io;

// Current connections
let curr_links = {};

function init(server)
{
	io = new Server(server, { cors: { origin: "*" } });

	io.on('connection', (socket) =>
	{
		socket.on('user', (msg) =>
		{
			console.log(`user ${msg.id} connected`);
			curr_links[socket.id] = msg.id;
		});

		socket.on('disconnect', () =>
		{
			delete curr_links[socket.id];
			console.log('user disconnected');
		});

		socket.on('teamMsg', (data) =>
		{
			console.log(`teamMsg: ${data.msg}`);
			broadcastTeamChat(data.team, data.msg);
		});
	});
}

function broadcastTeamChat(teamName, msg)
{
	// Find all users in the same team from firebase
	db.getTeamMembers(teamName, msg);
}

function sendMsg(msg)
{
	io.emit("msg", msg);
}

module.exports = {
	init
};
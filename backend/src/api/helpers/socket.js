const { Server } = require("socket.io");
const fb = require("./firebase");

/** @type Server */
let io;

// Current connections
let currLinks = {};

function init(server)
{
	io = new Server(server, { cors: { origin: "*" } });

	io.on('connection', (socket) =>
	{
		socket.on('user', (msg) =>
		{
			console.log(`user ${msg.id} connected`);
			currLinks[msg.id] = socket.id;
		});

		socket.on('disconnect', () =>
		{
			// Find the user and delete it
			let ref = Object.keys(currLinks).find((key) => currLinks[key] === socket.id);
			delete currLinks[ref];
			console.log('user disconnected');
		});

		socket.on('teamMsg', (data) =>
		{
			broadcastTeamChat(data);
		});
	});
}

async function broadcastTeamChat(data)
{
	let members = await fb.getTeamMembers(data.team);
	let membersList = Object.keys(members);

	// Remove the sender
	const index = membersList.indexOf(data.sender);
	if (index > -1) // only splice array when item is found
		membersList.splice(index, 1); // 2nd parameter means remove one item only

	// Send to all online members
	membersList.forEach((member) =>
	{
		if (Object.keys(currLinks).includes(member))
			io.to(currLinks[member]).emit('teamMsg', data);
	});

	fb.saveTeamMsg(data);
}

module.exports = {
	init,
	currLinks
};
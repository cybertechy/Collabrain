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

		socket.on('teamMsg', (data) => broadcastMessage(data));

		socket.on('directMsg', (data) =>
		{
			broadcastMessage(data, "direct");
		});
	});
}

async function broadcastMessage(data, type = "team")
{
	let members = type == "team" ? await fb.getTeamMembers(data.team): await fb.getChatMembers(data.chat) ;
	let membersList = members;

	// if their is a sentAt field, convert it to a firebase timestamp
	let DateBackup = data.sentAt;
	if (data.sentAt){
		data.sentAt = fb.admin.firestore.Timestamp.fromDate(new Date(data.sentAt));
	}

	// Remove the sender
	const index = membersList.indexOf(data.senderID);
	if (index > -1) // only splice array when item is found
		membersList.splice(index, 1); // 2nd parameter means remove one item only

	// Send to all online members
	membersList.forEach((member) =>
	{
		if (Object.keys(currLinks).includes(member))
			io.to(currLinks[member]).emit((type == "team") ? "teamMsg" : "directMsg", data);
	});

	// Restore the sentAt field
	data.sentAt = DateBackup;
	(type == "team") ? fb.saveTeamMsg(data) : fb.saveDirectMsg(data);
}

module.exports = {
	init,
	currLinks
};
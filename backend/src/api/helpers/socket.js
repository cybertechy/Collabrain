const { Server } = require("socket.io");
const fb = require("./firebase");
const oci = require("../helpers/oracle");

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

		socket.on('teamMsg', data => broadcastMessage(data));
		socket.on('directMsg', data => broadcastMessage(data, "direct"));

		socket.on('send-doc-changes', data => broadcastDocChanges(data, socket, "input"));

		socket.on('send-doc-cursor-changes', data => broadcastDocChanges(data, socket, "cursor"));

		socket.on('join-doc', doc => 
		{
			console.log(`${socket.id} joined doc: ${doc}`);
			socket.join(doc);
		});

		socket.on('leave-doc', doc => 
		{
			console.log(`${socket.id} left doc: ${doc}`);
			socket.leave(doc);
		});

		socket.on('save-doc', data => oci.addData("B3", data.ociID, "application/json", JSON.stringify(data.data)));
	});
}

async function broadcastMessage(data, type = "team")
{
	let members = await fb.getTeamMembers((type == "team") ? data.team : data.chat);
	let membersList = Object.keys(members);

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

	(type == "team") ? fb.saveTeamMsg(data) : fb.saveDirectMsg(data);
}

async function broadcastDocChanges(data, socket, type)
{
	if (type == "cursor")
		socket.broadcast.to(data.doc).emit('get-doc-cursor-changes', data.data);
	else
		socket.broadcast.to(data.doc).emit('get-doc-changes', data.data);
}

module.exports = {
	init,
	currLinks
};
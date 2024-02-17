const { Server } = require("socket.io");
const fb = require("./firebase");
const uuid = require("uuid");

/** @type Server */
let io;

// Current connections
let currLinks = {};
let rooms = {};

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

			// Remove the user from all rooms
			Object.keys(rooms).forEach((room) =>
			{
				if (rooms[room].members[ref])
				{
					delete rooms[room].members[ref];
					if (Object.keys(rooms[room].members).length == 0) delete rooms[room];
					
				}
				console.log(`user ${ref} left room ${room}`)
			});
			
			console.log('user disconnected');
		});

		socket.on('teamMsg', (data) => broadcastMessage(data));

		socket.on('directMsg', (data) =>
		{
			broadcastMessage(data, "direct");
		});

		//Join a collab room
		socket.on('startCollab', (data) =>
		{

			// Limit room capacity to 10
			if( Object.keys(rooms).length > 10 ) return socket.emit('roomFull', {msg: "Sever is overloaded, try again later"});

			// Create a room
			if (!rooms[data.id]) rooms[data.id] = {id: data.id, members: {[data.user.id]:data.user}};
			else rooms[data.id].members[data.user.id] = data.user;

		
			socket.join(data.id);
			console.log(`user ${data.user.id} joined room ${data.id}`)
			
		});

		//Leave a collab room
		socket.on('stopCollab', (data) =>
		{
			// Remove the user from the room
			rooms[data.id].members = rooms[data.id].members.filter((member) => member != data.user);
			socket.leave(data.id);

			// Delete the room if it's empty
			if (rooms[data.id].members.length == 0) delete rooms[data.id];

			console.log(`user ${data.user} left room ${data.id}`)
		});

		//send collab data to all members
		socket.on('collabData', ({id,user,data}) =>
		{
			if(! rooms[id]?.members[user]) return socket.emit('reconnectRoom', {msg: "You are not a member of this room"});
			data.ActiveMembers = rooms[id]?.members ? Object.keys(rooms[id].members).length : 0;
			io.to(id).emit('updateCollabData', data);
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
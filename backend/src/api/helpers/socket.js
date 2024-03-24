const { Server } = require("socket.io");
const fb = require("./firebase");
const oci = require("../helpers/oracle");
const uuid = require("uuid");
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

/** @type Server */
let io;

// Current connections
let currLinks = {};
let rooms = {};
let connectionTimes = {};

// DEBUG controller
const DEBUG = false;

// Redis controller
let BAPS_ERROR = false;
let BAPS_ERROR_ID = null;

// Initialize the socket server
function init(server)
{

	io = new Server(server, { cors: { origin: "*" } });

	connectToRedis(io);

	// Sync up with the database
	fb.getObjectFromRealtimeDB("currLinks").then((data) =>
	{
		currLinks = data.val() || {};
	});
	fb.getObjectFromRealtimeDB("rooms").then((data) =>
	{
		rooms = data.val() || {};
	});

	fb.getObjectFromRealtimeDB("connectionTimes").then((data) =>
	{
		connectionTimes = data.val() || {};
	});

	// Listen for connections
	fb.listenToRealtimeDB("currLinks", (data) =>
	{
		currLinks = data || {};
		if (DEBUG) console.log("Listen currLinks: ", currLinks);
	});

	fb.listenToRealtimeDB("rooms", (data) =>
	{
		rooms = data || {};
	});

	fb.listenToRealtimeDB("connectionTimes", (data) =>
	{
		connectionTimes = data || {};
	});

	io.on('connection', (socket) =>
	{
		socket.on('user', (msg) =>
		{
			if (DEBUG) console.log(`user ${msg.id} connected`);
			currLinks[msg.id] = socket.id;
			// FSR1 - Difference between user connecting and disconnecting
			connectionTimes[msg.id] = Date.now();

			// Save the user to the database
			fb.addObjectToRealtimeDB("currLinks", currLinks);
			fb.addObjectToRealtimeDB("connectionTimes", connectionTimes);
		});

		socket.on('disconnect', () =>
		{
			// Find the user and delete it
			let ref = Object.keys(currLinks).find((key) => currLinks[key] === socket.id);
			if (ref)
			{
				let disconnectTime = Date.now();
				let connectTime = connectionTimes[ref];
				if (DEBUG) console.log(`Connection time: ${connectTime}, Disconnect time: ${disconnectTime}`);
				if (connectTime)
				{
					let timeSpent = disconnectTime - connectTime; // Time spent in milliseconds

					// Update the timeSpent for the user in Firebase
					fb.db.collection('users').doc(ref).update({
						timeSpent: fb.admin.firestore.FieldValue.increment(timeSpent)
					})
						.catch((error) => console.error(error));

					// Cleanup
					delete connectionTimes[ref]; // Ensure to remove the user from here as well
					if (DEBUG) console.log(`user disconnected, time spent: ${timeSpent}ms`);
				}

				delete currLinks[ref];

				// Remove the user from all rooms
				Object.keys(rooms).forEach((room) =>
				{
					if (rooms[room].members[ref])
					{
						delete rooms[room].members[ref];
						if (Object.keys(rooms[room].members).length == 0) delete rooms[room];

					}
					if (DEBUG) console.log(`user ${ref} left room ${room}`);
				});
			}

			// Save the user to the database
			fb.addObjectToRealtimeDB("currLinks", currLinks);
			fb.addObjectToRealtimeDB("rooms", rooms);
			fb.addObjectToRealtimeDB("connectionTimes", connectionTimes);
		});

		socket.on('teamMsg', (data) => broadcastMessage(data, "team", true));

		socket.on('directMsg', (data) =>
		{
			broadcastMessage(data, "direct", true);
		});

		socket.on('updateDirectMessage', (data) =>
		{
			broadcastMessage(data, "direct", false);
		});

		socket.on('updateTeamMessage', (data) =>
		{
			broadcastMessage(data, "team", false);
		});

		socket.on('deleteDirectMessage', (data) =>
		{
			broadcastMessage(data, "direct", false, true);
		});

		socket.on('deleteTeamMessage', (data) =>
		{
			broadcastMessage(data, "team", false, true);
		});

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

		//Join a collab room
		socket.on('startCollab', (data) =>
		{
			// Limit room capacity to 10
			if (Object.keys(rooms).length > 10) return socket.emit('roomFull', { msg: "Sever is overloaded, try again later" });

			// Create a room
			if (!rooms[data.id]) rooms[data.id] = { id: data.id, members: { [data.user.id]: data.user } };
			else rooms[data.id].members[data.user.id] = data.user;


			socket.join(data.id);
			if (DEBUG) console.log(`user ${data.user.id} joined room ${data.id}`);

			// Sync up with the database
			fb.addObjectToRealtimeDB("rooms", rooms);

		});

		//Leave a collab room
		socket.on('stopCollab', (data) =>
		{
			Object.keys(rooms).forEach((room) =>
			{
				if (rooms[room].members[data.user.id])
				{
					delete rooms[room].members[data.user.id];
					if (Object.keys(rooms[room].members).length == 0) delete rooms[room];

				}
				if (DEBUG) console.log(`user ${data.user.id} left room ${room}`);
			});

			fb.addObjectToRealtimeDB("rooms", rooms);
		});

		//send collab data to all members
		socket.on('collabData', ({ id, user, data }) =>
		{
			if (!rooms[id]?.members[user]) return socket.emit('reconnectRoom', { msg: "You are not a member of this room" });

			data.activeMembers = Object.keys(rooms[id].members).filter((member) => member != user);

			io.to(id).emit('updateCollabData', data);
		});

		// Listen to changes to calls in realtime database
		const directCallsRef = fb.realtimeDB.ref("calls/chat");

		// Set up the listeners
		directCallsRef.on("child_added", function (snapshot)
		{
			const addedData = {
				id: snapshot.key, // Chat ID
				...snapshot.val() // Include the value of the object
			};

			// Get chat members
			fb.getChatMembers(addedData.id).then((members) =>
			{
				// Send call-started event to online members
				members.forEach((member) =>
				{
					if (Object.keys(currLinks).includes(member))
						if (currLinks[member] != socket.id) // Don't send to the user who started the call
							io.to(currLinks[member]).emit("chat-call-started", addedData);
				});
			});
		});

		directCallsRef.on("child_removed", function (snapshot)
		{
			const removedData = {
				id: snapshot.key, // Chat ID
				...snapshot.val()
			};

			// Get chat members
			fb.getChatMembers(removedData.id).then((members) =>
			{
				// Send call-ended event to online members
				members.forEach((member) =>
				{
					if (Object.keys(currLinks).includes(member))
						if (currLinks[member] != socket.id) // Don't send to the user who ended the call
							io.to(currLinks[member]).emit("chat-call-ended", removedData);
				});
			});
		});

		const teamCallsRef = fb.realtimeDB.ref("calls/team");

		// Set up the listeners
		teamCallsRef.on("child_added", function (snapshot)
		{
			const addedData = {
				id: snapshot.key, // Team ID
				...snapshot.val()
			};

			// Get team members
			fb.getTeamMembers(addedData.id).then((members) =>
			{
				// Send call-started event to online members
				Object.keys(members).forEach((member) =>
				{
					if (Object.keys(currLinks).includes(member))
						if (currLinks[member] != socket.id) // Don't send to the user who started the call
							io.to(currLinks[member]).emit("team-call-started", addedData);
				});
			});
		});

		teamCallsRef.on("child_removed", function (snapshot)
		{
			const removedData = {
				id: snapshot.key, // Team ID
				...snapshot.val()
			};

			// Get team members
			fb.getTeamMembers(removedData.id).then((members) =>
			{
				// Send call-ended event to online members
				Object.keys(members).forEach((member) =>
				{
					if (Object.keys(currLinks).includes(member))
						if (currLinks[member] != socket.id) // Don't send to the user who ended the call
							io.to(currLinks[member]).emit("team-call-ended", removedData);
				});
			});
		});

		socket.on('join-call', (room, id, target, targetID) => 
		{
			// Broadcast to all members in the room
			console.log(`### user ${id} joined call ${room} ###`);
			socket.join(room);
			socket.to(room).emit('user-joined-call', id);
			socket.on('leave-call', () =>
			{ // Corrected syntax
				socket.to(room).emit('user-left-call', id);
				socket.leave(room);
				// If room is undefined, remove from real-time database
				if (io.sockets.adapter.rooms.get(room) === undefined)
					fb.realtimeDB.ref('calls').child(target).child(targetID).remove();
			});

			socket.on('disconnect', () =>
			{
				// If room is undefined, remove from real-time database
				if (io.sockets.adapter.rooms.get(room) == undefined)
					fb.realtimeDB.ref("calls").child(target).child(targetID).remove();

				socket.to(room).emit('user-left-call', id);
			});
		});
	});
}

async function broadcastMessage(data, type = "team", newMessage = false, deleteMsg = false)
{

	// If the message is a delete message, check if the message has the required fields
	if (deleteMsg && type == "team" && !data.team && !data.channelId && !data.id) return;
	if (deleteMsg && type == "direct" && !data.chat && !data.id) return;

	// Get the members of the team or chat
	let members = type == "team" ? await fb.getTeamMembers(data.team) : await fb.getChatMembers(data.chat);
	let membersList = Array.isArray(members) ? members : [];

	if (membersList.length === 0) return console.log("No members found for this team or chat");

	// if their is a sentAt field, convert it to a firebase timestamp
	let DateBackup = data.sentAt;
	const date = new Date(data.sentAt);
	if (data.sentAt)
	{
		if (!isNaN(date.getTime()))
		{
			// If sentAt is in date format, creates a timestamp
			data.sentAt = fb.admin.firestore.Timestamp.fromDate(new Date(data.sentAt));;
		}
	} else
	{
		// If sentAt is not defined, creates a timestamp for the current time
		data.sentAt = fb.admin.firestore.Timestamp.fromDate(new Date());
	}

	// Remove the sender
	const index = membersList.indexOf(data.senderID);
	if (index > -1) // only splice array when item is found
		membersList.splice(index, 1); // 2nd parameter means remove one item only

	// Send to all online members
	membersList.forEach((member) =>
	{
		if (Object.keys(currLinks).includes(member))
		{
			if (newMessage === true) io.to(currLinks[member]).emit((type == "team") ? "teamMsg" : "directMsg", data);
			else if (newMessage === false && !deleteMsg) io.to(currLinks[member]).emit((type == "team") ? "updateTeamMessage" : "updateDirectMessage", data);
			else if (deleteMsg) io.to(currLinks[member]).emit((type == "team") ? "deleteTeamMessage" : "deleteDirectMessage", data);
		}

	});

	// Restore the sentAt field
	data.sentAt = DateBackup;
	if (!deleteMsg)
	{
		(type == "team") ? fb.saveTeamMsg(data, newMessage) : fb.saveDirectMsg(data, newMessage);
	}
	else
	{
		(type == "team") ? fb.deleteTeamMsg(data.team, data.channelId, data.id) : fb.deleteChatMsg(data.chat, data.id);
	}

}

function connectToRedis(io)
{

	let reconnectToRedis = () => connectToRedis(io);

	if (!io) return null;

	const pubClient = createClient({
		url: "rediss://default:AVNS_oCy6bX7J5KUh0ssBCOv@redis-m1-siddhtailor96-db76.a.aivencloud.com:18227"
	});
	const subClient = pubClient.duplicate();

	Promise.all([pubClient.connect(), subClient.connect()])
		.then(() =>
		{
			console.log("BAPS: Enabled");
			if (io) io.adapter(createAdapter(pubClient, subClient));

			if (BAPS_ERROR)
			{
				BAPS_ERROR = false;

				// turn off the interval
				clearInterval(BAPS_ERROR_ID);
				BAPS_ERROR_ID = null;
			}
		})
		.catch((error) =>
		{
			console.log("BAPS: Disabled");
			console.log("Error connecting to Redis: ", error);
			// Retry after 5 seconds
			if (!BAPS_ERROR)
			{
				BAPS_ERROR = true;
				BAPS_ERROR_ID = setInterval(reconnectToRedis, 5000);
			}
		});

	pubClient.on("error", (error) =>
	{
		if (!BAPS_ERROR)
		{
			console.log("BAPS: Disabled");
			BAPS_ERROR = true;
			BAPS_ERROR_ID = setInterval(reconnectToRedis, 5000);
		}

	});

	subClient.on("error", (error) =>
	{
		if (!BAPS_ERROR)
		{
			console.log("BAPS: Disabled");
			BAPS_ERROR = true;
			BAPS_ERROR_ID = setInterval(reconnectToRedis, 5000);
		}
	});
}

module.exports = {
	init,
	currLinks
};
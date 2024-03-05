const { Server } = require("socket.io");
const fb = require("./firebase");
const uuid = require("uuid");
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

/** @type Server */
let io;

// Current connections
let currLinks = {};
let rooms = {};

let connectionTimes = {};

function init(server) {

	io = new Server(server, { cors: { origin: "*" } });

	try {
		const pubClient = createClient({
			url: "rediss://red-cndgdnf109ks738rsaf0:EyChYWWMVnUrrqGRfWA2OOgIAJFBPslf@singapore-redis.render.com:6379"
		});
		const subClient = pubClient.duplicate();

		Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
			console.log("Connected to redis");
			io.adapter(createAdapter(pubClient, subClient));
		}).catch((error) => {
			console.log("Error connecting to redis: ", error);
		});
	} catch (error) {
		console.log("Error connecting to redis: ", error);
	}


	// Sync up with the database
	fb.getObjectFromRealtimeDB("currLinks").then((data) => {
		currLinks = data.val() || {};
	});
	fb.getObjectFromRealtimeDB("rooms").then((data) => {
		rooms = data.val() || {};
	});

	fb.getObjectFromRealtimeDB("connectionTimes").then((data) => {
		connectionTimes = data.val() || {};
	});

	// Listen for connections
	fb.listenToRealtimeDB("currLinks", (data) => {
		currLinks = data || {};
		console.log("Listen currLinks: ", currLinks);
	});

	fb.listenToRealtimeDB("rooms", (data) => {
		rooms = data || {};
	});

	fb.listenToRealtimeDB("connectionTimes", (data) => {
		connectionTimes = data || {};
	});



	io.on('connection', (socket) => {
		socket.on('user', (msg) => {
			console.log(`user ${msg.id} connected`);
			currLinks[msg.id] = socket.id;
			// FSR1 - Difference between user connecting and disconnecting
			connectionTimes[msg.id] = Date.now();

			// Save the user to the database
			fb.addObjectToRealtimeDB("currLinks", currLinks);
		});

		

		socket.on('disconnect', async () => {
    		let ref = Object.keys(currLinks).find((key) => currLinks[key] === socket.id);
    		if (ref) {
        		let disconnectTime = Date.now();
        		let connectTime = connectionTimes[ref];
        		if (connectTime) {
            		let timeSpent = disconnectTime - connectTime; // Time spent in milliseconds

            		// Update the timeSpent for the user in Firebase
            		//await fb.firestore().collection('users').doc(ref).update({
                	//	timeSpent: fb.admin.firestore.FieldValue.increment(timeSpent)
            		//});

            		// Cleanup
            	delete currLinks[ref];
				delete connectionTimes[ref]; // Ensure to remove the user from here as well
            	console.log(`user disconnected, time spent: ${timeSpent}ms`);

			// Remove the user from all rooms
			Object.keys(rooms).forEach((room) => {
				if (rooms[room].members[ref]) {
					delete rooms[room].members[ref];
					if (Object.keys(rooms[room].members).length == 0) delete rooms[room];

				}
				console.log(`user ${ref} left room ${room}`)
			});

			// Save the user to the database
			fb.addObjectToRealtimeDB("currLinks", currLinks);
			fb.addObjectToRealtimeDB("rooms", rooms);
			fb.addObjectToRealtimeDB("connectionTimes", connectionTimes);

            		
        		}
    		}
		});

		socket.on('teamMsg', (data) => broadcastMessage(data));

		socket.on('directMsg', (data) => {
			broadcastMessage(data, "direct");
		});

		//Join a collab room
		socket.on('startCollab', (data) => {

			// Limit room capacity to 10
			if (Object.keys(rooms).length > 10) return socket.emit('roomFull', { msg: "Sever is overloaded, try again later" });

			// Create a room
			if (!rooms[data.id]) rooms[data.id] = { id: data.id, members: { [data.user.id]: data.user } };
			else rooms[data.id].members[data.user.id] = data.user;


			socket.join(data.id);
			console.log(`user ${data.user.id} joined room ${data.id}`)

			// Sync up with the database
			fb.addObjectToRealtimeDB("rooms", rooms);

		});

		//Leave a collab room
		socket.on('stopCollab', (data) => {
			Object.keys(rooms).forEach((room) => {
				if (rooms[room].members[data.user.id]) {
					delete rooms[room].members[data.user.id];
					if (Object.keys(rooms[room].members).length == 0) delete rooms[room];

				}
				console.log(`user ${data.user.id} left room ${room}`)
			});

			fb.addObjectToRealtimeDB("rooms", rooms);
		});

		//send collab data to all members
		socket.on('collabData', ({ id, user, data }) => {
			if (!rooms[id]?.members[user]) return socket.emit('reconnectRoom', { msg: "You are not a member of this room" });

			data.activeMembers = Object.keys(rooms[id].members).filter((member) => member != user);

			io.to(id).emit('updateCollabData', data);
		});


	});
}

async function broadcastMessage(data, type = "team") {
	let members = type == "team" ? await fb.getTeamMembers(data.team) : await fb.getChatMembers(data.chat);
	let membersList = members;

	// if their is a sentAt field, convert it to a firebase timestamp
	let DateBackup = data.sentAt;
	if (data.sentAt) {
		data.sentAt = fb.admin.firestore.Timestamp.fromDate(new Date(data.sentAt));
	}

	// Remove the sender
	const index = membersList.indexOf(data.senderID);
	if (index > -1) // only splice array when item is found
		membersList.splice(index, 1); // 2nd parameter means remove one item only

	// Send to all online members
	membersList.forEach((member) => {
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
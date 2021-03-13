const scripts = require("./scripts.js");

const express = require("express");
const app = express();
const server = require("http").createServer(app);
var io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

const port = 4321;

const users = new Map();

io.on("connection", (client) => {
	if (users.size < 5) {
		users.set(client.id, client);
		console.log("client", client.id, "connected");
		client.emit("message", { message: "ciao", sender: "io me stesso" });
		client.join(client.id);
		if (users.size == 5){
			scripts.game(users, io);
		}
	}
	client.on("ping", () => {
		console.log("ping from client");
		//client.emit("pong", {});
	});
	
	client.on("disconnect", () => {
		console.log("client ", client.id, "disconnected");
		users.delete(client.id); // dimensione => users.size
	});

	client.on("chiamata", (chiamata) => {
		console.log(chiamata + "server");
		//if (scripts.autorizza(client.id)){
			scripts.chiamata(chiamata);
		//}
	})
});


/*
setInterval(() => {
    io.emit("pong", {})
}, 1000);
*/

server.listen(port, () => {
	console.log("Listening on port", port);
});

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

const port = 4321;

const users = new Map();

io.on("connection", (client) => {
	users.set(client.id, client);

	console.log("client", client.id, "connected");
	client.emit("message", { message: "ciao", sender: "io me stesso" });
	client.on("ping", () => {
		console.log("ping from client");
		client.emit("pong", {});
	});

	client.on("disconnect", () => {
		console.log("client ", client.id, "disconnected");
		users.delete(client.id); // dimensione => users.size
	});
});

server.listen(port, () => {
	console.log("Listening on port", port);
});

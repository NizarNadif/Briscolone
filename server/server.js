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
		if (users.size == 5) {
			io.emit(
				"giocatori",
				Array.from(users.values()).map((socket) => socket.id)
			);
			scripts.game(users, io);
		}
	}

	client.on("disconnect", () => {
		console.log("client ", client.id, "disconnected");
		users.delete(client.id); // dimensione => users.size
	});

	client.on("chiamata", (chiamata) => {
		if (scripts.autorizza(client.id)) {
			scripts.chiamata(chiamata);
		}
	});

	client.on("carta giocata", (carta) => {
		if (scripts.checkTurno(client.id)) {
			let temp = { ...carta };
			carta["giocatore"] = client;
			scripts.cartaGiocata(temp, carta);
		}
	});
});

server.listen(port, () => {
	console.log("Listening on port", port);
});

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

const port = process.env.PORT || 3000;

const users = new Map();

io.on("connection", (client) => {
	console.log("client", client.id, "connected");

	client.on("join", (data) => {
		console.log("client", client.id, "joined the game");
		if (users.size < 5) {
			users.set(client.id, {
				socket: client,
				id: client.id,
				name: data.name,
				picture: data.picture,
			});
			client.join(client.id);
			if (users.size == 5) {
				io.emit(
					"giocatori",
					Array.from(users.values()).map((data) => {
						let copy = { ...data };
						delete copy.socket;
						return copy;
					})
				);
				users.forEach((data, index) => {
					data = users.get(index).socket;
					users.set(index, data);
				});
				scripts.game(users, io);
			}
		}
	});

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
		if (scripts.checkTurno(client.id, carta)) {
			let temp = { ...carta };
			carta["giocatore"] = client;
			scripts.cartaGiocata(temp, carta);
		}
	});
});

server.listen(port);

server.on("listening", () => {
	console.log("Listening on port", port);
});

const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socketclient) => {
	console.log("client connesso");
	socketclient.emit("message", { message: "ciao", sender: "io me stesso" });
	clients.push(socketclient);
	socketclient.on("ping", () => {
		console.log("ping from client");
		socketclient.emit("pong", {});
	});
});

setInterval(() => {
	io.emit("pong", {});
}, 1000);

server.listen(3000);

const express = require("express");
const app = express();
var clientDir = __dirname;
for (let i = 0; i < 1; i++)
    clientDir = clientDir.substring(0, clientDir.lastIndexOf("\\"));
clientDir += "\\client";

app.use(express.static(clientDir));
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socketclient) => {
	console.log("client connesso");
	socketclient.emit("message", { message: "ciao", sender: "io me stesso" });
	socketclient.join('roomProva');
	socketclient.on("ping", () => {
		console.log("ping from client");
		socketclient.emit("pong", {});
	});
});



 setInterval(() => {
	io.to('roomProva').emit("pong", {});
}, 1000);

server.listen(3000);

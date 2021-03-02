console.log("funge");

const clientsocket = io();

clientsocket.on("connect", (socket) => {
	console.log("connesso");
	btnPing.onclick = () => {
		clientsocket.emit("ping", {});
	};
});

clientsocket.on("message", (params) => {
	console.log("messaggio dal server", JSON.stringify(params, null, 2));
});

clientsocket.on("pong", () => {
	console.log("pong ricevuto");
});

const btnPing = document.getElementById("btnPing");

import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:4321");

socket.on("connect", () => {
	console.log("connessione...");
});

export function ping() {
	socket.emit("ping", {});
}

export function pong(callback) {
	socket.on("pong", () => callback("pong"));
}

/* export function ping(cb) {
	socket.on("timer", (timestamp) => cb(null, timestamp));
	socket.emit("subscribeToTimer", 1000);
} */

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

export function carteIniziali(callback) {
	socket.on("carteIniziali", (carte) => callback(carte));
}

export function chiama(callback) {
	socket.on("chiama", (attuale, fn) => callback(attuale, fn));
}

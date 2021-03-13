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

export function chiamata(chiamata) {
	console.log("Arrivato " + chiamata);
	console.log("chiamata");
	socket.emit("chiamata", chiamata);
}

export function selezioneChiamata(callback) {
	socket.on("selezione chiamata", (params) => {
		console.log(params);
		if (socket.id == params.chiamante) callback(params.attuale, 1);
		else callback(params.attuale, 0);
	});
}

export function invia(chiamata) {
	console.log("hai chiamato", chiamata);
	socket.emit("chiamata", chiamata);
}

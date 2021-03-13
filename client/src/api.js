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
	socket.on("chiama", (attuale) => callback(attuale));
	//socket.on("chiama", (attuale, fn) => callback(attuale, fn));
}

export function chiamata(chiamata){
	console.log("Arrivato " + chiamata);
	console.log("chiamata");
	socket.emit("chiamata", chiamata);
}

export function selezioneChiamata(callback){
	socket.on("selezioneChiamata", (attuale) => callback(attuale));
}

export function invia(chiamata){
	console.log(chiamata);
	socket.emit("chiamata", chiamata);
}
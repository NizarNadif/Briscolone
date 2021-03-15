import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:4321");

socket.on("connect", () => {
	console.log("connessione...");
});

export function carteIniziali(callback) {
	socket.on("carteIniziali", (carte) => callback(carte));
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

export function giocaCarta(carta) {
	socket.emit("carta giocata", carta);
}

export function prossimoTurno(callback) {
	socket.on("prossimo a giocare", (params) => {
		let yourCard = params.precedente == socket.id;
		callback(yourCard, params.prossimo, params.carta);
	});
}

export function scegliBriscola(callback) {
	socket.on("scegli la briscola", () => callback());
}

export function briscolaScelta(briscola) {
	socket.emit("briscola scelta", briscola);
}

import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:4321");

export default {
	carteIniziali,
	selezioneChiamata,
	invia,
	giocaCarta,
	prossimoTurno,
	scegliBriscola,
	briscolaScelta,
};

socket.on("connect", () => {
	console.log("connessione...");
});

export function carteIniziali(callback) {
	socket.on("carteIniziali", (carte) => callback(carte));
}

export function selezioneChiamata(callback) {
	socket.on("selezione chiamata", (params) => {
		callback(params.attuale, socket.id == params.chiamante);
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
		callback(params.precedente == socket.id, params.prossimo, params.carta);
	});
}

export function scegliBriscola(callback) {
	socket.on("scegli la briscola", () => callback());
}

export function briscolaScelta(briscola) {
	socket.emit("briscola scelta", briscola);
}

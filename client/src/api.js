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

function carteIniziali(callback) {
	socket.on("carteIniziali", (carte) => callback(carte));
}

function selezioneChiamata(callback) {
	socket.on("selezione chiamata", (params) => {
		callback(params.attuale, socket.id == params.chiamante);
	});
}

function invia(chiamata) {
	console.log("hai chiamato", chiamata.valore, " soglia: ", chiamata.soglia);
	socket.emit("chiamata", chiamata);
}

function giocaCarta(carta) {
	socket.emit("carta giocata", carta);
}

function prossimoTurno(callback) {
	socket.on("prossimo a giocare", (params) => {
		callback(params.precedente == socket.id, params.prossimo, params.carta);
	});
}

function scegliBriscola(callback) {
	socket.on("scegli la briscola", () => callback());
}

function briscolaScelta(briscola) {
	socket.emit("briscola scelta", briscola);
}

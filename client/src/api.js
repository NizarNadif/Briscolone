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
	turnoPrecedente,
	giocatoriIniziali,
};

socket.on("connect", () => {
	console.log("connessione...");
});

function carteIniziali(callback) {
	socket.on("carteIniziali", (carte) => callback(carte));
}

function giocatoriIniziali(callback) {
	socket.on("giocatori", (players) => {
		let i = (players.indexOf(socket.id) + 1) % 5;
		let giocatori = new Array();
		for (let j = 0; j < 4; j++, i = (i + 1) % 5) {
			giocatori.push({ id: players[i], carte: 8 });
		}
		callback(giocatori);
	});
}

function selezioneChiamata(callback) {
	socket.on("selezione chiamata", (params) => {
		console.log(
			"il tuo id:",
			socket.id,
			"id chiamante:",
			params.chiamante,
			"uguali:",
			socket.id == params.chiamante
		);
		callback(params.attuale, socket.id === params.chiamante);
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
	socket.on("prossimo a giocare", (prossimo) => {
		console.log(prossimo);
	});
}

function turnoPrecedente(callback) {
	socket.on("ultima giocata", (params) => {
		console.log("ultima giocata: bla bla bla");
		callback(params.precedente == socket.id, params.carta, params.precedente);
	});
}

function scegliBriscola(callback) {
	socket.on("scegli la briscola", () => callback());
}

function briscolaScelta(briscola) {
	socket.emit("briscola scelta", briscola);
}

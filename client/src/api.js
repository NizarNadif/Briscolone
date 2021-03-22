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
	vincitoreTurno,
	cartaSocio,
	eventoLog,
	vincitore,
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
		callback(params.attuale, params.chiamante, socket.id === params.chiamante);
	});
}

function invia(chiamata) {
	console.log("hai chiamato", chiamata.valore, " soglia: ", chiamata.soglia);
	socket.emit("chiamata", chiamata);
}

function giocaCarta(carta) {
	socket.emit("carta giocata", carta);
}

function cartaSocio(callback) {
	socket.on("carta socio", (cartaSocio) => {
		callback(cartaSocio);
	});
}

function eventoLog(callback) {
	socket.on("evento log", (evento) => {
		callback(evento, evento.user === socket.id);
	});
}

function prossimoTurno(callback) {
	socket.on("prossimo a giocare", (prossimo) => {
		console.log(prossimo);
		callback(prossimo);
	});
}

function vincitoreTurno(callback) {
	socket.on("vincitore turno", (vincitore) => {
		callback(vincitore, vincitore === socket.id);
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

function vincitore(callback) {
	socket.on("vincitore", (params) => {
		callback(params.chiamante === socket.id || params.socio === socket.id, params.puntiChiamanti);
	})
}

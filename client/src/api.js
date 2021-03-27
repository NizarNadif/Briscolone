import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:3000");

export default {
	loggedIn,
	carteIniziali,
	selezioneChiamata,
	invia,
	vincitoreChiamate,
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

function loggedIn(data) {
	socket.emit("join", {
		name: data.name,
		picture: data.picture,
	});
}

function carteIniziali(callback) {
	socket.on("carteIniziali", (carte) => callback(carte));
}

function giocatoriIniziali(callback) {
	socket.on("giocatori", (players) => {
		let i = 0;
		players.forEach((player, index) => {
			if (player.id == socket.id) i = (index + 1) % 5;
		});
		let giocatori = new Array();
		for (let j = 0; j < 4; j++, i = (i + 1) % 5) {
			giocatori.push({ ...players[i], carte: 8 });
		}
		callback(giocatori);
	});
}

function selezioneChiamata(callback) {
	socket.on("selezione chiamata", (params) => {
		callback(params.attuale, params.chiamante, socket.id === params.chiamante);
	});
}

function invia(chiamata) {
	socket.emit("chiamata", chiamata);
}

function vincitoreChiamate(callback) {
	socket.on("vincitore chiamate", (id) => callback(id));
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
		callback(
			params.chiamante === socket.id || params.socio === socket.id,
			params.puntiChiamanti
		);
	});
}

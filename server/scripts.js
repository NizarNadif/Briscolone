module.exports = {
	game,
	autorizza,
	chiamata,
	checkTurno,
	cartaGiocata,
};

let users;
let io;
let deck = new Array();
let mani = new Array();
let giocatoreIniziale = 0;
let vincitoreChiamata;
let bloccoCarte;
function game(utenti, connessione) {
	bloccoCarte = true;
	users = utenti;
	io = connessione;

	cardsDistribution();

	call();
}

function sviluppoPartita(vincitore) {
	bloccoCarte = false;
	users = Array.from(users.values());
	vincitoreChiamata = vincitore;
	io.emit("vincitore chiamate", vincitoreChiamata.id);
	io.emit("prossimo a giocare", users[giocatoreIniziale].id);
	i = giocatoreIniziale;
	users.forEach((player) => {
		player["punti"] = 0;
	});
}

function cardsDistribution() {
	deckGenerator();

	deck = deck.sort(() => Math.random() - 0.5);
	let indice = 0;
	users.forEach((player) => {
		const mano = deck.slice(indice, indice + 8);
		indice = indice + 8;
		player.emit("carteIniziali", mano);
		mani.push(mano);
	});
}

function deckGenerator() {
	let semi = ["Coppe", "Spade", "Bastoni", "Denari"];
	let valori = [
		"Asse",
		"Due",
		"Tre",
		"Quattro",
		"Cinque",
		"Sei",
		"Sette",
		"Fante",
		"Cavallo",
		"Re",
	];
	let punti = [11, 0, 10, 0, 0, 0, 0, 2, 3, 4];
	for (let i = 0; i < 4; i++)
		for (let j = 0; j < 10; j++)
			deck.push({
				seme: semi[i],
				valore: valori[j],
				url: semi[i] + valori[j],
				punti: punti[j],
			});
}

let chiamanti;
let i;
let ultimaChiamata = {
	valore: -1,
	soglia: 61,
};
let cartaChiamata = {
	valore: "",
	seme: "",
};

function call() {
	chiamanti = Array.from(users.values());

	i = giocatoreIniziale;

	users.forEach((player) => {
		player.emit("selezione chiamata", {
			attuale: ultimaChiamata,
			chiamante: chiamanti[i].id,
		});
	});
	io.emit("prossimo a giocare", chiamanti[i].id);
}

function autorizza(id) {
	return id == chiamanti[i].id;
}

function chiamata(chiamata) {
	let ordine = [
		"Asse",
		"Tre",
		"Re",
		"Cavallo",
		"Fante",
		"Sette",
		"Sei",
		"Cinque",
		"Quattro",
		"Due",
	];
	if (chiamata.valore == null) {
		io.emit("evento log", {
			user: chiamanti[i].id,
			stringa: " abbandonato la chiamata",
		});
		chiamanti.splice(i, 1);
		if (i == chiamanti.length) i = 0;
	} else {
		io.emit("evento log", {
			user: chiamanti[i].id,
			stringa:
				" chiamato " +
				ordine[chiamata.valore].toLowerCase() +
				" a " +
				chiamata.soglia,
		});
		if (chiamata.soglia == 120) {
			ultimaChiamata = chiamata;
		} else if (
			chiamata.valore >= ultimaChiamata.valore &&
			chiamata.soglia >= ultimaChiamata.soglia
		) {
			ultimaChiamata = chiamata;
			i = (i + 1) % chiamanti.length;
		}
	}

	if (chiamanti.length > 1 && ultimaChiamata.soglia < 120) {
		io.emit("selezione chiamata", {
			attuale: ultimaChiamata,
			chiamante: chiamanti[i].id,
		});
		io.emit("prossimo a giocare", chiamanti[i].id);
	} else {
		io.emit("selezione chiamata", {
			attuale: ultimaChiamata,
			chiamante: "RandomID",
		});

		io.emit("inizio partita", {});
		io.emit("evento log", {
			user: chiamanti[i].id,
			stringa: " vinto la chiamata",
		});
		cartaChiamata.valore = indicizza(ultimaChiamata.valore);
		sviluppoPartita(chiamanti[i]);
	}
}

function indicizza(carta) {
	let ordine = [
		"Asse",
		"Tre",
		"Re",
		"Cavallo",
		"Fante",
		"Sette",
		"Sei",
		"Cinque",
		"Quattro",
		"Due",
	];
	return ordine[carta];
}

function checkTurno(id, carta) {
	if (!bloccoCarte) return id == users[i].id;
}

let turno = Array();
let turniEffettuati = 0;
let briscola = "";
let punti = 0;

function cartaGiocata(carta, cartaSocket) {
	turno.push(cartaSocket);
	if (turno.length == 5) {
		io.emit("ultima giocata", {
			precedente: users[i].id,
			carta: carta,
		});
		turniEffettuati++;
		if (turniEffettuati == 1) {
			bloccoCarte = true;
			io.emit("prossimo a giocare", vincitoreChiamata.id);
			scegliBriscola();
		} else {
			trovaVincente();
		}

		if (turniEffettuati == 8) finePartita();
	} else {
		io.emit("ultima giocata", {
			precedente: users[i].id,
			carta: carta,
		});
		i = (i + 1) % 5;
		io.emit("prossimo a giocare", users[i].id);
	}
}

function trovaVincente() {
	let vincente = cartaVincente();
	vincente.giocatore["punti"] += punti;
	users.forEach((player) => {
		console.log(player["punti"]);
	});
	turno = new Array();
	punti = 0;
	i = users.indexOf(vincente.giocatore);
	io.emit("vincitore turno", users[i].id);
	io.emit("evento log", {
		user: users[i].id,
		stringa: " vinto la mano",
	});
	io.emit("prossimo a giocare", users[i].id);
}

function cartaVincente() {
	let vincente = turno[0];
	let ordine = [
		"Asse",
		"Tre",
		"Re",
		"Cavallo",
		"Fante",
		"Sette",
		"Sei",
		"Cinque",
		"Quattro",
		"Due",
	];
	turno.forEach((carta) => {
		punti += carta.punti;
		if (carta.seme == briscola) {
			if (vincente.seme == briscola) {
				if (ordine.indexOf(vincente.valore) > ordine.indexOf(carta.valore)) {
					vincente = carta;
				}
			} else {
				vincente = carta;
			}
		} else if (vincente.seme != briscola) {
			if (vincente.seme == carta.seme) {
				if (ordine.indexOf(vincente.valore) > ordine.indexOf(carta.valore)) {
					vincente = carta;
				}
			}
		}
	});
	return vincente;
}

function scegliBriscola() {
	vincitoreChiamata.emit("scegli la briscola", {});
	vincitoreChiamata.on("briscola scelta", (briscolaScelta) => {
		briscola = briscolaScelta;
		cartaChiamata.seme = briscolaScelta;
		bloccoCarte = false;
		io.emit("carta socio", cartaChiamata);
		console.log(briscola);
		trovaVincente();
	});
}

function finePartita() {
	let socio;
	mani.forEach((mano, index) => {
		mano.forEach((carta) => {
			if (
				carta.valore === cartaChiamata.valore &&
				carta.seme === cartaChiamata.seme
			) {
				socio = index;
			}
		});
	});
	let puntiChiamanti = users[socio].punti;
	if (users[socio] != vincitoreChiamata)
		puntiChiamanti += vincitoreChiamata.punti;
	io.emit("vincitore", {
		puntiChiamanti: puntiChiamanti,
		chiamante: vincitoreChiamata.id,
		socio: users[socio].id,
	});
	nuovoGiro();
}

function nuovoGiro() {
	azzera();
	game(users, io);
}

function azzera() {
	turno = new Array();
	turniEffettuati = 0;
	briscola = "";
	punti = 0;
	sogliaVittoria = 61;
	cartaChiamata = {
		valore: "",
		seme: "",
	};
	ultimaChiamata = {
		valore: -1,
		soglia: 61,
	};
	deck = new Array();
	mani = new Array();
	giocatoreIniziale = (giocatoreIniziale + 1) % 5;
}

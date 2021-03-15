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

function game(utenti, connessione) {
	//io.emit("pong", {});
	users = utenti;
	io = connessione;

	cardsDistribution();

	call();
}

function sviluppoPartita(vincitore) {
	users = Array.from(users.values());
	vincitoreChiamata = vincitore;
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
		indice = indice+8;
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
let attuale;
let cartaChiamata = {
	valore: '',
	seme: '',
}

function call() {
	chiamanti = Array.from(users.values());
	console.log("Call");
	attuale = -1;

	i = giocatoreIniziale;

	users.forEach((player) => {
		player.emit("selezione chiamata", {
			attuale: attuale,
			chiamante: chiamanti[i].id,
		});
	});
}

function autorizza(id) {
	return id == chiamanti[i].id;
}

function chiamata(valore) {
	if (valore == null) {
		chiamanti.splice(i, 1);
		if (i == chiamanti.length) i = 0;
	} else {
		attuale = valore;
		i = (i + 1) % chiamanti.length;
	}
	chiamanti.forEach((player) => {
		console.log(player.id);
	});

	if (chiamanti.length > 1) {
		users.forEach((player) => {
			player.emit("selezione chiamata", {
				attuale: attuale,
				chiamante: chiamanti[i].id,
			});
		});
	} else {
		console.log("ce l'abbiamo fatta!");
		users.forEach((player) => {
			player.emit("selezione chiamata", {
				attuale: attuale,
				chiamante: "ahaha non vali niente",
			});
			player.emit("inizio partita", {});
		});
		cartaChiamata['valore'] = indicizza(attuale);
		sviluppoPartita(chiamanti[0]);
	}
}

function indicizza(carta){
	let ordine = [
		"Asso",
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

function checkTurno(id) {
	return id == users[i].id;
}

let turno = Array();
let turniEffettuati = 1;
let briscola = "";
let punti = 0;
let sogliaVittoria = 61;

function cartaGiocata(carta, cartaSocket) {
	turno.push(cartaSocket);
	if (turno.length == 5) {
		let vincente = cartaVincente();
		console.log("carta vincente:", vincente.url);
		if (turniEffettuati == 1) {
			scegliBriscola();
		}
		vincente.giocatore["punti"] += punti;
		turno = new Array();
		punti = 0;
		let j = i;
		i = users.indexOf(vincente.giocatore);
		io.emit("prossimo a giocare", {
			prossimo: users[i].id,
			precedente: users[j].id,
			carta: carta,
		});
		turniEffettuati++;
		if (turniEffettuati == 8)
			finePartita();
	} else {
		let j = i;
		i = (i + 1) % 5;
		io.emit("prossimo a giocare", {
			prossimo: users[i].id,
			precedente: users[j].id,
			carta: carta,
		});
	}
}

function cartaVincente() {
	let vincente = turno[0];
	let ordine = [
		"Asso",
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
		cartaChiamata['seme'] = briscolaScelta;
		console.log(briscola);
	});
}

function finePartita(){
	let socio;
	mani.forEach((mano, index) => {
		mano.forEach((carta) => {
			if (carta.valore == cartaChiamata.valore && carta.seme == cartaChiamata.seme){
				socio = index;
			}
		})
	})
	let puntiChiamanti = users[socio].punti;
	if (users[socio] != vincitoreChiamata)
		puntiChiamanti	+= vincitoreChiamata.punti;
	let bool = 0;
	if (puntiChiamanti >= sogliaVittoria) 
		bool = 1;
	io.emit("vincitore", { puntiChiamanti: puntiChiamanti, vittoriaChiamanti: bool});
}

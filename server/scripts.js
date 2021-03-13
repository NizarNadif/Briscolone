module.exports = {
	game,
	autorizza,
	chiamata,
};

let users;
let io;
let deck = new Array();
let giocatoreIniziale = 0;

function game(utenti, connessione) {
	//io.emit("pong", {});
	users = utenti;
	io = connessione;

	cardsDistribution();

	call();
}

function cardsDistribution() {
	deckGenerator();

	deck = deck.sort(() => Math.random() - 0.5);
	let indice = 0;
	users.forEach((player) => {
		player.emit("carteIniziali", deck.slice(indice, (indice += 8)));
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
				url: semi[i] + valori[j] + ".png",
				punti: punti[j],
			});
}

let chiamanti;
let i;
let attuale;

function call() {
	chiamanti = Array.from(users.values());
	let id = Array.from(users.keys());
	console.log("Call");
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
	attuale = 0;

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
	console.log(valore, attuale);
	if (valore == null) chiamanti.splice(i, 1);
	else {
		attuale = valore;
	}
	i = (i + 1) % chiamanti.length;
	if (chiamanti.length > 1) {
		users.forEach((player) => {
			player.emit("selezione chiamata", {
				attuale: attuale,
				chiamante: chiamanti[i].id,
			});
		});
	} else {
		console.log("ce l'abbiamo fatta!");
	}
}

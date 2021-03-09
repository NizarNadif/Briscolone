module.exports = {
	game,
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

function call() {
	let chiamanti = Array.from(users.values());
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
	let attuale = 0;

	let i = giocatoreIniziale - 1;

	const chiama = (chiamata) => {
		if (chiamanti.length > 1) {
			if (chiamata == null) {
				chiamanti.splice(i, 1);
			} else {
				attuale = chiamata;
				console.log("chiamata attuale pari a", attuale, "di", i);
			}

			i = (i + 1) % chiamanti.length;
			chiamanti[i].emit("chiama", attuale, chiama);
		} else return;
	}

	chiama(attuale);
	//console.log("Carta chiamata:", ordine[attuale], "di X");
}

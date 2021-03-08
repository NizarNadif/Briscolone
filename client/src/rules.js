export function valoreChiamata(attuale, carte) {
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
	let chiamata = -1;
	while (chiamata <= attuale || chiamata > 10) {
		chiamata = window.prompt("Inserisci il valore della tua chiamata");
		console.log(chiamata);
	}
	if (chiamata == "null") {
		return null;
	}
	return chiamata;
}

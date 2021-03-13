import { invia } from "./api";

export function verificaChiamata(attuale, chiamata) {
	if (chiamata <= attuale) return;
	else {
		if (chiamata == "null") chiamata = null;
		invia(chiamata);
	}
}

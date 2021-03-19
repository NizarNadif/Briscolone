import React from "react";
import api from "./api";
import Dorso from "../public/assets/Dorso.png";
import carte from "./carte";

export function Player(params) {
	let stile = {};

	switch (params.id) {
		case "giocatore-0":
			stile = {};
			break;
		case "giocatore-1":
			stile = {};
			break;
		case "giocatore-2":
			stile = {};
			break;
		case "giocatore-3":
			stile = {};
			break;
		default:
			break;
	}

	let carteJSX = new Array();
	for (let i = 0; i < params.giocatore.carte; i++)
		carteJSX.push(
			<img className="carta-coperta" alt={"carta coperta"} src={Dorso} />
		);

	return (
		<div class="player" style={stile}>
			{/* {params.giocatore.id} */}
			{carteJSX}
		</div>
	);
}

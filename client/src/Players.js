import React, { useReducer, useContext, useEffect } from "react";
import api from "./api";
import Dorso from "../public/assets/Dorso.png";
import carte from "./carte";

export function Player(params) {
	let nCarte = 0;
	const { state, dispatch } = useContext(params.contesto);
	if (state.giocatori[params.giocatore] == undefined)
		nCarte = 8;
	else 
		nCarte = state.giocatori[params.giocatore].carte;
	let stile = {};
	console.log("React prendi il tumore ", nCarte);
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
	for (let i = 0; i < nCarte; i++)
		carteJSX.push(
			<img className="carta-coperta" alt={"carta coperta"} src={Dorso} />
		);

	return (
		<div class="player" style={stile}>
			{nCarte}
			{carteJSX}
		</div>
	);
}

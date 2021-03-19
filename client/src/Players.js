import React, { useReducer, useContext, useEffect } from "react";
import api from "./api";
import Dorso from "../public/assets/Dorso.png";
import carte from "./carte";

export function Player(params) {
	let nCarte = 0;
	const { state, dispatch } = useContext(params.contesto);
	if (state.giocatori[params.giocatore] == undefined) nCarte = 8;
	else nCarte = state.giocatori[params.giocatore].carte;
	let stile = {};
	console.log("React prendi il tumore ", nCarte);
	switch (params.id) {
		case "giocatore-0":
			stile = {
				bottom: "30%",
				right: "0%",
				transform: "rotate(90deg) translate(-30%, -150%)",
				color: "red",
			};
			break;
		case "giocatore-1":
			stile = {
				transform: "rotate(180deg)",
				top: "0%",
				right: "10%",
				color: "yellow",
			};
			break;
		case "giocatore-2":
			stile = {
				transform: "rotate(180deg)",
				top: "0%",
				left: "10%",
				color: "green",
			};
			break;
		case "giocatore-3":
			stile = {
				bottom: "30%",
				left: "0%",
				transform: "rotate(90deg) translate(-30%, 150%)",
				color: "blue",
			};
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
			{carteJSX}
		</div>
	);
}

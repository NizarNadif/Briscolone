import React, { useReducer, useContext, useEffect } from "react";
import api from "./api";
import Dorso from "../public/assets/Dorso.png";
import carte from "./carte";

export function Player(params) {
	const { state, dispatch } = useContext(params.contesto);
	let nCarte = state.giocatori[params.id].carte;

	let stile = {};

	switch (params.id) {
		case 0:
			stile = {
				bottom: "30%",
				right: "0%",
				transform: `rotate(270deg) translate(30%, ${(90 * nCarte) / 8}%)`,
				/* translateY deve rimanere costante
				90% : n carte massimo = x : n carte rimaste
				se non lo si fa, la mano si sposta sempre più verso l'esterno
				*/
			};
			break;
		case 1:
			stile = {
				transform: "rotate(180deg)",
				top: "0%",
				right: "10%",
			};
			break;
		case 2:
			stile = {
				transform: "rotate(180deg)",
				top: "0%",
				left: "10%",
			};
			break;
		case 3:
			stile = {
				bottom: "30%",
				left: "0%",
				transform: `rotate(90deg) translate(-30%, ${(90 * nCarte) / 8}%)`,
			};
			break;
		default:
			break;
	}

	let carteJSX = new Array();
	for (let i = 0; i < nCarte; i++)
		carteJSX.push(
			<img
				className="carta-coperta"
				alt={"carta coperta"}
				src={Dorso}
				key={`player-${params.id}-card-${i}`}
			/>
		);

	return (
		<div className="player" id={`player-${params.id}`} style={stile}>
			{carteJSX}
			<br></br>
			{state.giocatori[params.id].id}
		</div>
	);
}

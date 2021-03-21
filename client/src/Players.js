import React, { useReducer, useContext, useEffect } from "react";
import api from "./api";
import Dorso from "../public/assets/Dorso.png";
import assets from "./carte";

export function Player(params) {
	const { state, dispatch } = useContext(params.contesto);
	let nCarte = state.giocatori[params.id].carte;

	let stile = {};

	switch (params.id) {
		case 0:
			stile = {
				bottom: "30%",
				right: "0%",
				transform: `rotate(270deg) translate(30%, ${(90 * nCarte) / 8}%)`
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
				transform: `rotate(90deg) translate(-30%, ${(90 * nCarte) / 8}%)`
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
			<div className="mano-player">
				{carteJSX}
			</div>
			<br></br>
			{state.giocatori[params.id].id}
		</div>
	);
}

export function CartaGiocata(params) {
	const { state, dispatch } = useContext(params.contesto);

	let stile = {};

	let cartaUltima = (params.id == 0 ? state.ultimaCartaNostra : state.giocatori[params.id - 1].ultimaCarta);

	switch (params.id) {
		case 0:
			stile = {
				bottom: "25%",
				right: "50%",
				transform: `rotate(${(cartaUltima == null ? 0 : cartaUltima.angolo)}deg)`,
			};
			break;
		case 1:
			stile = {
				bottom: "40%",
				right: "20%",
				transform: `rotate(${270 + (cartaUltima == null ? 0 : cartaUltima.angolo)}deg)`
			};
			break;
		case 2:
			stile = {
				transform: `rotate(${180 +( cartaUltima == null ? 0 : cartaUltima.angolo)}deg)`,
				top: "25%",
				right: "30%",
			};
			break;
		case 3:
			stile = {
				transform: `rotate(${180 + (cartaUltima == null ? 0 : cartaUltima.angolo)}deg)`,
				top: "25%",
				left: "30%",
			};
			break;
		case 4:
			stile = {
				bottom: "40%",
				left: "20%",
				transform: `rotate(${90 + (cartaUltima == null ? 0 : cartaUltima.angolo)}deg)`
			};
			break;
		default:
			break;
	}

	return (
		<>
			{cartaUltima == null
				? ""
				:
				<img
					style={stile}
					className="carta-giocata"
					alt={"carta"}
					src={assets[cartaUltima.url]}
				/>
			}
		</>
	);
}

import React, { useReducer, useContext, useEffect } from "react";
import { Motion, spring } from "react-motion";
// import assets from "./carte";

export function Player(params) {
	const { state, dispatch } = useContext(params.contesto);
	let nCarte = state.giocatori[params.id].carte;

	let stile = {};
	let stileTesto = {};
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
				right: "15%",
			};
			stileTesto = {
				...stileTesto,
				transform: "rotate(180deg)",
			};
			break;
		case 2:
			stile = {
				transform: "rotate(180deg)",
				top: "0%",
				left: "15%",
			};
			stileTesto = {
				...stileTesto,
				transform: "rotate(180deg)",
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
				src={
					"https://raw.githubusercontent.com/NizarNadif/Briscolone/main/client/public/assets/Dorso.png"
				}
				key={`player-${params.id}-card-${i}`}
			/>
		);

	return (
		<div className="player" id={`player-${params.id}`} style={stile}>
			<div className="mano-player">{carteJSX}</div>
			<br></br>
			<p style={stileTesto}>{state.giocatori[params.id].id}</p>
		</div>
	);
}

export function CartaGiocata(params) {
	const { state, dispatch } = useContext(params.contesto);

	let stile = {};

	let cartaUltima =
		params.id == 0
			? state.ultimaCartaNostra
			: state.giocatori[params.id - 1].ultimaCarta;

	let rotazioneCarta = cartaUltima == null ? 0 : cartaUltima.angolo;
	let animation = {
		start: 0,
		end: 0,
		direction: "bottom",
	};

	/* configurazioni delle animazioni:
		- il valore di "stiffness" è direttamente proporzionale alla velocità dell'animazione
		- il valore di "dumping" è direttamente proporzionale alla "reattività" dell'animazione (indice di variazione dell'animazione nel tempo),
			se è pari a 0 la nostra funzione spring non farà mai variare il valore di partenza
	*/
	const config = { stiffness: 60, dumping: 14 };

	switch (params.id) {
		case 0:
			stile = { right: "50%" };
			animation = { direzione: "bottom", start: 10, end: 25 };
			break;
		case 1:
			stile = { bottom: "40%" };
			animation = { direzione: "right", start: 5, end: 20 };
			rotazioneCarta += 270;
			break;
		case 2:
			stile = { right: "30%" };
			animation = { direzione: "top", start: 5, end: 25 };
			rotazioneCarta += 180;
			break;
		case 3:
			stile = { left: "30%" };
			animation = { direzione: "top", start: 5, end: 25 };
			rotazioneCarta += 180;
			break;
		case 4:
			stile = { bottom: "40%" };
			animation = { direzione: "left", start: 5, end: 20 };
			rotazioneCarta += 90;
			break;
		default:
			break;
	}

	function toCSS(motionParams) {
		let nuovoStile = {
			...stile,
			opacity: motionParams.opacity,
			transform: `rotate(${motionParams.rotazione}deg)`,
		};
		nuovoStile[animation.direzione] = `${motionParams.variazionePartenza}%`;
		return nuovoStile;
	}

	return (
		<>
			<Motion
				defaultStyle={{
					rotazione: 0,
					opacity: 0,
					variazionePartenza: animation.start,
				}}
				style={{
					rotazione: spring(rotazioneCarta, config),
					variazionePartenza: spring(animation.end, config),
					opacity: spring(1, config),
				}}
			>
				{(style) => {
					return (
						<>
							{cartaUltima == null ? (
								""
							) : (
								<img
									style={toCSS(style)}
									className="carta-giocata"
									alt={"carta"}
									src={`https://raw.githubusercontent.com/NizarNadif/Briscolone/main/client/public/assets/${cartaUltima.url}.png`} //`translateY(${style.y}px)`
								/>
							)}
						</>
					);
				}}
			</Motion>
		</>
	);
}

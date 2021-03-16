import React from "react";
import { Motion, spring } from "react-motion";
import api from "./api";
import { verificaChiamata } from "./rules";

export function BarraChiamata(props) {
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

	let pulsantiJSX = ordine.map((nome, index) => {
		return (
			<PulsanteChiamata
				key={index}
				nome={nome}
				valore={index}
				attuale={props.attuale}
			/>
		);
	});
	return (
		<Motion
			defaultStyle={{ slidePercentage: 0, opacity: 0 }}
			style={{ slidePercentage: spring(50), opacity: spring(1) }}
		>
			{(style) => {
				return (
					<div
						style={{
							top: `${style.slidePercentage}%`,
							left: `${style.slidePercentage}%`,
							transform: `translate(-${style.slidePercentage}%, -${style.slidePercentage}%)`,
							opacity: style.opacity,
						}}
						className="barra-chiamata"
					>
						<p style={{ fontWeight: "bold" }}>Ultima chiamata: {props.attuale}</p>
						{pulsantiJSX}
						<button
							className="pulsante-non-chiamare"
							onClick={() => {
								api.invia(null);
							}}
						>
							non chiamare
						</button>
					</div>
				);
			}}
		</Motion>
	);
}

function PulsanteChiamata(props) {
	// let allowed = props.attuale <= props.valore ? "not-allowed" : "allowed";
	return (
		<button
			style={{
				visibility: `${props.attuale >= props.valore ? "hidden" : "visible"}`,
			}}
			className="pulsante-chiamata"
			onClick={() => {
				api.invia(props.valore);
			}}
		>
			{props.nome}
		</button>
	);
}

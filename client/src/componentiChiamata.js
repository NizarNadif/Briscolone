import React, { useReducer, useContext, useEffect } from "react";
import { verificaChiamata } from "./rules";

export function BarraChiamata(params) {
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
		"non chiamare",
	];

	let pulsantiJSX = ordine.map((nome, index) => {
		return (
			<PulsanteChiamata nome={nome} valore={index} attuale={params.attuale} />
		);
	});

	return (
		<div className="barra_chiamata disappear">
			<p>ultima chiamata: {params.attuale}</p>
			{pulsantiJSX}
		</div>
	);
}

function PulsanteChiamata(props) {
	let value = props.valore;
	if (props.valore == 10) value = "null";
	return (
		<button
			onClick={() => {
				verificaChiamata(props.attuale, value);
			}}
		>
			{props.nome}
		</button>
	);
}

import React, { useReducer, useContext, useEffect } from "react";

export function BarraChiamata() {
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

	let pulsantiJSX = ordine.map((nome) => {
		return <PulsanteChiamata nome={nome} />;
	});

	return <div className="barra_chiamata">{pulsantiJSX}</div>;
}

function PulsanteChiamata(props) {
	return <button>{props.nome}</button>;
}

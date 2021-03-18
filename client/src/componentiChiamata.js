import React from "react";
import { Motion, spring } from "react-motion";
import api from "./api";

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
						id="barra-chiamata"
					>
						<p style={{ fontWeight: "bold" }}>
							Ultima chiamata:{" "}
							{props.attuale.valore >= 0 ? ordine[props.attuale.valore] : ""}
						</p>
						{pulsantiJSX}
						<button
							className="pulsante-non-chiamare"
							onClick={() => {
								api.invia({
									valore: null,
									soglia: props.attuale.soglia,
								});
							}}
						>
							non chiamare
						</button>

						<input type="text" id="soglia" placeholder="scegli una soglia" />
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
			className={`pulsante-chiamata${
				props.attuale.valore >= props.valore ? " disabled" : ""
			}`}
			onClick={() => {
				let soglia = document.getElementById("soglia").value;
				if (soglia <= props.attuale.soglia)
					api.invia({
						valore: props.valore,
						soglia: 61,
					});
			}}
		>
			{props.nome}
		</button>
	);
}

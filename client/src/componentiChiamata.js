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
			defaultStyle={{ top: 0, left: 0, opacity: 0 }}
			style={{ top: spring(40), left: spring(50), opacity: spring(1) }}
		>
			{(style) => {
				return (
					<div
						style={{
							top: `${style.top}%`,
							left: `${style.left}%`,
							transform: `translate(-${style.left}%, -${style.left}%)`,
							opacity: style.opacity,
						}}
						id="barra-chiamata"
						className="hidden"
					>
						<p style={{ fontWeight: "bold" }}>
							{props.attuale.valore >= 0
								? "Ultima chiamata: " +
								  ordine[props.attuale.valore].toLocaleLowerCase() +
								  (props.attuale.soglia > 61 ? " a " + props.attuale.soglia : "")
								: "Sei il primo chiamante"}
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

						<SliderSoglia attuale={props.attuale} />
					</div>
				);
			}}
		</Motion>
	);
}

function PulsanteChiamata(props) {
	return (
		<button
			className={`pulsante-chiamata${
				props.attuale.valore >= props.valore && props.valore != 9 ? " disabled" : ""
			}`}
			onClick={() => {
				let soglia = parseInt(document.getElementById("soglia").value);
				console.log(soglia);
				if (props.attuale.valore == props.valore && props.valore == 9) {
					if (soglia > props.attuale.soglia)
						api.invia({
							valore: props.valore,
							soglia: soglia,
						});
				} else {
					api.invia({
						valore: props.valore,
						soglia: props.attuale.soglia,
					});
				}
			}}
		>
			{props.nome}
		</button>
	);
}

function SliderSoglia(props) {
	return (
		<div id="slider-soglia-contenitore" className="hidden">
			<input
				type="range"
				min={(props.attuale.soglia + 1).toString(10)}
				max="120"
				/* value={(props.attuale.soglia + 1).toString(10)} */
				id="soglia"
				step="1"
				onInput={(nuovaSoglia) => {
					document.getElementById("valoreSoglia").innerText =
						nuovaSoglia.target.valueAsNumber;
				}}
			/>
			<small id="valoreSoglia">
				{document.getElementById("soglia") == null
					? ""
					: document.getElementById("soglia").value}
			</small>
		</div>
	);
}

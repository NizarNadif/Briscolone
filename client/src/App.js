import React, { useReducer, useContext, useEffect } from "react";
import { Motion, spring } from "react-motion";
import assets from "./carte";
import { BarraChiamata } from "./componentiChiamata.js";
import "./style.css";
import api from "./api.js";

const AppContext = React.createContext(null);

export function App() {
	const [state, dispatch] = useReducer(reducer, {
		carte: new Array(),
		attuale: { valore: -1, soglia: 61 },
	});

	useEffect(() => {
		api.carteIniziali((carte) => {
			console.log(carte);
			dispatch({ type: "carte", payload: carte });
		});

		api.selezioneChiamata((attuale, chiamante) => {
			console.log("selezione chiamata", attuale);
			dispatch({ type: "chiamata attuale", payload: attuale });
			if (attuale.valore == 9)
				document
					.getElementById("slider-soglia-contenitore")
					.classList.remove("hidden");
			else
				document
					.getElementById("slider-soglia-contenitore")
					.classList.add("hidden");
			toggle(chiamante); // chiamante ? toggle : untoggle
		});

		api.prossimoTurno((myCard, prossimo, carta) => {
			console.log("Prossimo a giocare:", prossimo);
			console.log("Ultima carta giocata:", carta);
			if (myCard) dispatch({ type: "rimuovi carta", payload: carta });
		});

		api.scegliBriscola(() => {
			document.getElementById("selettore-briscola").classList.remove("hidden");
		});
	}, []);

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			<BarraChiamata attuale={state.attuale} />
			<SelettoreBriscola />
			<Mano />
		</AppContext.Provider>
	);
}

export function toggle(doBlur) {
	console.log("blur:", doBlur);
	var daSfocare = [document.getElementsByClassName("mano")[0]];

	daSfocare.forEach((element) => {
		doBlur ? element.classList.add("blur") : element.classList.remove("blur");
	});

	const classiBarra = document.getElementById("barra-chiamata").classList;
	doBlur ? classiBarra.remove("hidden") : classiBarra.add("hidden");
}

function reducer(state, action) {
	let newState = { ...state };
	switch (action.type) {
		case "carte":
			newState.carte = action.payload;
			break;
		case "chiamata attuale":
			newState.attuale = action.payload;
			break;
		case "rimuovi carta":
			let urlCarta = action.payload.url;
			newState.carte = state.carte.filter((carta) => {
				return carta.url != urlCarta;
			});
			break;
		default:
			break;
	}
	console.log("stato", newState);
	return newState;
}

export function Mano() {
	const { state, dispatch } = useContext(AppContext);

	let manoJSX = state.carte.map((carta, index) => {
		return <Carta key={index} carta={carta} />;
	});

	return <div className="mano">{manoJSX}</div>;
}

function Carta(props) {
	return (
		<Motion
			defaultStyle={{ y: +300, opacity: 0 }}
			style={{ y: spring(0), opacity: spring(1) }}
		>
			{(style) => {
				return (
					<img
						style={{
							opacity: style.opacity,
							transform: `translateY(${style.y}px)`,
						}}
						className="carta"
						alt={props.carta.valore + " di " + props.carta.seme}
						src={assets[props.carta.url]}
						onClick={() => {
							api.giocaCarta(props.carta);
						}}
					/>
				);
			}}
		</Motion>
	);
}

export function SelettoreBriscola() {
	let semi = ["Coppe", "Spade", "Bastoni", "Denari"];
	let briscoleJSX = semi.map((seme, index) => {
		return (
			<button
				key={index}
				onClick={() => {
					api.briscolaScelta(seme);
					document.getElementById("selettore-briscola").classList.add("hidden");
				}}
			>
				{seme}
			</button>
		);
	});
	return (
		<div id="selettore-briscola" className="hidden">
			{briscoleJSX}
		</div>
	);
}

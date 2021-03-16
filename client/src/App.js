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
		attuale: {valore: 0, soglia: 61},
		dynamicComoponents: new Array(),
		callingPhase: true,
	});

	useEffect(() => {
		api.carteIniziali((carte) => {
			console.log(carte);
			dispatch({ type: "carte", payload: carte });
		});

		api.selezioneChiamata((attuale, chiamante) => {
			console.log("selezione chiamata", attuale.valore);
			dispatch({ type: "chiamata attuale", payload: attuale });
			toggle(chiamante); // chiamante ? toggle : untoggle
		});

		api.prossimoTurno((myCard, prossimo, carta) => {
			console.log("Prossimo a giocare:", prossimo);
			console.log("Ultima carta giocata:", carta);
			if (myCard) dispatch({ type: "rimuovi carta", payload: carta });
		});

		api.scegliBriscola(() => {
			let classi = "selettoreBriscola appear";
			document.getElementsByClassName("selettoreBriscola")[0].className = classi;
		});
	}, []);

	let components = state.dynamicComoponents;
	return (
		<AppContext.Provider value={{ state, dispatch }}>
			<BarraChiamata attuale={state.attuale} />
			<SelettoreBriscola />
			<Mano />
		</AppContext.Provider>
	);
}

function toggle(doBlur) {
	var blur = document.getElementsByClassName("blur");

	for (var i = 0; i < blur.length; i++) {
		blur[i].classList.toggle(doBlur ? "active" : "unactive");
	}

	document
		.getElementByClassName("barra-chiamata")[0]
		.toggle(doBlur ? "active" : "unactive");

	/* var popup = document.getElementById("barra-chiamata");
	popup.classList.toggle("active"); */
}

function reducer(state, action) {
	let newState = { ...state };
	switch (action.type) {
		case "carte":
			newState.carte = action.payload;
			newState.dynamicComoponents.push(<Mano />);
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
	console.log(newState);
	return newState;
}

export function Mano() {
	const { state, dispatch } = useContext(AppContext);

	let manoJSX = state.carte.map((carta, index) => {
		return <Carta key={index} carta={carta} />;
	});

	return <div className="mano blur">{manoJSX}</div>;
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
					let classi = "selettoreBriscola disappear";
					document.getElementsByClassName("selettoreBriscola")[0].className = classi;
				}}
			>
				{seme}
			</button>
		);
	});
	return <div className="selettoreBriscola disappear">{briscoleJSX}</div>;
}

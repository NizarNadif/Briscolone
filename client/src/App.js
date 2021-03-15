import React, { useReducer, useContext, useEffect } from "react";
import assets from "./carte";
import { BarraChiamata } from "./componentiChiamata.js";
import "./style.css";
import api from "./api.js";
import { Motion, spring } from "react-motion";

const AppContext = React.createContext(null);

export function App() {
	const [state, dispatch] = useReducer(reducer, {
		carte: new Array(),
		attuale: 0,
		dynamicComoponents: new Array(),
	});

	useEffect(() => {
		api.carteIniziali((carte) => {
			console.log(carte);
			dispatch({ type: "carte", payload: carte });
		});

		api.selezioneChiamata((attuale, chiamante) => {
			console.log("selezione chiamata", attuale);
			let classi = "barra_chiamata ";
			if (chiamante) {
				console.log("tocca a te!");
				classi += "appear";
			} else classi += "disappear";
			document.getElementsByClassName("barra_chiamata")[0].className = classi;
			dispatch({ type: "chiamata attuale", payload: attuale });
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
		<div className="ping-zone">
			<AppContext.Provider value={{ state, dispatch }}>
				<BarraChiamata attuale={state.attuale} />
				<SelettoreBriscola />
				<Mano />
			</AppContext.Provider>
		</div>
	);
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

	return <div className="mano">{manoJSX}</div>;
}

function Carta(props) {
	return (
		<Motion
			defaultStyle={{ y: -40, opacity: 0 }}
			style={{ y: spring(0), opacity: spring(1) }}
		>
			{(style) => {
				return (
					<img
						style={{
							opacity: style.opacity,
							transform: `translateY(${style.y}px)`,
							margin: "20px",
							width: "100px",
							border: "solid 1px black",
							outline: "solid 8px white",
							mozOutlineRadius: "5px",
						}}
						// className="carta"
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

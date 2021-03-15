import React, { useReducer, useContext, useEffect } from "react";
import assets from "./carte";
console.log(assets);
import { BarraChiamata } from "./componentiChiamata.js";
import "./style.css";
import {
	carteIniziali,
	selezioneChiamata,
	giocaCarta,
	prossimoTurno,
	scegliBriscola,
	briscolaScelta,
} from "./api.js";
const AppContext = React.createContext(null);

export function App() {
	const [state, dispatch] = useReducer(reducer, {
		carte: new Array(),
		attuale: 0,
	});

	useEffect(() => {
		carteIniziali((carte) => {
			console.log(carte);
			dispatch({ type: "carte", payload: carte });
		});

		selezioneChiamata((attuale, chiamante) => {
			console.log("selezione chiamata", attuale);
			let classi = "barra_chiamata ";
			if (chiamante) {
				console.log("tocca a te!");
				classi += "appear";
			} else classi += "disappear";
			document.getElementsByClassName("barra_chiamata")[0].className = classi;
			dispatch({ type: "chiamata attuale", payload: attuale });
		});

		prossimoTurno((myCard, prossimo, carta) => {
			console.log("Prossimo a giocare:", prossimo);
			console.log("Ultima carta giocata:", carta);
			if (myCard) dispatch({ type: "rimuovi carta", payload: carta });
		});

		scegliBriscola(() => {
			let classi = "selettoreBriscola appear";
			document.getElementsByClassName("selettoreBriscola")[0].className = classi;
		})
	}, []);

	return (
		<div className="ping-zone">
			<AppContext.Provider value={{ state, dispatch }}>
				<BarraChiamata attuale={state.attuale} />
				<SelettoreBriscola />
				<Carte />
			</AppContext.Provider>
		</div>
	);
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
	console.log(newState);
	return newState;
}

export function Carte() {
	const { state, dispatch } = useContext(AppContext);

	let manoJSX = state.carte.map((carta) => {
		return <Carta carta={carta} />;
	});

	return <div className="mano">{manoJSX}</div>;
}

function Carta(props) {
	return (
		<button
			onClick={() => {
				giocaCarta(props.carta);
			}}
		>
			{/*props.carta.valore + " di " + props.carta.seme*/}
			{<img src={assets[props.carta.url]}></img>}
		</button>
	);
}

export function SelettoreBriscola(){
	let semi = ["Coppe", "Spade", "Bastoni", "Denari"];
	let briscoleJSX = semi.map((seme) => {
		return <button 
			onClick={() => {
				briscolaScelta(seme);
				let classi = "selettoreBriscola disappear";
				document.getElementsByClassName("selettoreBriscola")[0].className = classi;
			}}
		>
			{seme}
		</button>
	})
	return <div className="selettoreBriscola disappear">{briscoleJSX}</div>
}

import React, { useReducer, useContext, useEffect } from "react";
import { BarraChiamata } from "./componentiChiamata.js";
import "./style.css";
import {
	ping,
	pong,
	carteIniziali,
	selezioneChiamata,
} from "./api.js";
const AppContext = React.createContext(null);

export function App() {
	const [state, dispatch] = useReducer(reducer, {
		ping: 0,
		pong: 0,
		registroAzioni: new Array(),
		carte: new Array(),
		attuale: 0,
	});

	useEffect(() => {
		pong((type) => {
			console.log("pong arrivato");
			dispatch({ type: type });
		});
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
	}, []);

	return (
		<div className="ping-zone">
			<AppContext.Provider value={{ state, dispatch }}>
				<DataWindow />
				<PingButton />
				<BarraChiamata attuale={state.attuale} />
			</AppContext.Provider>
		</div>
	);
}

function reducer(state, action) {
	let newState = { ...state };
	switch (action.type) {
		case "ping":
			newState.ping = state.ping++;
			newState.registroAzioni = [...state.registroAzioni, "ping"];
			break;
		case "pong":
			newState.pong = state.pong++;
			newState.registroAzioni = [...state.registroAzioni, "pong"];
			break;
		case "carte":
			newState.carte = action.payload;
			break;
		case "chiamata attuale":
			newState.attuale = action.payload;
			break;
		default:
			break;
	}
	console.log(newState);
	return newState;
}

export function DataWindow(props) {
	const { state, dispatch } = useContext(AppContext);

	return (
		<div className="data-window">
			<h1>pings sent: {state.ping}</h1>
			<h1>pongs received: {state.pong}</h1>
		</div>
	);
}

export function PingButton(props) {
	const { state, dispatch } = useContext(AppContext);

	return (
		<button
			onClick={() => {
				ping();
				dispatch({ type: "ping" });
			}}
		>
			PING
		</button>
	);
}

import React, { useReducer, useContext, useEffect } from "react";
import { ping, pong, carteIniziali, chiama, chiamata, selezioneChiamata, invia } from "./api.js";
import { valoreChiamata } from "./rules.js";
import "./style.css";
const AppContext = React.createContext(null);

export function App() {
	const [state, dispatch] = useReducer(reducer, {
		ping: 0,
		pong: 0,
		registroAzioni: new Array(),
		carte: new Array(),
		attuale: 0,
	});
	let elementi = '';
	useEffect(() => {
		pong((type) => {
			console.log("pong arrivato");
			dispatch({ type: type });
		});
		carteIniziali((carte) => {
			console.log(carte);
			dispatch({ type: "carte", payload: carte });
		});
		/*
		chiama((attuale, callbackServer) => {
			callbackServer(valoreChiamata(attuale, state.carte));
		});
		*/
		chiama((attuale) => {
			chiamata(valoreChiamata(attuale, state.carte));
		});

		selezioneChiamata((attuale) => {
			elementi = <Selezione valore={attuale} />
		})
	}, []);

	return (
		<div className="ping-zone">
			<AppContext.Provider value={{ state, dispatch }}>
				<DataWindow />
				<PingButton />
				<Selezione valore={0}/>
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

export function Selezione(props) {
	const { state, dispatch } = useContext(AppContext);

	return (
		<div className="selezione">
			<textarea id="testo"></textarea>
			<label id="label">{props.valore}</label>
			<button
				onClick={() => {
					invia(document.getElementById("testo").innerHTML);
				}}
			>
			Invia valore
			</button>
		</div>
	)
}
import React, { useReducer, useContext, useEffect } from "react";
import { ping, pong } from "./api.js";
/* import openSocket from "socket.io-client"; */
import "./style.css";
const AppContext = React.createContext(null);

export function App() {
	const [state, dispatch] = useReducer(reducer, {
		ping: 0,
		pong: 0,
		registroAzioni: new Array(),
	});

	useEffect(() => {
		pong((type) => {
			console.log("pong arrivato");
			dispatch({ type: type });
		});
	}, []);

	/* 	socket.on("connect", () => {
		console.log("connessione...");
	});

	socket.on("pong", () => {
		console.log("ciao");
		dispatch({ type: "pong" });
	}); */

	return (
		<div className="ping-zone">
			<AppContext.Provider value={{ state, dispatch }}>
				<DataWindow />
				<PingButton />
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

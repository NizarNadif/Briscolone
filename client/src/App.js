import React, { useReducer, useContext, useEffect } from "react";
import { Motion, spring } from "react-motion";
import assets from "./carte";
import { BarraChiamata } from "./componentiChiamata.js";
import "./style.css";
import api from "./api.js";
import { Player } from "./Players.js";

const AppContext = React.createContext(null);

export function App() {
	const [state, dispatch] = useReducer(reducer, {
		carte: new Array(),
		attuale: { valore: -1, soglia: 61 },
		giocatori: new Array(),
		giocatoreAttuale: 0,
	});

	let PlayersJSX = [
		<Player id={"giocatore-0"} giocatore={{ id: "primo", carte: 8 }} />,
		<Player id={"giocatore-1"} giocatore={{ id: "secondo", carte: 8 }} />,
		<Player id={"giocatore-2"} giocatore={{ id: "terzo", carte: 8 }} />,
		<Player id={"giocatore-3"} giocatore={{ id: "quarto", carte: 8 }} />,
	];

	useEffect(() => {
		api.carteIniziali((carte) => {
			console.log(carte);
			dispatch({ type: "carte", payload: carte });
		});

		api.giocatoriIniziali((players) => {
			console.log(players);
			dispatch({ type: "giocatori", payload: players });
			PlayersJSX = state.giocatori.map((playerID, index) => {
				return (
					<Player id={`giocatore-${index}`} giocatore={state.giocatori[index]} />
				);
			});
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
			blur(
				chiamante,
				[document.getElementsByClassName("mano")[0]],
				"popup-chiamata"
			);
		});

		api.turnoPrecedente((myCard, carta, precedente) => {
			console.log("Ultima carta giocata:", carta);
			if (myCard) dispatch({ type: "rimuovi carta", payload: carta });
			else dispatch({ type: "ha giocato una carta", payload: precedente });
		});

		api.scegliBriscola(() => {
			blur(
				true,
				[document.getElementsByClassName("mano")[0]],
				"popup-selettore-briscola"
			);
		});
	}, []);

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			<p style={{ visibility: "hidden" }}>you should not see me :(</p>
			<Popup
				elementJSX={<BarraChiamata attuale={state.attuale} />}
				id="popup-chiamata"
			/>
			<Popup elementJSX={<SelettoreBriscola />} id="popup-selettore-briscola" />
			{PlayersJSX}
			<Mano />
		</AppContext.Provider>
	);
}

export function blur(doBlur, arrayBlur, popupID) {
	console.log("blur:", doBlur);

	arrayBlur.forEach((element) => {
		doBlur ? element.classList.add("blur") : element.classList.remove("blur");
	});

	const popupClasses = document.getElementById(popupID).classList;
	doBlur ? popupClasses.remove("hidden") : popupClasses.add("hidden");
}

function reducer(state, action) {
	let newState = { ...state };
	switch (action.type) {
		case "carte":
			newState.carte = action.payload;
			newState.attuale = { valore: -1, soglia: 61 };
			break;
		case "giocatori":
			newState.giocatori = action.payload;
			break;
		case "ha giocato una carta":
			let i = 0;
			state.giocatori.forEach((giocatore, index) => {
				if (giocatore.id == action.payload) {
					i = index;
					newState.giocatori[index].carte = state.giocatori[index].carte - 1;
				}
			});
			console.log(newState.giocatori[i].carte, i);
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
					blur(
						false,
						[document.getElementsByClassName("mano")[0]],
						"popup-selettore-briscola"
					);
				}}
			>
				{seme}
			</button>
		);
	});
	return (
		<div id="selettore-briscola">
			<p style={{ fontWeight: "bold" }}> Scegli una briscola </p>
			{briscoleJSX}
		</div>
	);
}

export function Popup(props) {
	return (
		<Motion
			defaultStyle={{ top: 0, left: 0, opacity: 0 }}
			style={{ top: spring(40), left: spring(50), opacity: spring(1) }}
		>
			{(style) => {
				return (
					<div
						id={props.id}
						className="popup hidden"
						style={{
							top: `${style.top}%`,
							left: `${style.left}%`,
							transform: `translate(-${style.left}%, -${style.left}%)`,
							opacity: style.opacity,
						}}
					>
						{props.elementJSX}
					</div>
				);
			}}
		</Motion>
	);
}

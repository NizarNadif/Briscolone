import React, { useReducer, useContext, useEffect } from "react";
import { Motion, spring } from "react-motion";
import assets from "./carte";
import { BarraChiamata } from "./componentiChiamata.js";
import "./style.css";
import api from "./api.js";
import { Player, CartaGiocata } from "./Players.js";

const AppContext = React.createContext(null);

export function App() {
	const [state, dispatch] = useReducer(reducer, {
		carte: new Array(),
		attuale: { valore: -1, soglia: 61 },
		ultimaCartaNostra: null,
		giocatori: [
			{ id: "giocatore 1", carte: 8, ultimaCarta: null },
			{ id: "giocatore 2", carte: 8, ultimaCarta: null },
			{ id: "giocatore 3", carte: 8, ultimaCarta: null },
			{ id: "giocatore 4", carte: 8, ultimaCarta: null },
		],
		giocatoreAttuale: -1,
		bloccoCarte: false,
		log: new Array(),
		cartaSocio: {valore: null, seme: null},
		chiamante: null,
		finePartita: false,
		vincente: false,
	});

	let PlayersJSX = [];
	for (let i = 0; i < 4; i++)
		PlayersJSX[PlayersJSX.length] = <Player key={`player-${i}`} id={i} contesto={AppContext} />;
	
	let CardsPlayedJSX = [];
	for (let i = 0; i < 5; i++)
		CardsPlayedJSX[CardsPlayedJSX.length] = <CartaGiocata key={`cardPlayed-${i}`} id={i} contesto={AppContext} />;
	
	useEffect(() => {
		api.carteIniziali((carte) => {
			console.log(carte);
			dispatch({ type: "carte", payload: carte });
		});

		api.giocatoriIniziali((players) => {
			console.log(players);
			dispatch({ type: "giocatori", payload: players });
		});

		api.eventoLog((evento, itsMe) => {
			dispatch({ type: "evento", payload: `${itsMe ? 'Hai' : evento.user + ' ha'} ${evento.stringa}` });
		});

		api.selezioneChiamata((attuale, chiamante, isChiamante) => {
			if (chiamante != "RandomID")
				dispatch({ type: "chiamante", payload: chiamante });
			dispatch({ type: "chiamata attuale", payload: attuale });
			if (attuale.valore == 9)
				document
					.getElementById("slider-soglia-contenitore")
					.classList.remove("hidden");
			else
				document
					.getElementById("slider-soglia-contenitore")
					.classList.add("hidden");
			blur(isChiamante, ["mano", "player", "carta-giocata"], "popup-chiamata");
		});

		api.cartaSocio((cartaSocio) => {
			dispatch({ type: "carta socio", payload: cartaSocio });
		})

		api.prossimoTurno((prossimo) => {
			console.log("Prossimo a giocare:", prossimo);
			dispatch({ type: "giocatore attuale", payload: prossimo });
		});

		api.vincitoreTurno((vincitore, isVincitore) => {
			console.log("Il turno è stato vinto da:", vincitore);
			dispatch({ type: "switch"});
			
			function sleep(time) { return new Promise((resolve) => setTimeout(resolve, time)) };
			sleep(3750).then(() => {
				dispatch({ type: "vincitore turno" });
				sleep(500).then(() => {dispatch({ type: "switch"})});
			});
		});

		api.turnoPrecedente((myCard, carta, precedente) => {
			console.log("Ultima carta giocata:", carta);
			if (myCard) dispatch({ type: "rimuovi carta", payload: carta });
			else
				dispatch({
					type: "ha giocato una carta",
					payload: { giocatore: precedente, carta: carta },
				});
		});

		api.scegliBriscola(() => {
			blur(true, ["mano", "player", "carta-giocata"], "popup-selettore-briscola");
		});

		api.vincitore((itsMe, punti) => {
			if ((itsMe && punti < state.attuale.soglia ) || (!itsMe && punti >= state.attuale.soglia)){
				dispatch({ type: "sconfitta"});
			} else {
				dispatch({ type: "vittoria"});
			}
		})
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
			{CardsPlayedJSX}
			<Log />
			<Mano />
			<CartaSocio />
			{state.finePartita ? <Popup elementJSX={<FinePartita />}/> : ""}
		</AppContext.Provider>
	);
}

export function CartaSocio(){
	const { state, dispatch } = useContext(AppContext);

	return (
		<>
		{state.cartaSocio.seme == null ? "" : (
			<div className="display-socio">
				<p>Carta del socio</p>
				<img
				src={assets[state.cartaSocio.seme + state.cartaSocio.valore]}
				className="carta"
				/>
				<p>Chiamante:<br/>{state.chiamante}</p>
			</div>
		)
		
		}
	</>)
}

export function blur(doBlur, classesToBlur, popupID) {
	console.log("blur:", doBlur);

	classesToBlur.forEach((classToBlur) => {
		let elements = document.getElementsByClassName(classToBlur);
		console.log(elements.length);
		for (let i = 0; i < elements.length; i++)
			doBlur
				? elements[i].classList.add("blur")
				: elements[i].classList.remove("blur");
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
			for (let i = 0; i < 4; i++) newState.giocatori[i].carte = 8;
			newState.cartaSocio = { valore: null, seme: null };
			newState.log = new Array();
			newState.chiamante = null;
			newState.vincente = false;
			//newState.finePartita = false;
			break;
		case "giocatori":
			newState.giocatori = action.payload;
			break;
		case "chiamante":
			newState.chiamante = action.payload;
			break;
		case "ha giocato una carta":
			let i = 0;
			state.giocatori.forEach((giocatore, index) => {
				if (giocatore.id == action.payload.giocatore) {
					i = index;
					newState.giocatori[index].carte = state.giocatori[index].carte - 1;
					action.payload.carta["angolo"] = Math.random() * 40 - 20;
					newState.giocatori[index].ultimaCarta = action.payload.carta;
				}
			});
			console.log(newState.giocatori[i].carte, i);
			break;
		case "vincitore turno":
			newState.ultimaCartaNostra = null;
			newState.giocatori.forEach((giocatore, index) => {
				newState.giocatori[index].ultimaCarta = null;
			});
			break;

		case "abbiamo giocato una carta":
			newState.ultimaCartaNostra = action.payload;
			newState.ultimaCartaNostra["angolo"] = Math.random() * 40 - 20;
			api.giocaCarta(action.payload);
			break;
		case "chiamata attuale":
			newState.attuale = action.payload;
			break;
		case "carta socio":
			newState.cartaSocio = action.payload;
			break;
		case "rimuovi carta":
			let urlCarta = action.payload.url;
			newState.carte = state.carte.filter((carta) => {
				return carta.url != urlCarta;
			});
			break;
		case "giocatore attuale":
			if (newState.giocatoreAttuale >= 0)
				document
					.getElementById(`player-${newState.giocatoreAttuale}`).
					classList.remove("player-attuale");
			newState.giocatoreAttuale = state.giocatori
				.map((el) => el.id)
				.indexOf(action.payload);
			if (newState.giocatoreAttuale >= 0)
				document
					.getElementById(`player-${newState.giocatoreAttuale}`).
					classList.add("player-attuale");
			break;
		case "switch":
			newState.bloccoCarte = !state.bloccoCarte;
			break;
		case "evento":
			newState.log.unshift(action.payload);
			break;
		case "vittoria":
			newState.vincente = true;
		case "sconfitta":
			newState.finePartita = true;
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
		return <Carta key={`card-${index}`} carta={carta} />;
	});

	return <div className="mano">{manoJSX}</div>;
}

function Carta(props) {
	const { state, dispatch } = useContext(AppContext);

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
							if (state.giocatoreAttuale == -1 && !state.bloccoCarte)
								dispatch({ type: "abbiamo giocato una carta", payload: props.carta });
						}}
					/>
				);
			}}
		</Motion>
	);
}

export function SelettoreBriscola() {
	const { state, dispatch } = useContext(AppContext);
	let semi = ["Coppe", "Spade", "Bastoni", "Denari"];
	let ordine = [
		"Asse",
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
	let sociJSX = semi.map((seme, index) => {
		return (
			<img
				key={index}
				className="carta"
				src={assets[seme + ordine[state.attuale.valore]]}
				onClick={() => {
					api.briscolaScelta(seme);
					blur(
						false,
						["mano", "player", "carta-giocata"],
						"popup-selettore-briscola"
					);
				}}
			/>
		);
	});
	return (
		<div id="selettore-briscola">
			<p style={{ fontWeight: "bold" }}> Scegli una briscola </p>
			{sociJSX}
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

function Log() {
	const { state, dispatch } = useContext(AppContext);

	let logJSX = state.log.map((evento, index) => {
		return <div key={`evento-${index}`} className="evento">{evento}</div>
	})
	return (
		<div className="log">
			{logJSX}
		</div>
	)
}

function FinePartita(){
	const { state, dispatch } = useContext(AppContext);

	let classe = state.vincente ? "vittorioso" : "sconfitto";

	return (
		<div className={classe}>
			{state.vincente ? "HAI VINTO" : "HAI PERSO"}
			<button onClick={() => {}} />
		</div>
	)
}
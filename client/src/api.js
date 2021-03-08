import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:4321");

socket.on("connect", () => {
	console.log("connessione...");
});

export function ping() {
	socket.emit("ping", {});
}

export function pong(callback) {
	socket.on("pong", () => callback("pong"));
}

export function carteIniziali(callback) {
	socket.on("carteIniziali", (carte) => callback(carte));
}

export function chiama(callback) {
	//socket.on("chiama", (attuale) => callback(attuale));
	socket.on("chiama", async (attuale, tempo) => {
		await new Promise((resolve, reject) => {
			setTimeout(resolve, tempo);
		})
		if (params.chiamata == null) {
			chiamanti.splice(i, 1);
		}
		else {
			attuale = params.chiamata;
		}
	})
}

export function chiamata(valore) {
	socket.emit("chiamata", valore);
}

/* export function ping(cb) {
	socket.on("timer", (timestamp) => cb(null, timestamp));
	socket.emit("subscribeToTimer", 1000);
} */

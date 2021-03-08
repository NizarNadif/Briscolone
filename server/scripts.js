module.exports = {
    game,
};

let users;
let io;
let deck = new Array();
let giocatoreIniziale = 0;
async function game(utenti, connessione) {
    //io.emit("pong", {});
    users = utenti;
    io = connessione;
    cardsDistribution();

    call();
}

async function cardsDistribution() {
    deckGenerator();

    deck = deck.sort(() => Math.random() - 0.5);
    let indice = 0;
    users.forEach((player) => {
        player.emit("carteIniziali", deck.slice(indice, (indice += 8)));
    });
}

async function deckGenerator() {
    let semi = ["Coppe", "Spade", "Bastoni", "Denari"];
    let valori = [
        "Asse",
        "Due",
        "Tre",
        "Quattro",
        "Cinque",
        "Sei",
        "Sette",
        "Fante",
        "Cavallo",
        "Re",
    ];
    let punti = [11, 0, 10, 0, 0, 0, 0, 2, 3, 4];
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 10; j++)
            deck.push({
                seme: semi[i],
                valore: valori[j],
                url: semi[i] + valori[j] + ".png",
                punti: punti[j],
            });
}

async function call() {
    let chiamanti = Array.from(users.values());
    let id = Array.from(users.keys());
    console.log("Call");
    let ordine = [
        "Asso",
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
    let attuale = 0;
    let flag = 0;
    console.log(chiamanti.length);
    for (let i = giocatoreIniziale; chiamanti.length > 1 & i<5; i++ % chiamanti.length ) {
        console.log(i);
        let result = await chiamanti[i].emitWait("chiama", attuale, 10000);
        if (result == null) {
            chiamanti.splice(i, 1);
        }
        else {
            attuale = result;
        }

        /*
        chiamanti[i].on("chiamata", (params) => {
            flag = 1;
            if (params.chiamata == null) {
                chiamanti.splice(i, 1);
            }
            else {
                attuale = params.chiamata;
            }
        });
        while (flag == 0);
        flag = 0;
        
        chiamanti[i].on("chiamata", async (params) => {
            await new Promise ((resolve,reject) =>{
                setTimeout(resolve, 10000);
            })
            if (params.chiamata == null) {
                chiamanti.splice(i, 1);
            }
            else {
                attuale = params.chiamata;
            }
        });
        */
    }
}

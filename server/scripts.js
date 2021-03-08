module.exports = {
	game,

};



function game(users, io){
    //io.emit("pong", {});
    
    call(users, io);
}

function call(users, io){
    let chiamanti = Array.from(users.values());
    let id = Array.from(users.keys());
    console.log("Call");
    let ordine = ['Asso', 'Tre', 'Re', 'Cavallo', 'Fante', 'Sette', 'Sei', 'Cinque', 'Quattro', 'Due'];
    let attuale = 0;
    console.log(chiamanti.length);
    while (chiamanti.length > 1){
        chiamanti.forEach(player => {
            //io.to(id[0]).emit("pong", {});
            //console.log(player.id);
            player.emit("pong", {});
        });
    }
}
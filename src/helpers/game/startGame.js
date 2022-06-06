const GameDB = require("../../models/game");
const Utils = require("./util");

module.exports = async (player, gameID, socket) => {
    try {
        // find the game
        const game = await GameDB.findOne({ id: gameID }).exec();

        // respond 404 if game is null
        if (game === null) {
            return { code: 0, message: "Game not found!" };
        }

        // check if game is already started or finished
        if (game.status.gameStatus > 0) {
            return { code: 1, message: "Game already started or finished!" };
        }

        // check if game starter is creator or not
        if (game.creator !== player.id) {
            return { code: 2, message: "Player requesting to start game is not the game creator!" };
        }

        // check if enough players are present, i.e. players > 1
        if (game.players.length < 2) {
            return { code: 3, message: "Not Enough players to start game!" };
        }

        // change game status to started (1)
        game.status.gameStatus = 1;

        // distribute cards to all players
        for (let i = 0; i < game.players.length * 3; i++) {
            const card = game.deck.shift();
            game.players[i % game.players.length].cards.push(card);
        }

        // set top card
        game.status.topCard = Utils.SelectFirstTopCard(game);

        // set next player
        game.status.nextPlayer = 1;

        // update game instance in DB
        await GameDB.updateOne({ id: gameID }, game);

        // emit event of new player added
        socket.to(gameID).emit("update", `game started`);

        console.log(`GAME ${gameID} has been started!`);

        return gameID;
    } catch (err) {
        console.error(err);
        return { code: -1, message: "Internal Server Error!" };
    }
};

const GameDB = require("../../models/game");
const { players } = require("../../models/json/game-model");

module.exports = async (player, gameID, socket) => {
    try {
        // find the game
        const game = await GameDB.findOne({ id: gameID }).exec();

        // respond 404 if game is null
        if (game === null) {
            throw new Error("Game not found!");
        }

        // check if game is already started or finished
        if (game.status.gameStatus > 0) {
            throw new Error("Game already started or finished!");
        }

        // check if game starter is creator or not
        if (game.creator !== player.id) {
            throw new Error("Player requesting to start game is not the game creator!");
        }

        // change game status to started (1)
        game.status.gameStatus = 1;

        // distribute cards to all players
        for (let i = 0; i < game.players.length * 3; i++) {
            const card = game.deck.shift();
            game.players[i % game.players.length].cards.push(card);
        }

        // set top card
        game.status.topCard = game.deck.shift();

        // update game instance in DB
        await GameDB.updateOne({ id: gameID }, game);

        // emit event of new player added
        socket.to(gameID).emit("update", `game started`);

        return gameID;
    } catch (err) {
        console.error(err);
        return null;
    }
};

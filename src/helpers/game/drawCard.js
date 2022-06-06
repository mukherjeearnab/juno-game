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

        const playerIndex = Utils.GetPlayerIndexFromID(player.id, game);

        // check if game is not yet started or finished
        if (game.status.gameStatus !== 1) {
            return { code: 1, message: "Game not started or is already finished!" };
        }

        // check if sending player is eligible
        if (playerIndex !== game.status.nextPlayer) {
            return { code: 2, message: `Player ${player.id} is not eligible for drawing card from deck!` };
        }

        // check if game round is color select or not
        if (game.status.next === 1) {
            return {
                code: 3,
                message: "nextPlayer needs to select a new color for top stack!Color change is no available!",
            };
        }

        // pick a card from the deck and add it to the list of cards of the player
        const card = game.deck.shift();
        game.players[playerIndex].cards.push(card);

        // update next player to adjacent player
        game.status.nextPlayer = Utils.GetNextPlayerIndex(game, 1);

        // update game instance in DB
        await GameDB.updateOne({ id: gameID }, game);

        // emit event of new player added
        socket.to(gameID).emit("update", `picked card from deck`);

        console.log(`PLAYER ${player.id} has drawn card from the deck in Game ${gameID}`);

        return {
            code: 200,
            message: `Player ${player.id} has drawn card from the deck in Game ${gameID}`,
        };
    } catch (err) {
        console.error(err);
        return { code: -1, message: `Internal Server Error!` };
    }
};

// TODO CHECK IF A PLAYER, REQUESTING SOMETHING BELONGS TO THE GAME OR NOT

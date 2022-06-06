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

        // get player index (-1 of not found)
        const playerIndex = Utils.GetPlayerIndexFromID(player.id, game);

        // if player id is -1, the player does not belong to the game
        if (playerIndex === -1) {
            return { code: 1, message: "Player does not belong to the game!" };
        }

        // check if game is not yet started or finished
        if (game.status.gameStatus !== 1) {
            return { code: 2, message: "Game not started or is already finished!" };
        }

        // check if sending player is eligible
        if (playerIndex !== game.status.nextPlayer) {
            return { code: 3, message: `Player ${player.id} is not eligible for saying uno (not their chance)!` };
        }

        // check if sending player is eligible
        if (game.players[playerIndex].cards.length > 2) {
            return {
                code: 4,
                message: `Player ${player.id} is not eligible for saying uno (more than 2 cards available)!`,
            };
        }

        // check if game round is color select or not
        if (game.status.next === 1) {
            return {
                code: 5,
                message: "nextPlayer needs to select a new color for top stack! Declaring uno is no available!",
            };
        }

        // set players uno flag to true
        game.players[playerIndex].uno = true;

        // update game instance in DB
        await GameDB.updateOne({ id: gameID }, game);

        // emit event of new player added
        socket.to(gameID).emit("update", `player declared uno`);

        console.log(`PLAYER ${player.id} has declared UNO in Game ${gameID}`);

        return {
            code: 200,
            message: `Player ${player.id} has declared UNO in Game ${gameID}`,
        };
    } catch (err) {
        console.error(err);
        return { code: -1, message: `Internal Server Error!` };
    }
};

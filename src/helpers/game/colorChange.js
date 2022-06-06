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
            return { code: 3, message: `Player ${player.id} is not eligible for color change!` };
        }

        // check if game round is color select or not
        if (game.status.next === 0) {
            return { code: 4, message: "Color change is no available!" };
        }

        // check if color selected is valid or not
        if (!(player.color < 4 && player.color >= 0)) {
            return { code: 5, message: "Invalid color choosen!" };
        }

        const colors = ["red", "green", "blue", "yellow"];

        // set top card
        game.status.topCard = `${colors[player.color]}-colorchange`;

        // change game next to normal round (0)
        game.status.next = 0;

        // update next player to adjacent player
        game.status.nextPlayer = Utils.GetNextPlayerIndex(game, 1);

        // update game instance in DB
        await GameDB.updateOne({ id: gameID }, game);

        // emit event of new player added
        socket.to(gameID).emit("update", `color change`);

        console.log(`PLAYER ${player.id} has choosen color ${colors[player.color]} in Game ${gameID}`);

        return {
            code: 200,
            message: `Player ${player.id} has choosen color ${colors[player.color]} in Game ${gameID}`,
        };
    } catch (err) {
        console.error(err);
        return { code: -1, message: `Internal Server Error!` };
    }
};

// TODO DRAW CARD IF NO CARD IS VALID IN PLAYER MOVE
// (FRONTEND OR BACKEND)

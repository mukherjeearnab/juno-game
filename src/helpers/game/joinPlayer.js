const GameDB = require("../../models/game");

module.exports = async (player, gameID, socket) => {
    try {
        // find the game
        const game = await GameDB.findOne({ id: gameID }).exec();

        // respond 404 if game is null
        if (game === null) {
            return { code: 0, message: "Game not found!" };
        }

        if (game.status.gameStatus > 0) {
            return { code: 1, message: "Game already started or finished!" };
        }

        const newPlayer = {
            id: player.id,
            name: player.name,
            cards: [],
            uno: false,
            moves: 0,
        };

        // push new player to players array
        game.players.push(newPlayer);

        // update game instance in DB
        await GameDB.updateOne({ id: gameID }, game);

        // emit event of new player added
        socket.to(gameID).emit("player-join", `Welcome Player ${player.id}!`);

        console.log(`${player.id} JOINED GAME ${gameID}`);

        return { code: 200, message: `Player ${player.id} joined Game ${gameID}` };
    } catch (err) {
        console.error(err);
        return { code: -1, message: "Internal Server Error" };
    }
};

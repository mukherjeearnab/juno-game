const GameDB = require("../../models/game");

module.exports = async (gameID) => {
    try {
        // find the game
        const game = await GameDB.findOne({ id: gameID }).exec();

        // respond 404 if game is null
        if (game === null) {
            return { code: 0, message: "Game not found!", game: null };
        } else {
            // else return the game instance
            return { code: 1, message: "Game found!", game: game };
        }
    } catch (err) {
        console.error(err);
        return { code: -1, message: `Internal Server Error!` };
    }
};

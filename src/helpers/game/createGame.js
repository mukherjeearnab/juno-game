var shortHash = require("short-hash");
const createDeck = require("./createDeck");
const GameDB = require("../../models/game");

const game = {
    id: "",
    creator: "",
    deck: [],
    status: {
        iteration: 0,
        direction: 0,
        gameStatus: 0,
        topCard: "none",
        color: "none",
        next: 0,
    },
    players: [],
};

module.exports = async (player) => {
    // populate game deck
    game.deck = createDeck();

    // create creator / 1st player
    const creator = {
        id: player.id,
        name: player.name,
        cards: [],
        punished: false,
        moves: 0,
    };

    // populate game details
    game.players.push(creator);
    game.creator = creator.id;
    game.id = shortHash(JSON.stringify(game));

    try {
        const doc = await GameDB.create(game);
        console.log("CREATED GAME", doc.id);
        return doc.id;
    } catch (err) {
        console.log("MONGOOSE ERROR", err);
        throw new Error(err.message);
    }
};

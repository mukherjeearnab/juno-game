var shortHash = require("short-hash");
const createDeck = require("./createDeck");

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
    },
    players: [],
};

module.exports = (player) => {
    // populate game deck
    game.deck = createDeck();

    // create creator / 1st player
    const creator = {
        id: player.id,
        name: player.name,
        cards: [],
        punished: false,
    };

    // populate game details
    game.players.push(creator);
    game.creator = creator.id;
    game.id = shortHash(JSON.stringify(game));

    // return game object
    return game;
};

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

module.exports = () => {
    game.deck = createDeck();
    return game;
};

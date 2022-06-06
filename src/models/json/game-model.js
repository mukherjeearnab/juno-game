module.exports = {
    id: String,
    creator: String,
    deck: [String],
    status: {
        iteration: Number,
        direction: Number,
        gameStatus: Number,
        topCard: String,
        color: String,
        nextPlayer: Number,
        next: Number,
    },
    players: [
        {
            id: String,
            name: String,
            cards: [String],
            uno: Boolean,
            moves: Number,
        },
    ],
};

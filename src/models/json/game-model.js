module.exports = {
    id: String,
    creator: String,
    deck: [String],
    status: {
        iteration: Number,
        direction: Number,
        gameStatus: Number,
        topCard: String,
    },
    players: [
        {
            id: String,
            name: String,
            cards: [String],
            punished: Boolean,
        },
    ],
};

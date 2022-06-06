// function to shuffle deck of cards (array)
const Shuffle = (array) => {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
};

// function to select TopCard
const SelectFirstTopCard = (game) => {
    while (true) {
        card = game.deck.shift();
        let cardComponents = card.split("-");

        // if card is not a wild card or action card, break and return card
        if (cardComponents[0] !== "wild" && !isNaN(cardComponents[1])) return card;

        // else add the drawn card back to the deck and shuffle
        game.deck.push(card);
        Shuffle(game.deck);
    }
};

// function to get next player index
const GetNextPlayerIndex = (game, skip) => {
    if (game.status.direction === 1) {
        // if game is in reverse direction
        return (game.status.nextPlayer + (game.players.length - skip)) % game.players.length;
    } else {
        // if game is in forward direction
        return (game.status.nextPlayer + skip) % game.players.length;
    }
};

// function to get player index from player id
const GetPlayerIndexFromID = (playerID, game) => {
    // iteratively find the player's index using their player id
    for (let i = 0; i < game.players.length; i++) {
        if (game.players[i].id === playerID) return i;
    }

    // if player is not found, return -1
    return -1;
};

module.exports = { Shuffle, SelectFirstTopCard, GetNextPlayerIndex, GetPlayerIndexFromID };

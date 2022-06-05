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

module.exports = { Shuffle, SelectFirstTopCard };

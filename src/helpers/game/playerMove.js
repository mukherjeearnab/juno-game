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
            return { code: 3, message: `Player ${player.id} is not eligible for move!` };
        }

        // check if game round is color select or not
        if (game.status.next === 1) {
            return { code: 4, message: "nextPlayer needs to select a new color for top stack!" };
        }

        // check if game round is color select or not
        if (!(player.cardIndex >= 0 && player.cardIndex < game.players[playerIndex].cards.length)) {
            return { code: 5, message: "Invalid card index selected!" };
        }

        // fetch the selected card details
        let selectedCard = game.players[game.status.nextPlayer].cards[player.cardIndex];
        let cardComponents = selectedCard.split("-");
        console.log("CARD COMPONENTS", cardComponents);

        // fetch the top card details
        let topCardComponents = game.status.topCard.split("-");

        // check if it is players first move and verify a valid card is drawn
        if (game.players[game.status.nextPlayer].moves === 0) {
            // check if card is a action or wild card
            if (cardComponents[0] === "wild" || isNaN(cardComponents[1]))
                return { code: 6, message: "First card drawn can't be action card or wild card!" };
        }

        // check if card is acceptable for top card stack
        if (cardComponents[0] !== "wild") {
            // check if card is same color or same number compared to top card
            if (!(cardComponents[0] === topCardComponents[0] || cardComponents[0] === topCardComponents[0]))
                return { code: 7, message: "Selected card can't be accepted for new top card!" };
        }

        // action based on card type (ation or number or wild) [REMEMBER TO ADD CODE TO MOVE TO NEXT PLAYER AFTER COLOR SELECTION]
        if (cardComponents[0] === "wild") {
            if (cardComponents[1] === "none") {
                // set game next move to color change (1)
                game.status.next = 1;
            } else if (cardComponents[1] === "plus4") {
                // set game next move to color change (1)
                game.status.next = 1;

                // add 4 new cards to next players stack
                let nextPlayerIndex = Utils.GetNextPlayerIndex(game, 1);
                for (let i = 0; i < 4; i++) {
                    const card = game.deck.shift();
                    game.players[nextPlayerIndex].cards.push(card);
                }
            } else if (cardComponents[1] === "plus6") {
                // set game next move to color change (1)
                game.status.next = 1;

                // add 6 new cards to next to next players stack
                let nextPlayerIndex = Utils.GetNextPlayerIndex(game, 2);
                for (let i = 0; i < 6; i++) {
                    const card = game.deck.shift();
                    game.players[nextPlayerIndex].cards.push(card);
                }
            }
        } else {
            // if card is a color card
            if (cardComponents[1] === "skip") {
                // since it is skip card, only change next player 2 places
                game.status.nextPlayer = Utils.GetNextPlayerIndex(game, 2);
            } else if (cardComponents[1] === "reverse") {
                // since it is uno reverse, change direction of the game, and set next player to 1 place
                game.status.direction = (game.status.direction + 1) % 2;
                game.status.nextPlayer = Utils.GetNextPlayerIndex(game, 1);
            } else if (cardComponents[1] === "plus2") {
                // add 2 new cards to next players stack
                let nextPlayerIndex = Utils.GetNextPlayerIndex(game, 1);
                for (let i = 0; i < 2; i++) {
                    const card = game.deck.shift();
                    game.players[nextPlayerIndex].cards.push(card);
                }

                // set next player to 1 place
                game.status.nextPlayer = Utils.GetNextPlayerIndex(game, 1);
            } else {
                // for number cards
                // set next player to 1 place
                game.status.nextPlayer = Utils.GetNextPlayerIndex(game, 1);
            }
        }

        // check if it was 2nd last card and uno was declared or not (if not, add 2 new cards from the deck)
        if (game.players[playerIndex].cards.length === 2 && !game.players[playerIndex].uno) {
            // add 2 cards if uno was not declared
            for (let i = 0; i < 2; i++) {
                const card = game.deck.shift();
                game.players[playerIndex].cards.push(card);
            }
        }

        // if uno was declared, set uno flag to false
        if (game.players[playerIndex].uno) game.players[playerIndex].uno = false;

        // remove the card from the players stack
        game.players[playerIndex].cards.splice(player.cardIndex, 1);

        // increment player move count
        game.players[playerIndex].moves += 1;

        // change game status to started (1)
        game.status.iteration += 1;

        // set top card
        game.status.topCard = selectedCard;

        // update game instance in DB
        await GameDB.updateOne({ id: gameID }, game);

        // emit event of new player added
        socket.to(gameID).emit("update", `player move`);

        console.log(`PLAYER ${player.id} has played MOVE on GAME ${gameID}`);

        return { code: 200, message: `Player ${player.id} has played move in Game ${gameID}` };
    } catch (err) {
        console.error(err);
        return { code: -1, message: `Internal Server Error!` };
    }
};

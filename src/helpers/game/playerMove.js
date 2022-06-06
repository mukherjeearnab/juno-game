const GameDB = require("../../models/game");
const Utils = require("./util");

module.exports = async (player, gameID, socket) => {
    try {
        // find the game
        const game = await GameDB.findOne({ id: gameID }).exec();

        // respond 404 if game is null
        if (game === null) {
            throw new Error("Game not found!");
        }

        const playerIndex = Utils.GetPlayerIndexFromID(player.id, game);

        // check if game is not yet started or finished
        if (game.status.gameStatus !== 1) {
            throw new Error("Game not started or is already finished!");
        }

        // check if sending player is eligible
        if (playerIndex !== game.status.nextPlayer) {
            throw new Error(`Player ${player.id} is not eligible for move!`);
        }

        // check if game round is color select or not
        if (game.status.next === 1) {
            throw new Error("nextPlayer needs to select a new color for top stack!");
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
                throw new Error("First card drawn can't be action card or wild card!");
        }

        // check if card is acceptable for top card stack
        if (cardComponents[0] !== "wild") {
            // check if card is same color or same number compared to top card
            if (!(cardComponents[0] === topCardComponents[0] || cardComponents[0] === topCardComponents[0]))
                throw new Error("Selected card can't be accepted for new top card!");
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

        return gameID;
    } catch (err) {
        console.error(err);
        return null;
    }
};

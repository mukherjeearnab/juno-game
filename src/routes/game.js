const express = require("express");

const Game = require("../helpers/game");

const router = new express.Router();

// create new game
router.post("/api/game/create", async (req, res) => {
    // acquire player and creator information
    const player = req.body.player;
    try {
        // create new game with player 1 / creator details
        const gameID = await Game.CreateGame(player);

        res.status(200).send({
            message: "New game created successfully!",
            gameID,
        });
    } catch (err) {
        console.log("ROUTE ERROR (/api/game/create)", err);
        res.status(500).send({ message: "Server Error!" });
    }
});

// join an existing game
// router.post("/api/game/join/:id", async (req, res) => {
//     // acquire player and creator information
//     const player = req.body.player;
//     try {
//         // find the game
//         const game = GameDB.findOne({ id: req.params.id }).exec();
//         // respond 404 if game is null
//         if (game === null) {
//             res.status(404).send({ message: `Game ${req.params.id} Not Found!` });
//         }

//         const gameUpdate = Game.JoinPlayer(player);

//         await GameDB.updateOne({ name: "Jean-Luc Picard" }, { ship: "USS Enterprise" });
//     } catch (err) {
//         console.log("ROUTE ERROR (/api/game/create)", err);
//         res.status(500).send({ message: "Server Error!" });
//     }
// });

module.exports = router;

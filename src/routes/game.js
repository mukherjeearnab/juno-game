const express = require("express");

const Game = require("../helpers/game");
const GameDB = require("../models/game");

const router = new express.Router();

router.post("/api/game/create", async (req, res) => {
    // acquire player and creator information
    const player = req.body.player;
    const game = Game.CreateGame(player);
    try {
        GameDB.create(game, function (err, doc) {
            if (err) {
                console.log("MONGOOSE ERROR", err);
                res.status(500).send({ message: "Database error!" });
            } else {
                console.log("CREATED GAME", doc.id);
                res.status(200).send({
                    message: "New game created successfully!",
                    gameID: doc.id,
                });
            }
        });
    } catch (err) {
        console.log("ROUTE ERROR (/api/game/create)", err);
        res.status(500).send({ message: "Server Error!" });
    }
});

module.exports = router;

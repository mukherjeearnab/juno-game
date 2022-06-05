const express = require("express");
var shortHash = require("short-hash");

const createGame = require("../helpers/createGame");
const Game = require("../models/game");

const router = new express.Router();

router.post("/api/game/create", async (req, res) => {
    // acquire player and creator information
    const player = req.body.player;
    const creator = {
        id: player.id,
        name: player.name,
        cards: [],
        punished: false,
    };

    const game = createGame();

    game.players.push(creator);
    game.creator = creator.id;
    game.id = shortHash(JSON.stringify(game));

    try {
        Game.create(game, function (err, doc) {
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

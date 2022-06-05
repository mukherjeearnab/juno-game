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
router.post("/api/game/join/:id", async (req, res) => {
    // acquire player and game information
    const player = req.body.player;
    const gameID = req.params.id;
    try {
        const reply = await Game.JoinPlayer(player, gameID, req.app.get("socketio"));

        // respond 404 if game is null
        if (reply === null) {
            res.status(404).send({ message: `Game ${gameID} Not Found!` });
        }

        res.status(200).send({ message: `Player ${player.id} joined Game ${gameID} successfully!` });
    } catch (err) {
        console.log("ROUTE ERROR (/api/game/join)", err);
        res.status(500).send({ message: "Server Error!" });
    }
});

// start an existing game
router.post("/api/game/start/:id", async (req, res) => {
    // acquire player and game information
    const player = req.body.player;
    const gameID = req.params.id;
    try {
        const reply = await Game.StartGame(player, gameID, req.app.get("socketio"));

        // respond 404 if game is null
        if (reply === null) {
            res.status(404).send({ message: `Game ${gameID} Not Found!` });
        }

        res.status(200).send({ message: `Game ${gameID} has been successfully started!` });
    } catch (err) {
        console.log("ROUTE ERROR (/api/game/start)", err);
        res.status(500).send({ message: "Server Error!" });
    }
});

// player move
router.post("/api/game/move/:id", async (req, res) => {
    // acquire player and game information
    const player = req.body.player;
    const gameID = req.params.id;
    try {
        const reply = await Game.PlayerMove(player, gameID, req.app.get("socketio"));

        // respond 404 if game is null
        if (reply === null) {
            res.status(404).send({ message: `Game ${gameID} Not Found!` });
        }

        res.status(200).send({ message: `Move started!` });
    } catch (err) {
        console.log("ROUTE ERROR (/api/game/move)", err);
        res.status(500).send({ message: "Server Error!" });
    }
});

module.exports = router;

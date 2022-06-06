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

        // log the game execution reply
        console.log("EXEC REPLY (/api/game/join/)", reply);

        // respond 404 if game is null
        if (reply.code === 0) {
            res.status(404).send({ code: reply.code, message: `Game ${gameID} Not Found!` });
        } else if (reply.code < 2) {
            // else it's game rules error, send 403
            res.status(403).send(reply);
        } else {
            // if everythin is okay, send 200 with success message
            res.status(200).send({ message: `Player ${player.id} joined Game ${gameID} successfully!` });
        }
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
        // Start the game and await for execution result
        const reply = await Game.StartGame(player, gameID, req.app.get("socketio"));

        // log the game execution reply
        console.log("EXEC REPLY (/api/game/start/)", reply);

        // respond 404 if game is null
        if (reply.code === 0) {
            res.status(404).send({ code: reply.code, message: `Game ${gameID} Not Found!` });
        } else if (reply.code < 4) {
            // else it's game rules error, send 403
            res.status(403).send(reply);
        } else {
            // if everythin is okay, send 200 with success message
            res.status(200).send({ message: `Game ${gameID} has been successfully started!` });
        }
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

        // log the game execution reply
        console.log("EXEC REPLY (/api/game/move/)", reply);

        // respond 404 if game is null
        if (reply.code === 0) {
            res.status(404).send({ code: reply.code, message: `Game ${gameID} Not Found!` });
        } else if (reply.code < 9) {
            // else it's game rules error, send 403
            res.status(403).send(reply);
        } else {
            // if everythin is okay, send 200 with success message
            res.status(200).send({ message: `Move started!` });
        }
    } catch (err) {
        console.log("ROUTE ERROR (/api/game/move)", err);
        res.status(500).send({ message: "Server Error!" });
    }
});

// color change
router.post("/api/game/color/:id", async (req, res) => {
    // acquire player and game information
    const player = req.body.player;
    const gameID = req.params.id;
    try {
        const reply = await Game.ColorChange(player, gameID, req.app.get("socketio"));

        // log the game execution reply
        console.log("EXEC REPLY (/api/game/color/)", reply);

        // respond 404 if game is null
        if (reply.code === 0) {
            res.status(404).send({ code: reply.code, message: `Game ${gameID} Not Found!` });
        } else if (reply.code < 6) {
            // else it's game rules error, send 403
            res.status(403).send(reply);
        } else {
            // if everythin is okay, send 200 with success message
            res.status(200).send({ message: reply.message });
        }
    } catch (err) {
        console.log("ROUTE ERROR (/api/game/color)", err);
        res.status(500).send({ message: "Server Error!" });
    }
});

// draw card from the deck
router.post("/api/game/draw/:id", async (req, res) => {
    // acquire player and game information
    const player = req.body.player;
    const gameID = req.params.id;
    try {
        const reply = await Game.DrawCard(player, gameID, req.app.get("socketio"));

        // log the game execution reply
        console.log("EXEC REPLY (/api/game/draw/)", reply);

        // respond 404 if game is null
        if (reply.code === 0) {
            res.status(404).send({ code: reply.code, message: `Game ${gameID} Not Found!` });
        } else if (reply.code < 5) {
            // else it's game rules error, send 403
            res.status(403).send(reply);
        } else {
            // if everythin is okay, send 200 with success message
            res.status(200).send({ message: reply.message });
        }
    } catch (err) {
        console.log("ROUTE ERROR (/api/game/draw)", err);
        res.status(500).send({ message: "Server Error!" });
    }
});

// declare uno
router.post("/api/game/uno/:id", async (req, res) => {
    // acquire player and game information
    const player = req.body.player;
    const gameID = req.params.id;
    try {
        const reply = await Game.UnoOne(player, gameID, req.app.get("socketio"));

        // log the game execution reply
        console.log("EXEC REPLY (/api/game/uno/)", reply);

        // respond 404 if game is null
        if (reply.code === 0) {
            res.status(404).send({ code: reply.code, message: `Game ${gameID} Not Found!` });
        } else if (reply.code < 6) {
            // else it's game rules error, send 403
            res.status(403).send(reply);
        } else {
            // if everythin is okay, send 200 with success message
            res.status(200).send({ message: reply.message });
        }
    } catch (err) {
        console.log("ROUTE ERROR (/api/game/uno)", err);
        res.status(500).send({ message: "Server Error!" });
    }
});

module.exports = router;

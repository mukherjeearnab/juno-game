// import packages
const express = require("express");
const cors = require("cors");

// initialize express app and socker.io
const app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
// add sockerio instance to express app
app.set("socketio", io);

// configure dotenv
require("dotenv").config();

// JSON Middleware
app.use(express.json());

// CORS Middleware
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Load API Routes
require("./routes")(app);

// Start Listening
app.listen(3000, () => console.log("Listening on port 3000."));

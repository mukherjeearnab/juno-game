// import packages and mongoose object
const mongoose = require("mongoose");
require("../db/mongoose");

// import JSON game model schema
const gameJSON = require("./json/game-model");

// create Mongoose schema using JSON game model
const gameSchema = new mongoose.Schema(gameJSON);

// create Mongoose model using the schema
const game = mongoose.model("game", gameSchema);

// export Mongoose model
module.exports = game;

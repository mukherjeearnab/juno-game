// import packages and mongoose object
const mongoose = require("mongoose");
require("../db/mongoose");

// import JSON room model schema
const roomJSON = require("./json/room-model.json");

// create Mongoose schema using JSON room model
const roomSchema = new mongoose.Schema(roomJSON);

// create Mongoose model using the schema
const room = mongoose.model("room", roomSchema);

// export Mongoose model
module.exports = room;

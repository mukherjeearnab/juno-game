// import packages
const mongoose = require("mongoose");

// generate MongoDB connection string
const connectionString = `mongodb://${process.env.MONGODB_URI}`;
console.log("Connecting MongoDB @", connectionString);

// use mongoose to connect to the MongoDB instance
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

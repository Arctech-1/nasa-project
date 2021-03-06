const mongoose = require("mongoose");

require("dotenv").config();
/**
 * Listen to success and error events emitted by mongoose
 */
mongoose.connection.once("open", () => console.log("MongoDB connection ready"));
mongoose.connection.on("error", (err) => console.log("error occured"));

async function mongoConnect() {
  await mongoose.connect(process.env.MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };

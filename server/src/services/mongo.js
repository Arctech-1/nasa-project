const mongoose = require("mongoose");
const MONGO_URL = "mongodb+srv://nasa-api:lnAD12W3sv2P0UOq@nasacluster.5pt24vi.mongodb.net/?retryWrites=true&w=majority";

/**
 * Listen to success and error events emitted by mongoose
 */
mongoose.connection.once("open", () => console.log("MongoDB connection ready"));
mongoose.connection.on("error", (err) => console.error(err));

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };

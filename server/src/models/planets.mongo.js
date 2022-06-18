const mongoose = require("mongoose");
const { Schema } = mongoose;

const planetsSchema = new Schema({
  keplerName: { type: String, required: true },
});

module.exports = mongoose.model("Planet", planetsSchema);

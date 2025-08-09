const mongoose = require("mongoose");

const ObjectSchema = new mongoose.Schema({
  type: { type: String, required: true }, // plant, animal, object
  name: { type: String },
  personality: { type: String },
  mood: { type: String },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ObjectItem", ObjectSchema);

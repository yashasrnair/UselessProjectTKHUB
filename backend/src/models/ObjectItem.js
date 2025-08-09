const mongoose = require("mongoose");

const ObjectItemSchema = new mongoose.Schema({
  type: { type: String, required: true }, // plant, animal, laptop, etc.
  personality: { type: String, default: "random" },
  mood: { type: String, required: true },
  imageUrl: { type: String },
  lastUpdated: { type: Date, default: Date.now },
});

// ✅ Reuse model if already compiled (nodemon safe)
module.exports =
  mongoose.models.ObjectItem || mongoose.model("ObjectItem", ObjectItemSchema);

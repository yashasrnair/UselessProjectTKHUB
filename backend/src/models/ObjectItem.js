// backend/src/models/ObjectItem.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // "User" or "Object"
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ObjectItemSchema = new mongoose.Schema({
  type: { type: String, required: true }, // plant, animal, gadget, etc.
  name: { type: String },                 // user-provided name
  owner: { type: String },                // username who owns this object
  personality: { type: String, default: "random" },
  mood: { type: String },
  messages: { type: [MessageSchema], default: [] },
  tokensUsed: { type: Number, default: 0 }, // approximate tokens used
  imageUrl: { type: String },
  lastUpdated: { type: Date, default: Date.now },
});

// nodemon-safe export
module.exports = mongoose.models.ObjectItem || mongoose.model("ObjectItem", ObjectItemSchema);

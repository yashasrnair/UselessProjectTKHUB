// backend/src/routes/objectRoutes.js
const express = require("express");
const router = express.Router();
const ObjectItem = require("../models/ObjectItem");
const { getGeminiResponse, estimateTokensForText } = require("../utils/geminiClient");

const TOKEN_QUOTA = parseInt(process.env.GEMINI_TOKEN_QUOTA || "10000", 10);

// GET /api/objects?owner=alice
router.get("/", async (req, res) => {
  const { owner, type } = req.query;
  const filter = {};
  if (owner) filter.owner = owner;
  if (type) filter.type = type;
  const objects = await ObjectItem.find(filter).select("-__v");
  res.json(objects);
});

// GET /api/objects/:id
router.get("/:id", async (req, res) => {
  try {
    const obj = await ObjectItem.findById(req.params.id);
    if (!obj) return res.status(404).json({ error: "Object not found" });
    res.json(obj);
  } catch (err) {
    console.error("Get object error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/objects/:id/name  { name: "Potty", owner: "alice" }
router.patch("/:id/name", async (req, res) => {
  try {
    const { name, owner } = req.body;
    const obj = await ObjectItem.findById(req.params.id);
    if (!obj) return res.status(404).json({ error: "Object not found" });
    if (name) obj.name = name;
    if (owner) obj.owner = owner;
    await obj.save();
    res.json(obj);
  } catch (err) {
    console.error("Set name error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/objects/talk/:id  { message: "Hi" }
router.post("/talk/:id", async (req, res) => {
  try {
    const obj = await ObjectItem.findById(req.params.id);
    if (!obj) return res.status(404).json({ error: "Object not found" });

    // Check token quota
    if ((obj.tokensUsed || 0) >= TOKEN_QUOTA) {
      return res.status(403).json({ error: "Token quota exhausted for this object." });
    }

    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });

    // Append user message locally before sending to Gemini
    obj.messages.push({ sender: "User", text: message });

    // Keep the last X messages as context (memory)
    const contextMessages = obj.messages.slice(-8).map(m => `${m.sender}: ${m.text}`).join("\n");
    const prompt = `You are a ${obj.type} with personality "${obj.personality}". Current mood: "${obj.mood}". Conversation so far:\n${contextMessages}\nRespond in-character, witty, succinctly to the last user message.`;

    const reply = await getGeminiResponse(prompt);

    obj.messages.push({ sender: "Object", text: reply });

    const estTokens = estimateTokensForText(prompt + "\n" + reply);
    obj.tokensUsed = (obj.tokensUsed || 0) + estTokens;
    obj.lastUpdated = new Date();
    await obj.save();

    const tokensLeft = Math.max(0, TOKEN_QUOTA - obj.tokensUsed);
    res.json({ reply, tokensUsed: obj.tokensUsed, tokensLeft });
  } catch (err) {
    console.error("Talk route error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

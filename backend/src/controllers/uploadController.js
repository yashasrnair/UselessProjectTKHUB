// backend/src/controllers/uploadController.js
const fs = require("fs");
const ObjectItem = require("../models/ObjectItem");
const { getGeminiResponse, estimateTokensForText } = require("../utils/geminiClient");

exports.uploadImage = async (req, res) => {
  try {
    const { type, userName } = req.body;
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const prompt = `You are a ${type}. Describe your mood in 1-2 funny, emotional sentences with personality. Keep it short and witty.`;
    const reply = await getGeminiResponse(prompt, req.file.path);

    const approxTokens = estimateTokensForText(prompt + "\n" + reply);

    const objectItem = new ObjectItem({
      type,
      mood: reply,
      personality: "random",
      owner: userName || null,
      messages: [{ sender: "Object", text: reply }],
      tokensUsed: approxTokens,
      imageUrl: req.file.path,
    });

    const saved = await objectItem.save();

    res.json({
      _id: saved._id.toString(),
      type: saved.type,
      personality: saved.personality,
      mood: saved.mood,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

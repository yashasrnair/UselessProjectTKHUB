const express = require("express");
const router = express.Router();
const ObjectItem = require("../models/ObjectItem");
const { getGeminiResponse } = require("../utils/geminiClient");

// Get all objects
router.get("/", async (req, res) => {
  const { type } = req.query;
  const filter = type ? { type } : {};
  const objects = await ObjectItem.find(filter);
  res.json(objects);
});

// Get one object
router.get("/:id", async (req, res) => {
  const obj = await ObjectItem.findById(req.params.id);
  if (!obj) return res.status(404).json({ error: "Object not found" });
  res.json(obj);
});

// Talk to an object
router.post("/talk/:id", async (req, res) => {
  try {
    const obj = await ObjectItem.findById(req.params.id);
    if (!obj) return res.status(404).json({ error: "Object not found" });

    const { message } = req.body;
    const prompt = `You are a ${obj.type} with personality "${obj.personality}". 
    Your current mood is "${obj.mood}". Respond to: "${message}" in a fun, witty, emotional way.`;

    const reply = await getGeminiResponse(prompt); // No image path
    res.json({ reply });
  } catch (error) {
    console.error("Talk route error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

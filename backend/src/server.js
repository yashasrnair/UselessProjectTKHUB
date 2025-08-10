// backend/src/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db"); // optional helper if you used it
const cors = require("cors");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");
const objectRoutes = require("./routes/objectRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/upload", uploadRoutes);
app.use("/api/objects", objectRoutes);
// Serve frontend build
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] }));
// Try to connect DB (uses MONGO_URI from env)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

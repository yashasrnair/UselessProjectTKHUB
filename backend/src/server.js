require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const objectRoutes = require("./routes/objectRoutes");

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/upload", uploadRoutes);
app.use("/api/objects", objectRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

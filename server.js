import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import itemsRoutes from "./routes/items.js";
import cartRoutes from "./routes/cart.js";

dotenv.config();

const app = express();
app.use(express.json());

// CORS
const origin = process.env.CORS_ORIGIN || "http://localhost:3000";
app.use(cors({ origin, credentials: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/cart", cartRoutes);

// test
app.get("/api/test", (req, res) => res.send("API OK"));

// connect + listen
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch(err => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });

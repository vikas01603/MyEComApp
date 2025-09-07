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

// ✅ CORS setup for your actual deployed frontend
const origin = process.env.CORS_ORIGIN || "https://ecomapp-frontend-600d.onrender.com";
app.use(
  cors({
    origin,
    credentials: true,
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/cart", cartRoutes);

// test route to check backend
app.get("/api/test", (req, res) => res.send("API OK"));

// optional root route for browser check
app.get("/", (req, res) => res.send("Backend Running ✅"));

// connect to MongoDB and start server
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    const port = process.env.PORT || 5000; // Render injects its own PORT
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });

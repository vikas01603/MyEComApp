import express from "express";
import Item from "../models/Item.js";

const router = express.Router();

// GET /api/items  (frontend calls API.get("/items"))
router.get("/", async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);

    const items = await Item.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch items" });
  }
});

export default router;

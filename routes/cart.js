import express from "express";
import Cart from "../models/cart.js";
import Item from "../models/Item.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user's cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.itemId");
    res.json(cart || { user: req.user._id, items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// Add item to cart (POST /api/cart/add)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    if (!itemId || !quantity) return res.status(400).json({ message: "Missing itemId or quantity" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existing = cart.items.find(i => i.itemId.toString() === itemId);
    if (existing) existing.quantity += Number(quantity);
    else cart.items.push({ itemId, quantity: Number(quantity) });

    await cart.save();
    await cart.populate("items.itemId");
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add item" });
  }
});

// Update quantity (PUT /api/cart/update)
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const idx = cart.items.findIndex(i => i.itemId.toString() === itemId);
    if (idx >= 0) {
      if (Number(quantity) <= 0) cart.items.splice(idx, 1);
      else cart.items[idx].quantity = Number(quantity);
    }
    await cart.save();
    await cart.populate("items.itemId");
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update cart" });
  }
});

// Remove item (DELETE /api/cart/remove/:id)
router.delete("/remove/:id", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i.itemId.toString() !== req.params.id);
    await cart.save();
    await cart.populate("items.itemId");
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove item" });
  }
});

// Clear cart
router.delete("/clear", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

export default router;

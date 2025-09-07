import mongoose from "mongoose";
import dotenv from "dotenv";
import Item from "./models/Item.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const items = [
  { name: "Basic T-Shirt", description: "Comfort cotton", category: "clothing", price: 299, image: "/images/tshirt.jpg" },
  { name: "Running Shoes", description: "Light & fast", category: "shoes", price: 1999, image: "/images/shoes.jpg" },
  { name: "Wireless Mouse", description: "Ergonomic", category: "electronics", price: 799, image: "/images/mouse.jpg" },
  { name: "Smart Watch", description: "Fitness tracking", category: "electronics", price: 2999, image: "/images/watch.jpg" },
  { name: "Jeans", description: "Classic denim", category: "clothing", price: 899, image: "/images/jeans.jpg" }
];


const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for seeding");

    // Clear existing data
    await Item.deleteMany({});
    await User.deleteMany({ email: "test@vikas.com" }).catch(() => {});

    // Insert items
    await Item.insertMany(items);
    console.log("🌱 Items inserted");

    // Create test user
    const hashed = await bcrypt.hash("password123", 10);
    await User.findOneAndUpdate(
      { email: "test@vikas.com" },
      { name: "Vikas Test", email: "test@vikas.com", password: hashed },
      { upsert: true, new: true }
    );
    console.log("👤 Test user created: test@vikas.com / password123");

    mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();

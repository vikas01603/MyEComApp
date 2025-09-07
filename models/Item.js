import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);

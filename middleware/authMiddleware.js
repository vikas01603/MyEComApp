import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // fetch user to attach full user doc (safe)
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "Invalid token (user not found)" });

    req.user = user; // req.user._id is available
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

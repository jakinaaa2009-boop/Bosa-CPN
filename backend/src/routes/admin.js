import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Submission } from "../models/Submission.js";
import { requireAdmin } from "../middleware/auth.js";
import { getJwtSecret } from "../jwtSecret.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }
    const admin = await Admin.findOne({ username: String(username).trim() });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { username: admin.username, role: "admin" },
      getJwtSecret(),
      { expiresIn: "7d" }
    );
    res.json({ token, username: admin.username });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/me", requireAdmin, (req, res) => {
  res.json({ username: req.admin.username });
});

router.get("/users", requireAdmin, async (_req, res) => {
  try {
    const users = await User.find({})
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .lean();
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/users/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
    }
    await Submission.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

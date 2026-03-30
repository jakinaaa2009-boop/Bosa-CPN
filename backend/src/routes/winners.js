import { Router } from "express";
import mongoose from "mongoose";
import { Winner } from "../models/Winner.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const list = await Winner.find().sort({ drawDate: -1 });
    res.json(list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const doc = await Winner.findByIdAndDelete(id);
    if (!doc) {
      return res.status(404).json({ error: "Олдсонгүй" });
    }
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Submission } from "../models/Submission.js";
import { requireAdmin } from "../middleware/auth.js";
import { getJwtSecret } from "../jwtSecret.js";
import { removeStoredReceiptImage } from "../receiptStorage.js";

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

router.get("/stats", requireAdmin, async (_req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalCompanies = await User.countDocuments({ accountType: "company" });
    const totalIndividuals = await User.countDocuments({
      accountType: { $ne: "company" },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const registrationsByDay = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", count: 1, _id: 0 } },
    ]);

    const usersWithAge = await User.find({
      age: { $ne: null, $gte: 0, $lte: 150 },
    })
      .select("age")
      .lean();
    const ageBuckets = [
      { label: "0–17", min: 0, max: 17, count: 0 },
      { label: "18–25", min: 18, max: 25, count: 0 },
      { label: "26–35", min: 26, max: 35, count: 0 },
      { label: "36–50", min: 36, max: 50, count: 0 },
      { label: "51+", min: 51, max: 999, count: 0 },
    ];
    for (const u of usersWithAge) {
      const a = u.age;
      for (const b of ageBuckets) {
        if (a >= b.min && a <= b.max) {
          b.count += 1;
          break;
        }
      }
    }
    const ageDistribution = ageBuckets.map(({ label, count }) => ({ label, count }));

    res.json({
      totalUsers,
      totalCompanies,
      totalIndividuals,
      registrationsByDay,
      ageDistribution,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/users", requireAdmin, async (req, res) => {
  try {
    const { accountType } = req.query;
    const filter = {};
    if (accountType === "company") {
      filter.accountType = "company";
    } else if (accountType === "individual") {
      filter.$or = [
        { accountType: "individual" },
        { accountType: { $exists: false } },
        { accountType: null },
      ];
    }
    const users = await User.find(filter)
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
    const subs = await Submission.find({ userId: user._id })
      .select("receiptImage")
      .lean();
    for (const s of subs) {
      await removeStoredReceiptImage(s.receiptImage);
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

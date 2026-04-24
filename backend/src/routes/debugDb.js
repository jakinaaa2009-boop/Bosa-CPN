import { Router } from "express";
import mongoose from "mongoose";
import { requireAdmin } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Submission } from "../models/Submission.js";
import { Winner } from "../models/Winner.js";

const router = Router();

router.get("/", requireAdmin, async (_req, res) => {
  try {
    const conn = mongoose.connection;
    const dbName = conn?.db?.databaseName || null;
    const collections = conn?.db
      ? (await conn.db.listCollections().toArray()).map((c) => c.name).sort()
      : [];

    const [usersCount, receiptsCount, winnersCount] = await Promise.all([
      User.countDocuments({}),
      Submission.countDocuments({}),
      Winner.countDocuments({}),
    ]);

    res.json({
      database: dbName,
      collections,
      counts: {
        users: usersCount,
        receipts: receiptsCount,
        winners: winnersCount,
      },
    });
  } catch (e) {
    console.error("[debug-db] failed", e);
    res.status(500).json({ error: "debug failed" });
  }
});

export default router;


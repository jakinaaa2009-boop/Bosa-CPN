import { Router } from "express";
import { Submission } from "../models/Submission.js";
import { Winner } from "../models/Winner.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

/** Approved submissions whose phone is not already a winner (optional dedupe). */
async function eligibleApprovedSubmissions() {
  const winners = await Winner.find({}, "phone");
  const phones = new Set(winners.map((w) => w.phone));
  const approved = await Submission.find({ status: "approved" }).lean();
  return approved.filter((s) => !phones.has(s.phone));
}

router.get("/pool", requireAdmin, async (_req, res) => {
  try {
    const pool = await eligibleApprovedSubmissions();
    res.json(
      pool.map((s) => ({
        _id: s._id,
        fullName: s.receiptNumber || s.fullName || s.phone,
        phone: s.phone,
        productName:
          s.totalAmount != null
            ? `${s.totalAmount}₮`
            : s.productName || "",
      }))
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Body: { prizeName: string, submissionIds?: string[] }
 * If submissionIds provided, winner is picked randomly from that subset (must be approved).
 * Otherwise picks from all eligible approved (not yet winning by phone).
 */
router.post("/spin", requireAdmin, async (req, res) => {
  try {
    const { prizeName, submissionIds } = req.body;
    if (!prizeName || typeof prizeName !== "string" || !prizeName.trim()) {
      return res.status(400).json({ error: "prizeName is required" });
    }

    let pool = await eligibleApprovedSubmissions();

    if (Array.isArray(submissionIds) && submissionIds.length > 0) {
      const idSet = new Set(submissionIds.map(String));
      pool = pool.filter((s) => idSet.has(String(s._id)));
    }

    if (pool.length === 0) {
      return res.status(400).json({
        error: "No eligible participants. Approve submissions or adjust selection.",
      });
    }

    const pick = pool[Math.floor(Math.random() * pool.length)];
    const winner = await Winner.create({
      winnerName: pick.receiptNumber || pick.fullName || pick.phone,
      phone: pick.phone,
      productName:
        pick.totalAmount != null
          ? `${pick.totalAmount}₮`
          : pick.productName || "",
      prizeName: prizeName.trim(),
      drawDate: new Date(),
      submissionId: pick._id,
    });

    res.status(201).json(winner);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

import { Router } from "express";
import { Submission } from "../models/Submission.js";
import { Winner } from "../models/Winner.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

function entryWeight(s) {
  const w = Math.max(
    1,
    Math.floor(Number(s.lotteryEntries)) ||
      Math.floor(Number(s.productCount)) ||
      1
  );
  return w;
}

/** Approved submissions whose phone is not already a winner. */
async function eligibleApprovedSubmissions() {
  const winners = await Winner.find({}, "phone");
  const phones = new Set(winners.map((w) => w.phone));
  const approved = await Submission.find({ status: "approved" }).lean();
  return approved.filter((s) => !phones.has(s.phone));
}

/** Weighted random pick: each submission’s chance ∝ lotteryEntries. */
function weightedPick(submissions) {
  if (submissions.length === 0) return null;
  const weights = submissions.map((s) => entryWeight(s));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < submissions.length; i++) {
    r -= weights[i];
    if (r <= 0) return submissions[i];
  }
  return submissions[submissions.length - 1];
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
        productCount: s.productCount ?? 1,
        lotteryEntries: entryWeight(s),
      }))
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Body: { prizeName: string, submissionIds?: string[] }
 * Weighted by lotteryEntries when picking randomly.
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

    const pick = weightedPick(pool);
    if (!pick) {
      return res.status(400).json({ error: "Could not pick winner" });
    }

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

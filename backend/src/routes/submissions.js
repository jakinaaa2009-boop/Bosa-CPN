import { Router } from "express";
import { Submission } from "../models/Submission.js";
import { User } from "../models/User.js";
import { uploadReceipt } from "../multerConfig.js";
import { storeReceiptImage, removeStoredReceiptImage } from "../receiptStorage.js";
import { requireAdmin } from "../middleware/auth.js";
import { requireUser } from "../middleware/userAuth.js";
import {
  normalizeReceiptNumber,
  isValidReceiptNumber,
} from "../receiptUtil.js";

const router = Router();

router.get("/mine", requireUser, async (req, res) => {
  try {
    const list = await Submission.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", requireUser, uploadReceipt.single("receipt"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Receipt image is required" });
    }
    const account = await User.findById(req.user.userId).lean();
    if (!account) {
      return res.status(401).json({ error: "Хэрэглэгч олдсонгүй" });
    }
    const receiptNumber = normalizeReceiptNumber(req.body.receiptNumber);
    if (!receiptNumber) {
      return res.status(400).json({ error: "Баримтын дугаар оруулна уу" });
    }
    if (!isValidReceiptNumber(receiptNumber)) {
      return res.status(400).json({
        error: "Баримтын дугаарын хэлбэр буруу (жишээ: AA00000000)",
      });
    }
    const amountRaw = req.body.totalAmount ?? req.body.amount;
    const totalAmount = parseFloat(String(amountRaw ?? "").replace(/,/g, ""));
    if (Number.isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ error: "Үнийн дүн зөв оруулна уу" });
    }

    const productCountRaw =
      req.body.productCount ?? req.body.product_count ?? "1";
    const productCount = Math.max(
      1,
      Math.floor(parseInt(String(productCountRaw), 10)) || 1
    );

    const dup = await Submission.findOne({ receiptNumber });
    if (dup) {
      return res.status(409).json({
        error: "Энэ баримтын дугаар аль хэдийн бүртгэгдсэн",
      });
    }

    const receiptImage = await storeReceiptImage(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );
    const doc = await Submission.create({
      userId: account._id,
      receiptNumber,
      totalAmount,
      productCount,
      lotteryEntries: productCount,
      fullName: "",
      productName: "",
      phone: account.phone,
      email: (account.email || "").trim(),
      receiptImage,
      status: "pending",
    });
    res.status(201).json({
      message: "Бүртгэл амжилттай илгээгдлээ!",
      submission: doc,
    });
  } catch (e) {
    if (e.message === "Only image files are allowed") {
      return res.status(400).json({ error: e.message });
    }
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }
    const list = await Submission.find(filter).sort({ createdAt: -1 }).lean();
    res.json(list);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, lotteryEntries, productCount } = req.body;
    const updates = {};
    if (status !== undefined) {
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const prev = await Submission.findById(id).select("status").lean();
      if (!prev) return res.status(404).json({ error: "Not found" });
      updates.status = status;
      if (status === "approved") {
        if (prev.status !== "approved") {
          updates.approvedAt = new Date();
        }
      } else {
        updates.approvedAt = null;
      }
    }
    if (lotteryEntries !== undefined) {
      const n = Math.floor(Number(lotteryEntries));
      if (Number.isNaN(n) || n < 1) {
        return res.status(400).json({ error: "Сугалааны эрх 1-ээс багагүй байна" });
      }
      updates.lotteryEntries = n;
    }
    if (productCount !== undefined) {
      const n = Math.floor(Number(productCount));
      if (Number.isNaN(n) || n < 1) {
        return res.status(400).json({ error: "Бүтээгдэхүүний тоо 1-ээс багагүй байна" });
      }
      updates.productCount = n;
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields" });
    }
    const doc = await Submission.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const prev = await Submission.findById(req.params.id).select("status").lean();
    if (!prev) return res.status(404).json({ error: "Not found" });
    const extra = {};
    if (status === "approved") {
      if (prev.status !== "approved") {
        extra.approvedAt = new Date();
      }
    } else {
      extra.approvedAt = null;
    }
    const doc = await Submission.findByIdAndUpdate(
      req.params.id,
      { status, ...extra },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const doc = await Submission.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: "Not found" });
    await removeStoredReceiptImage(doc.receiptImage);
    await Submission.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

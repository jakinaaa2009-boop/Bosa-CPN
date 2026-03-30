import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { requireUser } from "../middleware/userAuth.js";
import { normalizePhone } from "../phoneUtil.js";
import { getJwtSecret } from "../jwtSecret.js";

const router = Router();

function signUserToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      phone: user.phone,
      role: "user",
    },
    getJwtSecret(),
    { expiresIn: "30d" }
  );
}

function publicUser(u) {
  return {
    phone: u.phone,
    email: u.email || "",
    age: u.age ?? null,
  };
}

router.post("/register", async (req, res) => {
  try {
    const { phone, password, email, age } = req.body;
    const p = normalizePhone(phone);
    if (!p) {
      return res.status(400).json({ error: "Утасны дугаар шаардлагатай" });
    }
    if (!password || String(password).length < 6) {
      return res.status(400).json({ error: "Нууц үг хамгийн багадаа 6 тэмдэгт" });
    }
    const exists = await User.findOne({ phone: p });
    if (exists) {
      return res.status(409).json({ error: "Энэ дугаар бүртгэлтэй байна" });
    }
    const passwordHash = await bcrypt.hash(String(password), 10);
    let ageNum = null;
    if (age !== undefined && age !== null && String(age).trim() !== "") {
      ageNum = parseInt(String(age), 10);
      if (Number.isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
        return res.status(400).json({ error: "Нас буруу байна" });
      }
    }
    const user = await User.create({
      phone: p,
      passwordHash,
      email: String(email || "").trim(),
      age: ageNum,
    });
    const token = signUserToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ error: "Энэ дугаар бүртгэлтэй байна" });
    }
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    const p = normalizePhone(phone);
    if (!p || !password) {
      return res.status(400).json({ error: "Утас болон нууц үг оруулна уу" });
    }
    const user = await User.findOne({ phone: p });
    if (!user) {
      return res.status(401).json({ error: "Дугаар эсвэл нууц үг буруу" });
    }
    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Дугаар эсвэл нууц үг буруу" });
    }
    const token = signUserToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/me", requireUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).lean();
    if (!user) {
      return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
    }
    res.json(publicUser(user));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

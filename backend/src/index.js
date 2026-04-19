import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./db.js";
import submissionsRouter from "./routes/submissions.js";
import adminRouter from "./routes/admin.js";
import winnersRouter from "./routes/winners.js";
import drawRouter from "./routes/draw.js";
import userRouter from "./routes/user.js";
import { Admin } from "./models/Admin.js";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const uploadsPath = path.join(__dirname, "..", "uploads");

/** Browsers send Origin without a trailing slash; env values must match exactly. */
function normalizeCorsOrigin(url) {
  if (!url || typeof url !== "string") return "";
  return url.trim().replace(/\/+$/, "");
}

const corsRaw = process.env.CORS_ORIGIN || "http://localhost:3000";
const corsAllowed = corsRaw
  .split(",")
  .map((s) => normalizeCorsOrigin(s))
  .filter(Boolean);
const corsAllowVercel =
  process.env.CORS_ALLOW_VERCEL === "1" ||
  process.env.CORS_ALLOW_VERCEL === "true";

/** Allow http://localhost:* and http://127.0.0.1:* (local Next.js hitting deployed API). */
const corsAllowLocalhost =
  process.env.CORS_ALLOW_LOCALHOST === "1" ||
  process.env.CORS_ALLOW_LOCALHOST === "true";

function isLocalDevOrigin(o) {
  try {
    const u = new URL(o);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    if (u.hostname !== "localhost" && u.hostname !== "127.0.0.1") return false;
    return true;
  } catch {
    return false;
  }
}

function corsOriginValidator(origin, callback) {
  if (!origin) {
    callback(null, true);
    return;
  }
  const o = normalizeCorsOrigin(origin);
  if (corsAllowed.includes(o)) {
    callback(null, true);
    return;
  }
  if (corsAllowLocalhost && isLocalDevOrigin(o)) {
    callback(null, true);
    return;
  }
  if (
    corsAllowVercel &&
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(o)
  ) {
    callback(null, true);
    return;
  }
  console.warn("[cors] blocked origin:", origin, "allowed:", corsAllowed);
  callback(null, false);
}

app.use(
  cors({
    origin: corsOriginValidator,
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(uploadsPath));

app.use("/api/user", userRouter);
app.use("/api/submissions", submissionsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/winners", winnersRouter);
app.use("/api/draw", drawRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

async function ensureDefaultAdmin() {
  const username =
    process.env.ADMIN_USERNAME?.trim() || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const exists = await Admin.findOne({ username });
  if (!exists) {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ username, passwordHash });
    console.log(`Default admin created: ${username}`);
  }
}

async function main() {
  await connectDb();
  await ensureDefaultAdmin();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API listening on 0.0.0.0:${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

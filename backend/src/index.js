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

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:3000";
app.use(
  cors({
    origin: corsOrigin.split(",").map((s) => s.trim()),
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
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

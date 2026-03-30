import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDb } from "./db.js";
import { Admin } from "./models/Admin.js";
import mongoose from "mongoose";

const username = process.argv[2] || process.env.ADMIN_USERNAME || "admin";
const password = process.argv[3] || process.env.ADMIN_PASSWORD || "admin123";

async function run() {
  await connectDb();
  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.findOneAndUpdate(
    { username },
    { username, passwordHash },
    { upsert: true, new: true }
  );
  console.log(`Admin upserted: ${username}`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

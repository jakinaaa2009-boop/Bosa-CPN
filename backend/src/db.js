import mongoose from "mongoose";

const DEFAULT_URI = "mongodb://127.0.0.1:27017/lucky_draw";

export async function connectDb() {
  const uri = process.env.MONGODB_URI?.trim() || DEFAULT_URI;
  if (!process.env.MONGODB_URI?.trim()) {
    console.warn(
      `[db] MONGODB_URI is not set; using default ${DEFAULT_URI} (set MONGODB_URI in backend/.env for production)`
    );
  }
  await mongoose.connect(uri);
  console.log("MongoDB connected");
}

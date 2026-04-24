import mongoose from "mongoose";

const REQUIRED_DB_NAME = "Bosa-CPN";

function normalizeMongoUri(raw) {
  return String(raw || "").trim();
}

function uriHasDbName(uri) {
  // Works for mongodb:// and mongodb+srv://
  // If pathname is empty or "/" → no explicit db in URI.
  try {
    const u = new URL(uri);
    const p = (u.pathname || "").replace(/^\/+/, "");
    return Boolean(p);
  } catch {
    // If URL parsing fails, assume user provided a full connection string; don't guess.
    return true;
  }
}

export async function connectDb() {
  const uri = normalizeMongoUri(process.env.MONGODB_URI);
  if (!uri) {
    const msg = "[db] MONGODB_URI is required (set it in Railway/Vercel/local .env)";
    console.error(msg);
    throw new Error(msg);
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const opts = {};
    if (!uriHasDbName(uri)) {
      // Railway Mongo URLs sometimes omit the DB name.
      // Force the correct DB so models read the migrated data.
      opts.dbName = REQUIRED_DB_NAME;
      console.warn(
        `[db] MONGODB_URI has no database name; forcing dbName=${REQUIRED_DB_NAME}`
      );
    }
    await mongoose.connect(uri, opts);
    console.log(`[db] MongoDB connected (db=${mongoose.connection.db?.databaseName || "unknown"})`);
  } catch (e) {
    console.error("[db] MongoDB connection failed", e);
    throw e;
  }
}

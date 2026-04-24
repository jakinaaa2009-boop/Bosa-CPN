import mongoose from "mongoose";

/**
 * Serverless-safe Mongo connection caching.
 * - Reuses a single connection across hot reloads / Lambda invocations.
 * - Avoids creating a new connection for every request.
 */

let globalCache = globalThis.__mongoose;
if (!globalCache) {
  globalCache = globalThis.__mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB using Mongoose, with caching.
 * @returns {Promise<typeof mongoose>}
 */
export async function connectDB() {
  if (globalCache.conn) return globalCache.conn;

  if (!process.env.MONGODB_URI) {
    const msg = "[mongodb] MONGODB_URI is not set";
    console.error(msg);
    throw new Error(msg);
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        bufferCommands: false,
      })
      .then((m) => m)
      .catch((err) => {
        globalCache.promise = null;
        console.error("[mongodb] Failed to connect", err);
        throw err;
      });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}


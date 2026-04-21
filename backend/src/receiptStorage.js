import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "uploads");

/** Cloudflare R2 (S3-compatible): set all vars to store public HTTPS URLs in MongoDB. */
export function isR2Configured() {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME || process.env.R2_BUCKET;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;
  const endpoint = process.env.R2_ENDPOINT || process.env.R2_ACCOUNT_ID;
  return Boolean(accessKeyId && secretAccessKey && bucket && publicBaseUrl && endpoint);
}

function getR2Endpoint() {
  if (process.env.R2_ENDPOINT) return String(process.env.R2_ENDPOINT).replace(/\/+$/, "");
  const id = process.env.R2_ACCOUNT_ID;
  if (!id) throw new Error("R2_ACCOUNT_ID or R2_ENDPOINT is required for R2");
  return `https://${id}.r2.cloudflarestorage.com`;
}

function getR2BucketName() {
  const b = process.env.R2_BUCKET_NAME || process.env.R2_BUCKET;
  if (!b) throw new Error("R2_BUCKET_NAME (or R2_BUCKET) is required for R2");
  return b;
}

function getR2PublicBaseUrl() {
  const base = process.env.R2_PUBLIC_BASE_URL;
  if (!base) throw new Error("R2_PUBLIC_BASE_URL is required for R2");
  return String(base).replace(/\/+$/, "");
}

function ensureR2Configured() {
  if (!isR2Configured()) {
    throw new Error(
      "Receipt storage is configured for Cloudflare R2 only. Set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME (or R2_BUCKET), R2_PUBLIC_BASE_URL, and R2_ENDPOINT (or R2_ACCOUNT_ID)."
    );
  }
}

let s3 = null;
function getS3() {
  if (s3) return s3;
  s3 = new S3Client({
    region: "auto",
    endpoint: getR2Endpoint(),
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  return s3;
}

/**
 * Saves receipt bytes; returns value stored in Submission.receiptImage (full HTTPS URL or /uploads/...).
 */
export async function storeReceiptImage(buffer, mimetype, originalName) {
  ensureR2Configured();
  const ext = path.extname(originalName || "") || ".jpg";
  const key = `receipts/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  await getS3().send(
    new PutObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
      Body: buffer,
      ContentType: mimetype || "image/jpeg",
    })
  );
  return `${getR2PublicBaseUrl()}/${key}`;
}

/** Remove file from R2 or local uploads folder. No-op for external URLs. */
export async function removeStoredReceiptImage(stored) {
  if (!stored || typeof stored !== "string") return;

  if (stored.startsWith("/uploads/")) {
    const fsPath = path.join(uploadDir, path.basename(stored));
    try {
      await fs.unlink(fsPath);
    } catch {
      /* ignore */
    }
    return;
  }

  if (!stored.startsWith("http")) return;
  if (!isR2Configured()) return;

  const baseUrl = getR2PublicBaseUrl();
  if (!stored.startsWith(baseUrl)) return;

  let key;
  try {
    key = new URL(stored).pathname.replace(/^\//, "");
  } catch {
    return;
  }
  try {
    await getS3().send(
      new DeleteObjectCommand({
        Bucket: getR2BucketName(),
        Key: key,
      })
    );
  } catch (e) {
    console.error("[receiptStorage] R2 delete failed", e);
  }
}

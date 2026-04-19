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
  return Boolean(
    process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME &&
      process.env.R2_PUBLIC_BASE_URL &&
      (process.env.R2_ENDPOINT || process.env.R2_ACCOUNT_ID)
  );
}

function getR2Endpoint() {
  if (process.env.R2_ENDPOINT) return process.env.R2_ENDPOINT;
  const id = process.env.R2_ACCOUNT_ID;
  if (!id) throw new Error("R2_ACCOUNT_ID or R2_ENDPOINT is required for R2");
  return `https://${id}.r2.cloudflarestorage.com`;
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
  if (isR2Configured()) {
    const ext = path.extname(originalName || "") || ".jpg";
    const key = `receipts/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    await getS3().send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimetype || "image/jpeg",
      })
    );
    const base = String(process.env.R2_PUBLIC_BASE_URL).replace(/\/+$/, "");
    return `${base}/${key}`;
  }

  await fs.mkdir(uploadDir, { recursive: true });
  const ext = path.extname(originalName || "") || ".jpg";
  const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const fsPath = path.join(uploadDir, name);
  await fs.writeFile(fsPath, buffer);
  return `/uploads/${name}`;
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

  const baseUrl = String(process.env.R2_PUBLIC_BASE_URL).replace(/\/+$/, "");
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
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      })
    );
  } catch (e) {
    console.error("[receiptStorage] R2 delete failed", e);
  }
}

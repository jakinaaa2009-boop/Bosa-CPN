import multer from "multer";

/**
 * Memory storage: bytes are written to Cloudflare R2 (or local uploads) in the route handler.
 */
const storage = multer.memoryStorage();

function fileFilter(_req, file, cb) {
  if (file.mimetype?.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"));
}

export const uploadReceipt = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter,
});

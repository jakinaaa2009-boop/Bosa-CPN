/** Latin 2 letters + 8 digits, e.g. AA00000000 */
const RECEIPT_NO_RE = /^[A-Za-z]{2}\d{8}$/;

export function normalizeReceiptNumber(raw) {
  return String(raw ?? "").trim().toUpperCase();
}

export function isValidReceiptNumber(normalized) {
  return RECEIPT_NO_RE.test(normalized);
}

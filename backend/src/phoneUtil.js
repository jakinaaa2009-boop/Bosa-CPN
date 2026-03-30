/**
 * One canonical form for lookup: digits only, without Mongolia country code 976 when present.
 * Examples: "99119999", "8 911 99 99" → "89119999" if 8-prefix used; "97699119999" → "99119999"
 */
export function normalizePhone(raw) {
  let d = String(raw ?? "").replace(/\D/g, "");
  if (!d) return "";
  if (d.length >= 11 && d.startsWith("976")) {
    d = d.slice(3);
  } else if (d.length === 10 && d.startsWith("976")) {
    d = d.slice(3);
  }
  return d;
}

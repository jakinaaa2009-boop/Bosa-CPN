/**
 * Approval **day** filter for lucky draw (баталгаажсан өдөр).
 * Uses fixed offset (default Mongolia UTC+8) for calendar-day boundaries.
 */

/** Env: e.g. "+08:00". Default Ulaanbaatar. */
export function getApprovalTzOffsetString() {
  const raw = process.env.DRAW_APPROVAL_TZ_OFFSET || "+08:00";
  if (/^[+-]\d{2}:\d{2}$/.test(raw)) return raw;
  return "+08:00";
}

/**
 * Inclusive window for one calendar day in the configured offset.
 * @param {string} dateStr YYYY-MM-DD
 * @returns {{ start: Date, end: Date } | null}
 */
export function buildApprovalDayWindow(dateStr) {
  if (!dateStr) return null;
  const d = String(dateStr).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;

  const off = getApprovalTzOffsetString();
  const start = new Date(`${d}T00:00:00.000${off}`);
  const end = new Date(`${d}T23:59:59.999${off}`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }
  return { start, end };
}

function first(v) {
  if (v == null) return null;
  if (Array.isArray(v)) return v[0] != null ? String(v[0]) : null;
  return String(v);
}

/**
 * @param {Record<string, unknown>} q - req.query
 * @returns {{ ok: true, window: null } | { ok: true, window: { start: Date, end: Date } } | { ok: false, error: string }}
 */
export function parseApprovalWindowFromQuery(q) {
  const date = first(q.date ?? q.approvalDate);
  if (date == null || date === "") {
    return { ok: true, window: null };
  }
  const w = buildApprovalDayWindow(String(date));
  if (!w) return { ok: false, error: "Invalid date (use YYYY-MM-DD)" };
  return { ok: true, window: w };
}

/**
 * @param {unknown} body - req.body.approvalFilter
 */
export function parseApprovalWindowFromBody(body) {
  if (body == null || typeof body !== "object") {
    return { ok: true, window: null };
  }
  const o = /** @type {Record<string, unknown>} */ (body);
  const date = o.date ?? o.approvalDate;
  if (date == null || date === "") {
    return { ok: true, window: null };
  }
  const w = buildApprovalDayWindow(String(date));
  if (!w) return { ok: false, error: "approvalFilter.date must be YYYY-MM-DD" };
  return { ok: true, window: w };
}

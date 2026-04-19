/**
 * Parses approval time window for lucky draw (баталгаажсан цагийн завсар).
 * Uses ISO datetime with fixed offset (default Mongolia UTC+8).
 */

function pad2(n) {
  return String(n).padStart(2, "0");
}

/** Env: e.g. "+08:00" or "+08:30". Default Ulaanbaatar. */
export function getApprovalTzOffsetString() {
  const raw = process.env.DRAW_APPROVAL_TZ_OFFSET || "+08:00";
  if (/^[+-]\d{2}:\d{2}$/.test(raw)) return raw;
  return "+08:00";
}

/**
 * @param {string} dateStr YYYY-MM-DD
 * @param {string} fromStr HH:mm
 * @param {string} toStr HH:mm
 * @returns {{ start: Date, end: Date } | null}
 */
export function buildApprovalWindow(dateStr, fromStr, toStr) {
  if (!dateStr || !fromStr || !toStr) return null;
  const d = String(dateStr).trim();
  const from = String(fromStr).trim();
  const to = String(toStr).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
  if (!/^\d{1,2}:\d{2}$/.test(from) || !/^\d{1,2}:\d{2}$/.test(to)) return null;

  const [fh, fm] = from.split(":").map((x) => parseInt(x, 10));
  const [th, tm] = to.split(":").map((x) => parseInt(x, 10));
  if (
    [fh, fm, th, tm].some((n) => Number.isNaN(n)) ||
    fh < 0 ||
    fh > 23 ||
    fm < 0 ||
    fm > 59 ||
    th < 0 ||
    th > 23 ||
    tm < 0 ||
    tm > 59
  ) {
    return null;
  }

  const off = getApprovalTzOffsetString();
  const fromNorm = `${pad2(fh)}:${pad2(fm)}`;
  const toNorm = `${pad2(th)}:${pad2(tm)}`;

  const start = new Date(`${d}T${fromNorm}:00${off}`);
  const endSameDay = new Date(`${d}T${toNorm}:00${off}`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(endSameDay.getTime())) {
    return null;
  }

  let end = endSameDay;
  if (end <= start) {
    end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  }
  return { start, end };
}

/**
 * @param {Record<string, unknown>} q - req.query
 * @returns {{ ok: true, window: null } | { ok: true, window: { start: Date, end: Date } } | { ok: false, error: string }}
 */
function first(v) {
  if (v == null) return null;
  if (Array.isArray(v)) return v[0] != null ? String(v[0]) : null;
  return String(v);
}

export function parseApprovalWindowFromQuery(q) {
  const date = first(q.date ?? q.approvalDate);
  const from = first(q.from ?? q.approvalFrom);
  const to = first(q.to ?? q.approvalTo);
  if (date == null && from == null && to == null) {
    return { ok: true, window: null };
  }
  if (date == null || from == null || to == null) {
    return {
      ok: false,
      error: "date, from, and to are all required for time filter",
    };
  }
  const w = buildApprovalWindow(String(date), String(from), String(to));
  if (!w) return { ok: false, error: "Invalid approval time window" };
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
  const from = o.from ?? o.approvalFrom;
  const to = o.to ?? o.approvalTo;
  if (date == null && from == null && to == null) {
    return { ok: true, window: null };
  }
  if (date == null || from == null || to == null) {
    return {
      ok: false,
      error: "approvalFilter requires date, from, and to",
    };
  }
  const w = buildApprovalWindow(String(date), String(from), String(to));
  if (!w) return { ok: false, error: "Invalid approval time window" };
  return { ok: true, window: w };
}

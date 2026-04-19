/**
 * Approval date-range filter for lucky draw (баталгаажсан огнооны завсар).
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

/**
 * Inclusive range: start of startDate through end of endDate (same TZ).
 * @param {string} startDateStr YYYY-MM-DD
 * @param {string} endDateStr YYYY-MM-DD
 * @returns {{ start: Date, end: Date } | null}
 */
export function buildApprovalDateRangeWindow(startDateStr, endDateStr) {
  const a = String(startDateStr ?? "").trim();
  const b = String(endDateStr ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a) || !/^\d{4}-\d{2}-\d{2}$/.test(b)) {
    return null;
  }
  if (a > b) return null;

  const startW = buildApprovalDayWindow(a);
  const endW = buildApprovalDayWindow(b);
  if (!startW || !endW) return null;
  return { start: startW.start, end: endW.end };
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
  const startDate = first(q.startDate ?? q.fromDate ?? q.dateFrom);
  const endDate = first(q.endDate ?? q.toDate ?? q.dateTo);
  const legacy = first(q.date ?? q.approvalDate);

  if (
    (startDate == null || startDate === "") &&
    (endDate == null || endDate === "") &&
    (legacy == null || legacy === "")
  ) {
    return { ok: true, window: null };
  }

  if (legacy != null && legacy !== "" && (startDate == null || startDate === "") && (endDate == null || endDate === "")) {
    const w = buildApprovalDayWindow(String(legacy));
    if (!w) return { ok: false, error: "Invalid date (use YYYY-MM-DD)" };
    return { ok: true, window: w };
  }

  if (
    startDate == null ||
    startDate === "" ||
    endDate == null ||
    endDate === ""
  ) {
    return {
      ok: false,
      error: "startDate and endDate are both required for date range (YYYY-MM-DD)",
    };
  }

  const w = buildApprovalDateRangeWindow(String(startDate), String(endDate));
  if (!w) {
    return {
      ok: false,
      error: "Invalid date range (use YYYY-MM-DD, startDate <= endDate)",
    };
  }
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
  const startDate = o.startDate ?? o.fromDate ?? o.dateFrom;
  const endDate = o.endDate ?? o.toDate ?? o.dateTo;
  const legacy = o.date ?? o.approvalDate;

  if (
    (startDate == null || startDate === "") &&
    (endDate == null || endDate === "") &&
    (legacy == null || legacy === "")
  ) {
    return { ok: true, window: null };
  }

  if (
    legacy != null &&
    legacy !== "" &&
    (startDate == null || startDate === "") &&
    (endDate == null || endDate === "")
  ) {
    const w = buildApprovalDayWindow(String(legacy));
    if (!w) return { ok: false, error: "approvalFilter.date must be YYYY-MM-DD" };
    return { ok: true, window: w };
  }

  if (
    startDate == null ||
    startDate === "" ||
    endDate == null ||
    endDate === ""
  ) {
    return {
      ok: false,
      error: "approvalFilter requires both startDate and endDate (YYYY-MM-DD)",
    };
  }

  const w = buildApprovalDateRangeWindow(String(startDate), String(endDate));
  if (!w) {
    return {
      ok: false,
      error: "Invalid approvalFilter date range (startDate <= endDate)",
    };
  }
  return { ok: true, window: w };
}

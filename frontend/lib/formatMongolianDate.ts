/** Gregorian dates in Mongolian (mn-MN locale often falls back to English on Windows). */

const MN_MONTHS = [
  "нэгдүгээр",
  "хоёрдугаар",
  "гуравдугаар",
  "дөрөвдүгээр",
  "тавдугаар",
  "зургадугаар",
  "долдугаар",
  "наймдугаар",
  "есдүгээр",
  "аравдугаар",
  "арван нэгдүгээр",
  "арван хоёрдугаар",
] as const;

function capitalizeMn(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** e.g. 2026 оны Гуравдугаар сарын 30 */
export function formatMongolianDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = d.getMonth();
  const day = d.getDate();
  const monthName = MN_MONTHS[m];
  if (!monthName) return iso;
  return `${y} оны ${capitalizeMn(monthName)} сарын ${day}`;
}

/** e.g. 2026 оны Гуравдугаар сарын 30, 09:46 (24 цагийн формат) */
export function formatMongolianDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = d.getMonth();
  const day = d.getDate();
  const monthName = MN_MONTHS[m];
  if (!monthName) return iso;
  const datePart = `${y} оны ${capitalizeMn(monthName)} сарын ${day}`;
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${datePart}, ${h}:${min}`;
}

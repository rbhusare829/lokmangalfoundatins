const DEVANAGARI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

// Only swaps the digits, so free text like an admin-typed issue number
// ("12", "12-A") keeps its other characters.
export function toMarathiNumeral(n) {
  return String(n).replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[d]);
}

export function localNumber(n, lang) {
  return lang === "mr" ? toMarathiNumeral(n) : String(n);
}

// DATEONLY values arrive as "YYYY-MM-DD"; new Date("YYYY-MM-DD") parses that
// as UTC midnight, which shows as the previous day west of UTC. Build a
// local date instead.
export function parseDateOnly(value) {
  const [y, m, d] = String(value).split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Week of the month a date falls in: days 1–7 are week 1, 8–14 week 2, …
export function weekOfMonth(value) {
  return Math.ceil(parseDateOnly(value).getDate() / 7);
}

// "26 September 2026" / "२६ सप्टेंबर, २०२६" (the mr-IN locale switches to
// Devanagari digits on its own).
export function formatDate(value, lang, options = { day: "numeric", month: "long", year: "numeric" }) {
  if (!value) return "";
  return new Intl.DateTimeFormat(lang === "mr" ? "mr-IN" : "en-IN", options).format(parseDateOnly(value));
}

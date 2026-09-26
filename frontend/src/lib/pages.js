// Canonical list of page slugs shared between the two languages.
// path: '' means the home page (root of each language).
export const PAGE_SLUGS = [
  "",
  "about",
  "about/team",
  "contact",
  "contribute",
  "gallery",
  "projects",
  "jalsandharan-project",
  "lokmangal-annapurna-yojana",
  "vidyadaan-yojana",
  "samudayik-vivah-sohala",
  "events",
  "blogs",
  "blogs/saptahik",
  "privacy-policy",
];

export function pathFor(lang, slug) {
  const base = lang === "mr" ? "/mr" : "";
  if (!slug) return base || "/";
  return `${base}/${slug}`;
}

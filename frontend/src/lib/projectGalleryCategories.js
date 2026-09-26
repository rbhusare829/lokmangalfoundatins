// The Gallery's category values predate the project detail page and don't
// derive cleanly from a project's slug (e.g. "annapoorna" vs. the project
// slug's "annapurna" spelling), so the two are mapped explicitly rather than
// guessed via substring matching. Shared by ProjectDetail (which project's
// photos to show) and Gallery (which project's video to show for a category).
export const PROJECT_GALLERY_CATEGORY = {
  "lokmangal-annapurna-yojana": "annapoorna",
  "jalsandharan-project": "jalsandharan",
  "vidyadaan-yojana": "vidyadaan",
  "samudayik-vivah-sohala": "vivah",
  "lokmangal-sanjeevani-medical": "sanjeevani",
  "mahila-din": "mahila",
  "lokmangal-sahitya-puraskar": "sahitya",
  "lokmangal-shikshak-ratna-puraskar": "shikshak-ratna",
  "bhajan-bharud-spardha": "bhajan-bharud",
  "balsanskar-shibir": "balsanskar",
  "mahaarogya-shibir": "mahaarogya",
  "divyang-shibir": "divyang",
  "mofat-sarvarog-nidan-shibir": "sarvarog",
  "killa-bandhani-spardha": "killa",
  "dandiya-utsav": "dandiya",
};

export const CATEGORY_TO_PROJECT_SLUG = Object.fromEntries(
  Object.entries(PROJECT_GALLERY_CATEGORY).map(([slug, category]) => [category, slug])
);

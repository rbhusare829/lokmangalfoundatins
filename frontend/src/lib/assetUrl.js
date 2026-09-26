// Resolves image/PDF paths (as used in the i18n content files, e.g. "slider/foo.jpg")
// to their bundled Vite URLs. Keeps i18n data free of import statements.
const files = import.meta.glob("../assets/images/**/*.{png,jpg,jpeg,svg,webp,gif,pdf}", {
  eager: true,
  import: "default",
});

export function asset(relativePath) {
  const key = `../assets/images/${relativePath}`;
  const mod = files[key];
  if (!mod) {
    console.warn(`Asset not found: ${relativePath}`);
    return "";
  }
  return mod;
}

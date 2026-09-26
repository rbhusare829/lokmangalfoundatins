import { Link } from "react-router-dom";
import { useLanguage } from "../lib/LanguageContext.jsx";

export default function NotFound() {
  const { lang, path } = useLanguage();

  return (
    <section className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-3xl font-extrabold text-brand-green-primary">404</h1>
      <p className="mt-3 text-secondary-text">
        {lang === "mr" ? "हे पान सापडले नाही." : "Sorry, we couldn't find that page."}
      </p>
      <Link
        to={path("")}
        className="mt-6 rounded-full bg-brand-orange-accent px-6 py-2.5 text-sm font-bold text-orange-btn-text hover:bg-[#D97A14] hover:text-white"
      >
        {lang === "mr" ? "मुख्य पृष्ठावर जा" : "Back to Home"}
      </Link>
    </section>
  );
}

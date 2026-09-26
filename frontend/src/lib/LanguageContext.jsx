import { createContext, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { en } from "../i18n/en.js";
import { mr } from "../i18n/mr.js";
import { pathFor } from "./pages.js";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const location = useLocation();
  const lang = location.pathname.startsWith("/mr") ? "mr" : "en";
  const t = lang === "mr" ? mr : en;

  const value = useMemo(() => {
    // strip the /mr prefix (if any) to get the slug, then rebuild in the target language
    const slug = location.pathname.replace(/^\/mr/, "").replace(/^\//, "");
    return {
      lang,
      t,
      path: (targetSlug) => pathFor(lang, targetSlug),
      otherLangPath: pathFor(lang === "mr" ? "en" : "mr", slug),
    };
  }, [lang, t, location.pathname]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

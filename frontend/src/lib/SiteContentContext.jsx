import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "./api.js";
import { useLanguage } from "./LanguageContext.jsx";

const SiteContentContext = createContext(null);

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState(null);

  const reload = useCallback(() => {
    api
      .get("/content")
      .then((res) => setContent(res.data))
      .catch(() => setContent({}));
  }, []);

  useEffect(reload, [reload]);

  return <SiteContentContext.Provider value={{ content, reload }}>{children}</SiteContentContext.Provider>;
}

// Admin-editable text for `key`, in the current language. Falls back to
// `undefined` while loading or if that key has no admin content yet —
// callers should merge it with the original static copy, e.g.
// `useSiteContent("home") ?? t.home`, so the page always has something to
// render even before the CMS content loads or if a key is missing.
export function useSiteContent(key) {
  const ctx = useContext(SiteContentContext);
  const { lang } = useLanguage();
  if (!ctx) throw new Error("useSiteContent must be used within SiteContentProvider");
  return ctx.content?.[key]?.[lang];
}

// Admin-only: read the raw {en, mr} pair for a key, plus a reload trigger to
// call after saving so every consumer picks up the fresh content.
export function useSiteContentAdmin() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteContentAdmin must be used within SiteContentProvider");
  return ctx;
}

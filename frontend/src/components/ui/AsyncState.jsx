import { useLanguage } from "../../lib/LanguageContext.jsx";

export function LoadingState() {
  const { t } = useLanguage();
  return <div className="py-20 text-center text-secondary-text">{t.common.loading}</div>;
}

export function ErrorState() {
  const { t } = useLanguage();
  return <div className="py-20 text-center text-red-600">{t.common.loadError}</div>;
}

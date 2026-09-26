import { useLanguage } from "../lib/LanguageContext.jsx";
import { useSiteContent } from "../lib/SiteContentContext.jsx";
import PageBanner from "../components/ui/PageBanner.jsx";

function List({ items }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-secondary-text">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicy() {
  const { t } = useLanguage();
  const p = useSiteContent("privacy") ?? t.pages.privacy;

  return (
    <>
      <PageBanner title={p.title} />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <p className="text-sm leading-relaxed text-secondary-text">{p.intro}</p>
          <List items={p.infoUse} />

          <h3 className="mt-8 font-bold text-brand-green-primary">{p.donationsTitle}</h3>
          <List items={p.donations} />

          <h3 className="mt-8 font-bold text-brand-green-primary">{p.securityTitle}</h3>
          <List items={p.security} />

          <h3 className="mt-8 font-bold text-brand-green-primary">{p.updatesTitle}</h3>
          <List items={p.updates} />
        </div>
      </section>
    </>
  );
}

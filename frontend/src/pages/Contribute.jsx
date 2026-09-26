import { Heart } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";
import { useSiteContent } from "../lib/SiteContentContext.jsx";
import PageBanner from "../components/ui/PageBanner.jsx";

export default function Contribute() {
  const { t, path } = useLanguage();
  const c = useSiteContent("contribute") ?? t.pages.contribute;
  const site = useSiteContent("siteInfo") ?? t.common;

  const projectLinks = [
    { label: t.projectsMenu.annapoorna, slug: "lokmangal-annapurna-yojana" },
    { label: t.projectsMenu.jalsandharan, slug: "jalsandharan-project" },
    { label: t.projectsMenu.lotus, slug: "vidyadaan-yojana" },
    { label: t.projectsMenu.vivah, slug: "samudayik-vivah-sohala" },
  ];

  return (
    <>
      <PageBanner title={c.title} />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-extrabold text-brand-green-primary sm:text-3xl">{c.introTitle}</h2>
          <p className="mt-4 text-sm leading-relaxed text-secondary-text">{c.introText}</p>
          <a
            href={site.donateUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-orange-accent px-8 py-3 text-sm font-bold text-orange-btn-text hover:bg-[#D97A14] hover:text-white"
          >
            <Heart size={16} /> {c.donateCta}
          </a>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-5 px-4 sm:grid-cols-2">
          {projectLinks.map((p) => (
            <a
              key={p.slug}
              href={site.donateUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl border border-light-green-tint bg-card-bg px-5 py-4 text-sm font-semibold text-brand-green-primary shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:border-brand-orange-accent"
            >
              {p.label}
              <Heart size={16} className="text-brand-orange-accent" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

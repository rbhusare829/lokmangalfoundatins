import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext.jsx";
import { useSiteContent } from "../../lib/SiteContentContext.jsx";
import { asset } from "../../lib/assetUrl.js";
import SocialIcons from "./SocialIcons.jsx";

export default function Footer() {
  const { t, path } = useLanguage();
  const h = useSiteContent("home") ?? t.home;
  const site = useSiteContent("siteInfo") ?? t.common;
  const footerContent = useSiteContent("footer") ?? t.footer;

  const projectLinks = [
    { label: t.projectsMenu.annapoorna, slug: "lokmangal-annapurna-yojana" },
    { label: t.projectsMenu.jalsandharan, slug: "jalsandharan-project" },
    { label: t.projectsMenu.lotus, slug: "vidyadaan-yojana" },
    { label: t.projectsMenu.vivah, slug: "samudayik-vivah-sohala" },
  ];

  const quickLinks = [
    { label: t.nav.about, slug: "about" },
    { label: t.nav.team, slug: "about/team" },
    { label: t.nav.projects, slug: "projects" },
    { label: t.nav.gallery, slug: "gallery" },
    { label: t.nav.contribute, slug: "contribute" },
    { label: t.nav.blogs, slug: "blogs" },
    { label: t.nav.saptahik, slug: "blogs/saptahik" },
    { label: t.nav.contact, slug: "contact" },
    { label: t.footer.privacyPolicy, slug: "privacy-policy" },
  ];

  return (
    <footer>
      <div
        className="border-b-4 border-brand-orange-accent bg-cover bg-center py-10"
        style={{
          backgroundImage: `linear-gradient(rgba(20,67,42,0.55), rgba(20,67,42,0.65)), url(${asset("background/donor-bg.jpg")})`,
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <h4 className="text-lg font-bold text-white">{h.calloutTitle}</h4>
          <Link
            to={path("about#volunteer")}
            className="rounded-full bg-brand-orange-accent px-6 py-2.5 text-sm font-bold text-orange-btn-text hover:bg-[#D97A14] hover:text-white"
          >
            {h.becomeVolunteer}
          </Link>
        </div>
      </div>

      <div className="bg-brand-green-primary py-14 text-footer-text">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h4 className="mb-4 text-base font-bold text-white">{t.footer.ourProjects}</h4>
            <ul className="space-y-2 text-sm">
              {projectLinks.map((l) => (
                <li key={l.slug}>
                  <Link to={path(l.slug)} className="text-footer-text/90 hover:text-brand-orange-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-base font-bold text-white">{t.footer.quickLinks}</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((l) => (
                <li key={l.slug}>
                  <Link to={path(l.slug)} className="text-footer-text/90 hover:text-brand-orange-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-base font-bold text-white">{t.footer.getInTouch}</h4>
            <ul className="space-y-3 text-sm text-footer-text/90">
              <li className="flex gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-orange-accent" />
                <span>
                  <strong className="text-white">{t.footer.addressLabel}</strong> {site.address}
                </span>
              </li>
              <li className="flex gap-2">
                <Phone size={16} className="mt-0.5 shrink-0 text-brand-orange-accent" />
                <span>
                  <strong className="text-white">{t.footer.phoneLabel}</strong> {site.phoneDisplay}
                </span>
              </li>
              <li className="flex gap-2">
                <Mail size={16} className="mt-0.5 shrink-0 text-brand-orange-accent" />
                <span>
                  <strong className="text-white">{t.footer.emailLabel}</strong> {site.email}
                </span>
              </li>
            </ul>
            <SocialIcons className="mt-4" />
          </div>
        </div>
      </div>

      <div className="bg-[#0E301E] py-4 text-center text-xs text-footer-muted">{footerContent.copyright}</div>
    </footer>
  );
}

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Heart, Menu, X } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext.jsx";
import { useSiteContent } from "../../lib/SiteContentContext.jsx";
import { asset } from "../../lib/assetUrl.js";

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-semibold transition-colors ${
    isActive ? "text-brand-orange-accent" : "text-brand-green-primary hover:text-brand-orange-accent"
  }`;

function LangSwitch({ className = "inline-flex" }) {
  const { lang, otherLangPath } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = lang === "mr" ? "मराठी" : "English";

  return (
    <div
      className={`relative ${className}`}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full bg-light-green-tint px-3.5 py-1.5 text-[13px] font-semibold text-brand-green-primary"
      >
        {current} <ChevronDown size={13} className={open ? "rotate-180" : ""} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-10 mt-2 min-w-[120px] overflow-hidden rounded-lg border-t-[3px] border-brand-orange-accent bg-white shadow-xl"
          >
            <li>
              <Link
                to={lang === "en" ? "#" : otherLangPath}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 text-left text-sm ${
                  lang === "en" ? "font-bold text-brand-green-primary" : "text-main-text hover:bg-light-green-tint"
                }`}
              >
                English
              </Link>
            </li>
            <li>
              <Link
                to={lang === "mr" ? "#" : otherLangPath}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 text-left text-sm ${
                  lang === "mr" ? "font-bold text-brand-green-primary" : "text-main-text hover:bg-light-green-tint"
                }`}
              >
                मराठी
              </Link>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// A top-level link that also opens a submenu on hover/focus (About, Blogs).
function NavDropdown({ to, label, items }) {
  return (
    <div className="group relative">
      <NavLink to={to} className={(state) => `${navLinkClass(state)} inline-flex items-center gap-1`}>
        {label}
        <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
      </NavLink>
      <div className="invisible absolute left-0 top-full z-20 pt-2 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <ul className="min-w-[230px] overflow-hidden rounded-lg border-t-[3px] border-brand-orange-accent bg-white py-1 shadow-xl">
          {items.map(([itemTo, itemLabel]) => (
            <li key={itemTo}>
              <NavLink
                to={itemTo}
                end
                onClick={(e) => e.currentTarget.blur()}
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-light-green-tint/60 text-brand-orange-accent"
                      : "text-brand-green-primary hover:bg-light-green-tint/60 hover:text-brand-orange-accent"
                  }`
                }
              >
                {itemLabel}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { t, path } = useLanguage();
  const site = useSiteContent("siteInfo") ?? t.common;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-light-green-tint bg-white shadow-[0_4px_20px_rgba(20,67,42,0.08)]">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4">
        <Link to={path("")} className="shrink-0">
          <img src={asset("logo/lokmangal-logo.png")} alt="Lokmangal Foundation" className="h-9 w-auto sm:h-12" />
        </Link>

        <nav className="hidden xl:flex xl:items-center xl:gap-1">
          <NavLink to={path("")} end className={navLinkClass}>
            {t.nav.home}
          </NavLink>

          <NavDropdown
            to={path("about")}
            label={t.nav.about}
            items={[
              [path("about"), t.nav.aboutFoundation],
              [path("about/team"), t.nav.team],
            ]}
          />

          <NavLink to={path("projects")} className={navLinkClass}>
            {t.nav.projects}
          </NavLink>

          <NavLink to={path("gallery")} className={navLinkClass}>
            {t.nav.gallery}
          </NavLink>
          <NavLink to={path("contribute")} className={navLinkClass}>
            {t.nav.contribute}
          </NavLink>
          <NavDropdown
            to={path("blogs")}
            label={t.nav.blogs}
            items={[
              [path("blogs"), t.nav.ourBlogs],
              [path("blogs/saptahik"), t.nav.saptahik],
            ]}
          />
          <NavLink to={path("events")} className={navLinkClass}>
            {t.nav.events}
          </NavLink>
          <NavLink to={path("contact")} className={navLinkClass}>
            {t.nav.contact}
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitch />
          <a
            href={site.donateUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-brand-orange-accent px-5 py-2.5 text-sm font-bold text-orange-btn-text shadow-[0_4px_12px_rgba(234,139,34,0.3)] transition hover:-translate-y-0.5 hover:bg-[#D97A14] hover:text-white sm:inline-flex"
          >
            <Heart size={16} /> {t.common.donate}
          </a>
          <button
            aria-label="Toggle Menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green-primary text-white xl:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t-2 border-light-green-tint bg-white xl:hidden"
          >
            <ul className="py-2">
              <li>
                <Link
                  to={path("")}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-b border-light-green-tint px-5 py-3.5 text-[15px] font-semibold text-brand-green-primary"
                >
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  to={path("about")}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-b border-light-green-tint px-5 py-3.5 text-[15px] font-semibold text-brand-green-primary"
                >
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  to={path("about/team")}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 border-b border-light-green-tint bg-[#FAF8F5] py-3 pl-9 pr-5 text-sm font-semibold text-brand-green-primary"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-accent" /> {t.nav.team}
                </Link>
              </li>
              {[
                ["projects", t.nav.projects],
                ["gallery", t.nav.gallery],
                ["contribute", t.nav.contribute],
              ].map(([slug, label]) => (
                <li key={slug}>
                  <Link
                    to={path(slug)}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between border-b border-light-green-tint px-5 py-3.5 text-[15px] font-semibold text-brand-green-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={path("blogs")}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-b border-light-green-tint px-5 py-3.5 text-[15px] font-semibold text-brand-green-primary"
                >
                  {t.nav.blogs}
                </Link>
              </li>
              <li>
                <Link
                  to={path("blogs/saptahik")}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 border-b border-light-green-tint bg-[#FAF8F5] py-3 pl-9 pr-5 text-sm font-semibold text-brand-green-primary"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-orange-accent" /> {t.nav.saptahik}
                </Link>
              </li>
              <li>
                <Link
                  to={path("events")}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-b border-light-green-tint px-5 py-3.5 text-[15px] font-semibold text-brand-green-primary"
                >
                  {t.nav.events}
                </Link>
              </li>
              <li>
                <Link
                  to={path("contact")}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-b border-light-green-tint px-5 py-3.5 text-[15px] font-semibold text-brand-green-primary"
                >
                  {t.nav.contact}
                </Link>
              </li>
              <li className="flex justify-center px-5 pb-2 pt-4">
                <a
                  href={site.donateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full bg-brand-orange-accent px-6 py-3 text-[15px] font-bold text-orange-btn-text"
                >
                  <Heart size={16} /> {t.common.donateNow}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

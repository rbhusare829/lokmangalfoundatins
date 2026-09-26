import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, HandHeart, Users2, X, ZoomIn } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";
import { useSiteContent } from "../lib/SiteContentContext.jsx";
import { useApi } from "../lib/useApi.js";
import PageBanner from "../components/ui/PageBanner.jsx";
import { LoadingState, ErrorState } from "../components/ui/AsyncState.jsx";

const DEVANAGARI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
function toMarathiNumeral(n) {
  return String(n)
    .split("")
    .map((d) => DEVANAGARI_DIGITS[Number(d)] ?? d)
    .join("");
}

function memberText(member, lang) {
  return {
    name: lang === "mr" ? member.nameMr || member.name : member.name,
    role: lang === "mr" ? member.roleMr : member.roleEn,
  };
}

function PhotoPlaceholder() {
  return (
    <div className="flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-light-green-tint to-light-orange-tint">
      <Users2 size={48} className="text-brand-green-primary/40" />
    </div>
  );
}

// The photos are usually designed 4:5 cards with the name already printed on
// them, so they're shown whole (never cropped to a circle); the caption below
// repeats the name/role in the page's language.
function MemberCard({ member, lang, featured, className, onOpen }) {
  const { name, role } = memberText(member, lang);
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className={className}
    >
      <button type="button" onClick={onOpen} className="group block w-full text-center focus:outline-none">
        <div
          className={`relative overflow-hidden rounded-2xl bg-white ring-1 ring-[#E8E3D7] transition duration-300 group-hover:-translate-y-1.5 group-hover:ring-brand-orange-accent/60 group-focus-visible:ring-2 group-focus-visible:ring-brand-orange-accent ${
            featured
              ? "shadow-[0_14px_36px_rgba(20,67,42,0.14)] group-hover:shadow-[0_22px_48px_rgba(20,67,42,0.22)]"
              : "shadow-[0_8px_24px_rgba(20,67,42,0.10)] group-hover:shadow-[0_16px_36px_rgba(20,67,42,0.18)]"
          }`}
        >
          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={`${name}, ${role}`}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <PhotoPlaceholder />
          )}
          <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-green-primary opacity-0 shadow-md transition duration-300 group-hover:opacity-100">
            <ZoomIn size={16} />
          </span>
        </div>
        <p
          className={`mt-4 font-extrabold leading-snug text-brand-green-primary ${
            featured ? "text-base sm:text-lg" : "text-sm sm:text-base"
          }`}
        >
          {name}
        </p>
        <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-brand-orange-accent sm:text-sm">{role}</p>
      </button>
    </motion.li>
  );
}

function GroupHeading({ title, count }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <h2 className="shrink-0 text-xl font-extrabold text-brand-green-primary sm:text-2xl">{title}</h2>
      <span className="rounded-full bg-light-orange-tint px-2.5 py-0.5 text-xs font-extrabold text-brand-orange-accent">
        {count}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-[#DCD5C4] to-transparent" />
    </div>
  );
}

function Lightbox({ members, index, lang, onClose, onNav }) {
  const member = members[index];
  const { name, role } = memberText(member, lang);
  const num = (n) => (lang === "mr" ? toMarathiNumeral(n) : String(n));

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, onNav]);

  const navButton =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white hover:text-brand-green-primary";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={name}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 px-14 py-6 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={lang === "mr" ? "बंद करा" : "Close"}
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white hover:text-brand-green-primary"
      >
        <X size={22} />
      </button>
      {members.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNav(-1);
            }}
            aria-label={lang === "mr" ? "मागील" : "Previous"}
            className={`${navButton} left-2 sm:left-6`}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNav(1);
            }}
            aria-label={lang === "mr" ? "पुढील" : "Next"}
            className={`${navButton} right-2 sm:right-6`}
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}
      <motion.figure
        key={member.id}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full flex-col items-center"
      >
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={`${name}, ${role}`}
            className="max-h-[calc(100vh-9rem)] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
          />
        ) : (
          <div className="w-64 overflow-hidden rounded-2xl">
            <PhotoPlaceholder />
          </div>
        )}
        <figcaption className="mt-4 text-center text-white">
          <p className="text-lg font-extrabold">{name}</p>
          <p className="text-sm text-white/70">
            {role} · {num(index + 1)}/{num(members.length)}
          </p>
        </figcaption>
      </motion.figure>
    </motion.div>
  );
}

export default function Team() {
  const { t, lang, path } = useLanguage();
  const cms = useSiteContent("team") ?? {};
  const tx = (key) => cms[key] ?? t.pages.team[key];
  const num = (n) => (lang === "mr" ? toMarathiNumeral(n) : String(n));

  const { data, error, loading } = useApi("/team");
  const officeBearers = useMemo(() => (data ?? []).filter((m) => m.category !== "Member"), [data]);
  const members = useMemo(() => (data ?? []).filter((m) => m.category === "Member"), [data]);
  // Lightbox walks through everyone in on-page order.
  const ordered = useMemo(() => [...officeBearers, ...members], [officeBearers, members]);
  const [active, setActive] = useState(null);

  return (
    <>
      <PageBanner title={tx("title")} />

      <nav aria-label="Breadcrumb" className="border-b border-[#ECE7DA] bg-white">
        <ol className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 text-xs font-semibold text-secondary-text sm:text-sm">
          <li>
            <Link to={path("")} className="transition hover:text-brand-orange-accent">
              {t.nav.home}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={14} />
          </li>
          <li>
            <Link to={path("about")} className="transition hover:text-brand-orange-accent">
              {t.nav.about}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={14} />
          </li>
          <li aria-current="page" className="text-brand-green-primary">
            {tx("title")}
          </li>
        </ol>
      </nav>

      {/* Intro */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] to-white py-12 sm:py-16">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-orange-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-brand-green-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-green-primary">
            <Users2 size={14} className="text-brand-orange-accent" /> {tx("badge")}
          </span>
          <h2 className="mt-4 text-2xl font-extrabold leading-tight text-brand-green-primary sm:text-3xl md:text-4xl">
            {tx("subtitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-secondary-text sm:text-base">
            {tx("intro")}
          </p>
          {data && data.length > 0 && (
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {[
                [officeBearers.length, tx("officeBearersTitle")],
                [members.length, tx("membersTitle")],
              ]
                .filter(([count]) => count > 0)
                .map(([count, label]) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E8E3D7] bg-white px-4 py-2 text-sm font-semibold text-secondary-text shadow-xs"
                  >
                    <span className="text-lg font-extrabold text-brand-orange-accent">{num(count)}</span> {label}
                  </span>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Office bearers, then members */}
      <section className="bg-white pb-8">
        <div className="mx-auto max-w-7xl px-4">
          {loading && <LoadingState />}
          {error && <ErrorState />}

          {officeBearers.length > 0 && (
            <div>
              <GroupHeading title={tx("officeBearersTitle")} count={num(officeBearers.length)} />
              <ul className="flex flex-wrap justify-center gap-5 sm:gap-8">
                {officeBearers.map((m, i) => (
                  <MemberCard
                    key={m.id}
                    member={m}
                    lang={lang}
                    featured
                    onOpen={() => setActive(i)}
                    className="w-[calc(50%-0.625rem)] sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]"
                  />
                ))}
              </ul>
            </div>
          )}

          {members.length > 0 && (
            <div className={officeBearers.length > 0 ? "mt-16" : ""}>
              <GroupHeading title={tx("membersTitle")} count={num(members.length)} />
              <ul className="flex flex-wrap justify-center gap-5 sm:gap-6">
                {members.map((m, i) => (
                  <MemberCard
                    key={m.id}
                    member={m}
                    lang={lang}
                    onOpen={() => setActive(officeBearers.length + i)}
                    className="w-[calc(50%-0.625rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1.2rem)]"
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Call to action */}
      <section className="px-4 pb-16 pt-10 sm:pb-20">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green-primary to-brand-green-medium px-6 py-10 text-center shadow-xl sm:px-12 sm:py-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-orange-accent/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-4 ring-white/10">
              <HandHeart size={26} className="text-brand-orange-accent" />
            </span>
            <h3 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">{tx("ctaTitle")}</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">{tx("ctaText")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to={path("about#volunteer")}
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange-accent px-7 py-3 text-sm font-bold text-orange-btn-text shadow-[0_4px_16px_rgba(234,139,34,0.35)] transition hover:-translate-y-0.5 hover:bg-[#D97A14] hover:text-white"
              >
                {tx("ctaButton")} <ArrowRight size={16} />
              </Link>
              <Link
                to={path("about")}
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/70 px-7 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-brand-green-primary"
              >
                <ChevronLeft size={16} /> {t.nav.aboutFoundation}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {active !== null && ordered[active] && (
          <Lightbox
            members={ordered}
            index={active}
            lang={lang}
            onClose={() => setActive(null)}
            onNav={(dir) => setActive((i) => (i + dir + ordered.length) % ordered.length)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

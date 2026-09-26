import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Landmark,
  Building2,
  Trophy,
  Heart,
  Quote,
  Sparkles,
  Award,
  Images,
  Maximize2,
  X,
} from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";
import { useSiteContent } from "../lib/SiteContentContext.jsx";
import { useApi } from "../lib/useApi.js";
import { asset } from "../lib/assetUrl.js";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import CountUp from "../components/ui/CountUp.jsx";
import FeaturedProjectCard from "../components/ui/FeaturedProjectCard.jsx";
import { FEATURED_CARDS } from "../lib/projectCatalog.js";
import { aboutData } from "../data/aboutContent.js";

const awardIcons = { GraduationCap, BookOpen, Landmark, Building2, Trophy };

// Split a heading so its last `accentWords` words can be colored as the accent.
function splitTitle(title = "", accentWords = 1) {
  const words = title.trim().split(" ");
  return { pre: words.slice(0, -accentWords).join(" "), accent: words.slice(-accentWords).join(" ") };
}

const DEVANAGARI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
function toMarathiNumeral(n) {
  return String(n)
    .split("")
    .map((d) => DEVANAGARI_DIGITS[Number(d)] ?? d)
    .join("");
}

function prettifyCategory(category = "") {
  return category.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// The hero photos are very wide (1920x840), so on a phone bg-cover shows only
// a narrow vertical strip of each one -- by default the middle, which misses
// the subject (e.g. just the wall beside the face). Horizontal focus point per
// photo; anything not listed (a new slide from the CMS) stays centered. Has
// little effect on desktop, where nearly the full width is visible anyway.
const HERO_FOCUS_X = {
  "slider/annapoorna-yojana.jpg": "80%",
  "slider/vidyadaan-yojana.jpg": "58%",
  "slider/jalsandharan-project.jpg": "45%",
};

function Hero({ slides, readMoreLabel, projectsLabel, projectsHref }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  const slide = slides[index];

  return (
    <section className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url(${asset(slide.image)})`,
            backgroundPosition: `${HERO_FOCUS_X[slide.image] ?? "50%"} center`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:justify-center sm:pb-0">
        <motion.div
          key={`content-${index}`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl"
        >
          <h1 className="text-2xl font-extrabold text-white drop-shadow sm:text-4xl">{slide.title}</h1>
          <p className="mt-3 text-sm text-white/90 drop-shadow sm:mt-4">{slide.text}</p>
          <div className="mt-6 flex gap-3">
            <Link
              to={slide.link}
              className="rounded-full bg-brand-orange-accent px-6 py-2.5 text-sm font-bold text-orange-btn-text hover:bg-[#D97A14] hover:text-white"
            >
              {readMoreLabel}
            </Link>
            <a
              href={projectsHref}
              className="rounded-full border-2 border-white px-6 py-2.5 text-sm font-bold text-white hover:bg-white hover:text-brand-green-primary"
            >
              {projectsLabel}
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-brand-orange-accent" : "w-2 bg-white/60"}`}
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { t, lang, path } = useLanguage();
  const h = useSiteContent("home") ?? t.home;
  const eventsScrollRef = useRef(null);

  const scrollEvents = (dir) => {
    const el = eventsScrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const atStart = el.scrollLeft <= 4;
    const atEnd = el.scrollLeft >= max - 4;
    if (dir < 0 && atStart) {
      el.scrollTo({ left: max, behavior: "smooth" });
    } else if (dir > 0 && atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.9, 420), behavior: "smooth" });
    }
  };

  const { data: apiProjects } = useApi("/projects");
  const { data: apiEvents } = useApi("/events");
  const { data: apiTestimonials } = useApi("/testimonials");
  const { data: apiGallery } = useApi("/gallery");

  // Skip photos whose file failed to load
  const [brokenImageIds, setBrokenImageIds] = useState(() => new Set());
  const allAlbums = useMemo(() => {
    if (!apiGallery) return [];
    const valid = apiGallery.filter((img) => !brokenImageIds.has(img.id));
    const grouped = {};
    for (const img of valid) {
      if (!grouped[img.category]) grouped[img.category] = [];
      grouped[img.category].push(img);
    }
    const order = [
      "vivah",
      "annapoorna",
      "jalsandharan",
      "vidyadaan",
      "mahaarogya",
      "divyang",
      "sarvarog",
      "sanjeevani",
      "mahila",
      "sahitya",
      "shikshak-ratna",
      "killa",
      "dandiya",
      "bhajan-bharud",
      "balsanskar",
    ];
    const keys = Object.keys(grouped).sort((a, b) => {
      const idxA = order.indexOf(a);
      const idxB = order.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return keys.map((catKey) => {
      const photos = grouped[catKey];
      return {
        key: catKey,
        title: t.galleryCategories?.[catKey] ?? prettifyCategory(catKey),
        coverPhoto: photos[0],
        count: photos.length,
      };
    });
  }, [apiGallery, brokenImageIds, t]);

  // Duplicate for seamless infinite loop ticker
  const displayAlbums = useMemo(() => {
    if (allAlbums.length === 0) return [];
    if (allAlbums.length < 8) {
      return [...allAlbums, ...allAlbums, ...allAlbums, ...allAlbums];
    }
    return [...allAlbums, ...allAlbums];
  }, [allAlbums]);

  const galleryScrollRef = useRef(null);
  const isGalleryHovered = useRef(false);

  // Auto-scroll to the left continuously (smooth 60fps ticker)
  useEffect(() => {
    const el = galleryScrollRef.current;
    if (!el || displayAlbums.length === 0) return;
    let animId;
    let lastTime = performance.now();
    // Keep the position as a float: the browser rounds scrollLeft to whole
    // pixels, so on 120Hz+ screens the ~0.4px step per frame was rounded away
    // and the strip never moved (and on 60Hz it ran at 60px/s, not 45).
    let pos = el.scrollLeft;
    const scrollStep = (currentTime) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      if (!isGalleryHovered.current && el) {
        // Pick up a manual swipe / arrow-button scroll
        if (Math.abs(el.scrollLeft - pos) > 1) pos = el.scrollLeft;
        const speed = 0.045; // pixels per ms (~45px/sec)
        pos += delta * speed;
        // Width of one copy of the album list. Not scrollWidth / 2: that also
        // counts the side padding, which made every loop jump by a few px.
        const period = el.children[displayAlbums.length / 2].offsetLeft - el.children[0].offsetLeft;
        if (period > 0 && pos >= period) {
          pos -= period;
        } else if (period > 0 && pos <= 0) {
          pos += period;
        }
        el.scrollLeft = pos;
      }
      animId = requestAnimationFrame(scrollStep);
    };
    animId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animId);
  }, [displayAlbums.length]);

  const scrollGallery = (direction) => {
    const el = galleryScrollRef.current;
    if (!el) return;
    isGalleryHovered.current = true;
    const distance = Math.min(el.clientWidth * 0.75, 450);
    el.scrollBy({ left: direction * distance, behavior: "smooth" });
    setTimeout(() => {
      isGalleryHovered.current = false;
    }, 1500);
  };

  // Keys added with the new Home design aren't in older CMS content yet.
  const tx = (key) => h[key] ?? t.home[key];
  const aboutSec = (useSiteContent("about") ?? {}).aboutFoundationSection ?? aboutData[lang].aboutFoundationSection;
  const welcomeTitle = splitTitle(h.welcomeTitle, 2);
  const projectsTitle = { pre: h.projectsTitle.split(" ")[0], accent: h.projectsTitle.split(" ").slice(1).join(" ") };
  // WhatsApp-status-style auto-advance: one testimonial at a time, 5s each,
  // paused while the visitor is hovering/touching so they can finish reading.
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonialsPausedRef = useRef(false);
  const testimonialsCount = apiTestimonials?.length ?? 0;

  useEffect(() => {
    if (testimonialsCount < 2) return;
    const id = setInterval(() => {
      if (!testimonialsPausedRef.current) {
        setTestimonialIndex((i) => (i + 1) % testimonialsCount);
      }
    }, 5000);
    return () => clearInterval(id);
  }, [testimonialsCount]);

  return (
    <>
      <Hero
        slides={h.hero}
        readMoreLabel={t.common.readMore}
        projectsLabel={h.projectsTitle}
        projectsHref="#our-projects"
      />

      {/* Welcome: who we are, from the About page's own introduction */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F7F4] via-white to-[#FAF8F5] py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-green-medium/30 bg-brand-green-primary/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-green-primary">
              <Sparkles size={14} className="text-brand-orange-accent" />
              {tx("introBadge")}
            </span>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight text-brand-green-primary sm:text-4xl">
              {welcomeTitle.pre} <span className="text-brand-orange-accent">{welcomeTitle.accent}</span>
            </h2>
            <p className="mt-3 text-sm font-semibold text-brand-green-medium sm:text-base">{h.welcomeText}</p>
            <p className="mt-5 text-sm leading-relaxed text-secondary-text sm:text-base">{aboutSec.paragraphs[0]}</p>

            {aboutSec.meta && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                {aboutSec.meta.map((m) => (
                  <div key={m.label} className="rounded-xl border border-light-green-tint bg-white px-4 py-3 shadow-2xs">
                    <span className="block text-[11px] font-bold uppercase tracking-wide text-secondary-text">{m.label}</span>
                    <span className="mt-0.5 block text-xs font-extrabold text-brand-green-primary sm:text-sm">{m.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to={path("about")}
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange-accent px-6 py-2.5 text-sm font-bold text-orange-btn-text shadow-[0_4px_12px_rgba(234,139,34,0.3)] transition hover:bg-[#D97A14] hover:text-white"
              >
                {t.common.readMore} <ArrowRight size={16} />
              </Link>
              <a
                href="#our-projects"
                className="inline-flex items-center rounded-full border-2 border-brand-green-primary px-6 py-2.5 text-sm font-bold text-brand-green-primary transition hover:bg-brand-green-primary hover:text-white"
              >
                {h.projectsTitle}
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl pb-10 lg:max-w-none">
            <img
              src={asset("gallery/lokmangal-samudayik-vivah/lokmangal-samudayik-vivah-03.jpg")}
              alt=""
              className="h-64 w-full rounded-3xl object-cover shadow-[0_20px_45px_rgba(20,67,42,0.18)] sm:h-96"
            />
            <img
              src={asset("gallery/lokmangal-vidyadaan-yojana/lokmangal-vidyadaan-yojana-03.jpg")}
              alt=""
              className="absolute -bottom-2 -left-2 h-32 w-44 rounded-2xl border-4 border-white object-cover shadow-xl sm:-left-6 sm:h-44 sm:w-60"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="bg-cover bg-center py-16"
        style={{
          backgroundImage: `linear-gradient(rgba(20,67,42,0.88), rgba(20,67,42,0.88)), url(${asset("background/counter-bg.jpg")})`,
        }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle pre={h.statsTitle.split(" ").slice(0, -1).join(" ")} accent={h.statsTitle.split(" ").slice(-1).join(" ")} subtitle={h.statsSubtitle} light />
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {h.stats.map((s) => (
              <div
                key={s.label}
                className="group relative overflow-hidden rounded-2xl bg-card-bg p-6 text-center shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(0,0,0,0.35)]"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 ${
                    s.tint === "orange" ? "bg-brand-orange-accent" : "bg-brand-green-medium"
                  }`}
                />
                <div
                  className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${
                    s.tint === "orange" ? "bg-light-orange-tint" : "bg-light-green-tint"
                  }`}
                >
                  <img src={asset(`icons/${s.icon}`)} alt="" className="h-7 w-7" />
                </div>
                <div className="text-2xl font-extrabold text-brand-green-primary sm:text-3xl">
                  <CountUp value={s.number} />
                </div>
                <div className="mt-1 text-xs font-medium text-secondary-text">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects: the four flagship initiatives, then a directory of the rest */}
      <section id="our-projects" className="scroll-mt-24 border-t border-[#ECE7DA] bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange-accent/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange-accent">
              <Award size={14} />
              {tx("projectsBadge")}
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-brand-green-primary sm:text-3xl md:text-4xl">
              {projectsTitle.pre} <span className="text-brand-orange-accent">{projectsTitle.accent}</span>
            </h2>
            <p className="mt-2 text-sm text-secondary-text sm:text-base">{tx("projectsSubtitle")}</p>
          </div>

          {/* Swipeable row on phones (the next card peeks in), grid from tablet up */}
          <div className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-7 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
            {FEATURED_CARDS.map((card) => (
              <div key={card.slug} className="flex w-[85%] shrink-0 snap-start md:w-auto">
                <FeaturedProjectCard card={card} />
              </div>
            ))}
          </div>

          {/* Other Initiatives: Brief Info & View All Button */}
          <div className="mt-16 overflow-hidden rounded-3xl border border-[#E8E3D7] bg-gradient-to-br from-[#F4FAF6] via-white to-[#FDFBF7] p-8 shadow-xs transition sm:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-green-primary">
                <Sparkles size={14} className="text-brand-orange-accent" />
                {lang === "mr" ? "विविध समाजोपयोगी कार्य" : "Diverse Social Welfare"}
              </span>

              <h3 className="mt-3 text-2xl font-extrabold text-brand-green-primary sm:text-3xl">
                {tx("moreInitiativesTitle")}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-secondary-text sm:text-base">
                {tx("moreInitiativesText")}
              </p>

              {/* Focus Areas */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  { mr: "शिक्षण व शिष्यवृत्ती", en: "Education & Scholarships" },
                  { mr: "आरोग्य व मोफत शिबीरे", en: "Healthcare & Medical Camps" },
                  { mr: "अन्न व पोषण", en: "Nutrition & Food Aid" },
                  { mr: "महिला सक्षमीकरण", en: "Women Empowerment" },
                  { mr: "पर्यावरण व जलसंधारण", en: "Environment & Water" },
                  { mr: "सांस्कृतिक व क्रीडा", en: "Culture & Sports" },
                ].map((item) => (
                  <span
                    key={item.en}
                    className="inline-flex items-center rounded-full border border-light-green-tint bg-white px-3.5 py-1 text-xs font-semibold text-brand-green-primary shadow-2xs"
                  >
                    {lang === "mr" ? item.mr : item.en}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  to={path("projects")}
                  className="inline-flex items-center gap-2.5 rounded-full bg-brand-green-primary px-8 py-3.5 text-sm font-bold text-white shadow-md transition duration-300 hover:bg-brand-green-medium hover:shadow-lg hover:-translate-y-0.5"
                >
                  {tx("viewAllInitiatives")} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Events (कार्यक्रम) */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle pre={h.eventsTitle.split(" ")[0]} accent={h.eventsTitle.split(" ").slice(1).join(" ")} />
          <div className="relative">
            <div ref={eventsScrollRef} className="no-scrollbar flex gap-6 overflow-x-auto pb-2">
              {(apiEvents ?? []).map((ev) => {
                const title = lang === "mr" ? ev.titleMr : ev.titleEn;
                const description = lang === "mr" ? ev.descriptionMr : ev.descriptionEn;
                return (
                  <div
                    key={ev.id}
                    className="group w-[82%] shrink-0 overflow-hidden rounded-2xl bg-card-bg shadow-[0_4px_15px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(20,67,42,0.18)] sm:w-[52%] lg:w-[36%]"
                  >
                    <div className="relative overflow-hidden">
                      {ev.imageUrl ? (
                        <img
                          src={ev.imageUrl}
                          alt={title}
                          className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-[220px] w-full items-center justify-center bg-light-green-tint">
                          <CalendarDays size={36} className="text-brand-green-medium" />
                        </div>
                      )}
                      {ev.eventDate && (
                        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-brand-green-primary shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                          <CalendarDays size={13} className="text-brand-orange-accent" />
                          {ev.eventDate}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold text-main-text">{title}</h4>
                      <p className="mt-2 text-sm text-secondary-text">{description}</p>
                      <div className="mt-4 h-[3px] w-10 rounded-full bg-brand-orange-accent" />
                      {ev.documentUrl && (
                        <a
                          href={ev.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand-orange-accent"
                        >
                          {h.viewDetails} <ArrowRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollEvents(-1)}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-green-primary text-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:bg-brand-green-medium"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollEvents(1)}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-green-primary text-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:bg-brand-green-medium"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="mt-8 text-center">
            <Link
              to={path("events")}
              className="rounded-full bg-brand-orange-accent px-7 py-2.5 text-sm font-bold text-orange-btn-text hover:bg-[#D97A14] hover:text-white"
            >
              {h.viewAllEvents} &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="relative overflow-hidden bg-brand-green-primary py-16">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-green-medium/40 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-orange-accent/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-4 ring-white/10">
            <Heart size={28} className="text-brand-orange-accent" />
          </div>
          <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
            {h.donateCtaTitle ?? t.home.donateCtaTitle}
          </h3>
          <p className="max-w-2xl text-sm text-footer-text sm:text-base">
            {h.donateCtaText ?? t.home.donateCtaText}
          </p>
          <a
            href={t.common.donateUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-orange-accent px-8 py-3 text-sm font-bold text-orange-btn-text shadow-[0_4px_16px_rgba(234,139,34,0.35)] transition hover:-translate-y-0.5 hover:bg-[#D97A14] hover:text-white hover:shadow-[0_8px_24px_rgba(234,139,34,0.45)]"
          >
            <Heart size={16} /> {h.donateCtaButton ?? t.home.donateCtaButton}
          </a>
        </div>
      </section>

      {/* Volunteers of the Month */}
      <section className="bg-[#F3EFE6] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle pre={h.volunteersTitle.split(" ").slice(0, -1).join(" ")} accent={h.volunteersTitle.split(" ").slice(-1).join(" ")} />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {h.volunteers.map((v) => (
              <div key={v.name} className="overflow-hidden rounded-xl bg-card-bg shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
                <img src={asset(v.image)} alt={v.name} className="h-[220px] w-full object-cover sm:h-[260px]" />
                <div className="p-3 text-center">
                  <h4 className="text-sm font-bold text-main-text sm:text-base">{v.name}</h4>
                  <p className="text-xs font-semibold text-brand-orange-accent sm:text-sm">{v.place}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Photo Albums Stream (Continuous Auto-Scroll to Left) */}
      <section className="border-t border-[#ECE7DA] bg-[#FAF8F5] py-16 sm:py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-8">
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-green-primary">
                <Images size={14} className="text-brand-orange-accent" />
                {lang === "mr" ? "फोटो अल्बम्स" : "Photo Albums"}
              </span>
              <h2 className="mt-2 text-2xl font-extrabold text-brand-green-primary sm:text-3xl md:text-4xl">
                {splitTitle(h.galleryTitle, 1).pre}{" "}
                <span className="text-brand-orange-accent">{splitTitle(h.galleryTitle, 1).accent}</span>
              </h2>
              <p className="mt-1 text-sm text-secondary-text sm:text-base max-w-2xl">
                {lang === "mr"
                  ? "आमच्या विविध उपक्रमांची आणि सामाजिक कार्याची झलक अल्बम स्वरूपात पहा."
                  : "Explore photo albums of our various initiatives and social work."}
              </p>
            </div>

            {/* Manual Slide Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollGallery(-1)}
                aria-label={lang === "mr" ? "मागील अल्बम" : "Previous albums"}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D5CEBF] bg-white text-main-text shadow-xs transition hover:border-brand-green-primary hover:bg-brand-green-primary hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => scrollGallery(1)}
                aria-label={lang === "mr" ? "पुढील अल्बम" : "Next albums"}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D5CEBF] bg-white text-main-text shadow-xs transition hover:border-brand-green-primary hover:bg-brand-green-primary hover:text-white"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Auto-scrolling horizontal album stream */}
        <div className="relative w-full">
          {displayAlbums.length === 0 ? (
            <div className="flex gap-5 px-4 overflow-hidden">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="h-64 w-72 sm:w-80 shrink-0 rounded-2xl bg-gray-200/80 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div
              ref={galleryScrollRef}
              onMouseEnter={() => {
                isGalleryHovered.current = true;
              }}
              onMouseLeave={() => {
                isGalleryHovered.current = false;
              }}
              onTouchStart={() => {
                isGalleryHovered.current = true;
              }}
              onTouchEnd={() => {
                setTimeout(() => {
                  isGalleryHovered.current = false;
                }, 1800);
              }}
              className="flex gap-6 overflow-x-auto py-4 px-4 sm:px-6 no-scrollbar cursor-grab active:cursor-grabbing select-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {displayAlbums.map((album, index) => (
                <Link
                  key={`${album.key}-${index}`}
                  to={`${path("gallery")}?album=${album.key}`}
                  className="group relative block w-72 sm:w-80 shrink-0 cursor-pointer pt-2"
                >
                  {/* Layered stack effect */}
                  <div className="absolute inset-x-2 top-0.5 bottom-2 rounded-2xl border border-[#E4DFD2] bg-white/70 shadow-xs transition-transform duration-300 group-hover:-top-1.5 group-hover:rotate-1 pointer-events-none" />

                  {/* Main Album Card */}
                  <div className="relative overflow-hidden rounded-2xl border border-[#E8E3D7] bg-white shadow-xs transition duration-300 group-hover:-translate-y-1.5 group-hover:border-brand-green-medium group-hover:shadow-xl">
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                      <img
                        src={album.coverPhoto?.imageUrl}
                        alt={album.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-108"
                        onError={() => {
                          if (album.coverPhoto?.id) {
                            setBrokenImageIds((prev) => new Set(prev).add(album.coverPhoto.id));
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                      {/* Photo Count Badge */}
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-sm">
                        <Images size={13} className="text-brand-orange-accent" />
                        {lang === "mr" ? `${toMarathiNumeral(album.count)} छायाचित्रे` : `${album.count} Photos`}
                      </span>

                      {/* Album Title */}
                      <div className="absolute bottom-0 inset-x-0 p-4">
                        <h4 className="text-base sm:text-lg font-bold text-white drop-shadow-md leading-snug">
                          {album.title}
                        </h4>
                      </div>
                    </div>

                    {/* Album Card Footer */}
                    <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3">
                      <span className="text-xs font-bold text-brand-green-primary group-hover:text-brand-orange-accent transition">
                        {lang === "mr" ? "संपूर्ण अल्बम उघडा" : "Open Full Album"}
                      </span>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange-accent/10 text-brand-orange-accent group-hover:bg-brand-orange-accent group-hover:text-white transition">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* CTA to View All Albums */}
        <div className="mt-10 text-center">
          <Link
            to={path("gallery")}
            className="inline-flex items-center gap-2 rounded-full bg-brand-orange-accent px-8 py-3.5 text-base font-bold text-orange-btn-text shadow-sm transition hover:bg-[#D97A14] hover:text-white"
          >
            {lang === "mr" ? "सर्व फोटो अल्बम्स पहा" : (h.viewFullGallery || "View All Photo Albums")}{" "}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="bg-cover bg-center py-16"
        style={{ backgroundImage: `url(${asset("background/8.jpg")})` }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle
            pre={h.testimonialsTitle.split(" ").slice(0, -1).join(" ")}
            accent={h.testimonialsTitle.split(" ").slice(-1).join(" ")}
          />

          {testimonialsCount > 0 && (
            <div
              className="mx-auto max-w-2xl overflow-hidden rounded-3xl bg-quote-bg px-6 py-12 text-center shadow-[0_20px_45px_rgba(0,0,0,0.2)] sm:px-12"
              onMouseEnter={() => (testimonialsPausedRef.current = true)}
              onMouseLeave={() => (testimonialsPausedRef.current = false)}
              onTouchStart={() => (testimonialsPausedRef.current = true)}
              onTouchEnd={() => {
                setTimeout(() => (testimonialsPausedRef.current = false), 2500);
              }}
            >
              <Quote size={44} className="mx-auto mb-6 fill-quote-text/90 text-quote-text/90" />

              <AnimatePresence mode="wait">
                {(() => {
                  const ts = apiTestimonials[testimonialIndex];
                  return (
                    <motion.div
                      key={ts.id}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.4 }}
                    >
                      <p className="text-lg leading-relaxed text-quote-text sm:text-xl">
                        {lang === "mr" ? ts.messageMr : ts.messageEn}
                      </p>
                      <h4 className="mt-6 font-bold text-quote-accent">- {ts.name}</h4>
                      {(lang === "mr" ? ts.roleMr : ts.roleEn) && (
                        <span className="text-sm text-quote-text/70">{lang === "mr" ? ts.roleMr : ts.roleEn}</span>
                      )}
                    </motion.div>
                  );
                })()}
              </AnimatePresence>

              {testimonialsCount > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {apiTestimonials.map((ts, i) => (
                    <button
                      key={ts.id}
                      aria-label={`Testimonial ${i + 1}`}
                      onClick={() => setTestimonialIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === testimonialIndex ? "w-6 bg-quote-text" : "w-2 bg-quote-text/35"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

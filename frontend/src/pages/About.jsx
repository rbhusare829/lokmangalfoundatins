import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle,
  ArrowRightCircle,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Award,
  Heart,
  Users2,
  HandHeart,
  Landmark,
  Target,
  ArrowUpRight
} from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";
import { useSiteContent } from "../lib/SiteContentContext.jsx";
import { useApi } from "../lib/useApi.js";
import { asset } from "../lib/assetUrl.js";
import PageBanner from "../components/ui/PageBanner.jsx";
import SectionTitle from "../components/ui/SectionTitle.jsx";
import { aboutData } from "../data/aboutContent.js";

function splitTitle(title = "") {
  const words = title.trim().split(" ");
  if (words.length <= 1) return { pre: title, accent: "" };
  return { pre: words.slice(0, -1).join(" "), accent: words.slice(-1).join(" ") };
}

// Teaser for the About > Our Team sub-page: a row of faces cropped out of the
// (4:5, name-printed) team cards, plus a link to the full page.
function TeamTeaser({ t, lang, path }) {
  const cms = useSiteContent("team") ?? {};
  const tx = (key) => cms[key] ?? t.pages.team[key];
  const { data: team } = useApi("/team");
  const faces = (team ?? []).filter((m) => m.photoUrl).slice(0, 5);
  const extra = (team?.length ?? 0) - faces.length;
  const extraLabel = lang === "mr" ? String(extra).replace(/\d/g, (d) => "०१२३४५६७८९"[d]) : extra;

  return (
    <section className="bg-light-green-tint/40 py-10 sm:py-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="relative flex flex-col items-center gap-7 overflow-hidden rounded-3xl border border-brand-green-medium/20 bg-white p-6 text-center shadow-sm sm:p-9 md:flex-row md:text-left">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-orange-accent/10 blur-2xl" />
          <div className="relative flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-green-primary">
              <Users2 size={14} className="text-brand-orange-accent" /> {tx("title")}
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-brand-green-primary sm:text-3xl">{tx("teaserTitle")}</h2>
            <p className="mt-2 text-sm text-secondary-text sm:text-base">{tx("teaserText")}</p>
            <Link
              to={path("about/team")}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-green-primary px-6 py-3 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-green-medium hover:shadow-lg"
            >
              {tx("teaserButton")} <ArrowRight size={16} />
            </Link>
          </div>
          {faces.length > 0 && (
            <Link to={path("about/team")} tabIndex={-1} aria-hidden="true" className="relative flex shrink-0 -space-x-4">
              {faces.map((m) => (
                <span
                  key={m.id}
                  className="h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-light-green-tint shadow-md sm:h-20 sm:w-20"
                >
                  <img
                    src={m.photoUrl}
                    alt=""
                    loading="lazy"
                    className="h-full w-full scale-[1.7] object-cover"
                    style={{ objectPosition: "50% 20%", transformOrigin: "50% 38%" }}
                  />
                </span>
              ))}
              {extra > 0 && (
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-brand-orange-accent text-sm font-extrabold text-white shadow-md sm:h-20 sm:w-20">
                  +{extraLabel}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function GlassObjectivesVision({ h, lang }) {
  const [activeTab, setActiveTab] = useState(0); // 0 = Objectives, 1 = Vision
  const [isPaused, setIsPaused] = useState(false);

  const objectivesList = Array.isArray(h.objectives)
    ? h.objectives
    : (h.objectives || "").split("\n").filter(Boolean);
  const visionList = Array.isArray(h.vision)
    ? h.vision
    : (h.vision || "").split("\n").filter(Boolean);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveTab((curr) => (curr === 0 ? 1 : 0));
    }, 7000);

    return () => clearInterval(timer);
  }, [isPaused, activeTab]);

  const isObjectives = activeTab === 0;

  return (
    <div
      className="relative mx-auto max-w-4xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Decorative Ambient Glow Orbs for Glassmorphism Effect */}
      <div className="pointer-events-none absolute -top-8 -left-8 h-64 w-64 rounded-full bg-gradient-to-tr from-emerald-400/25 to-teal-300/20 blur-3xl transition-opacity duration-700" />
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-64 w-64 rounded-full bg-gradient-to-br from-amber-400/25 to-orange-400/20 blur-3xl transition-opacity duration-700" />

      {/* Main Glassmorphic Card Container */}
      <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-6 shadow-[0_20px_50px_rgba(20,67,42,0.08),0_1px_3px_rgba(0,0,0,0.02)] backdrop-blur-2xl sm:p-8">
        {/* Animated View Card */}
        <div className="min-h-[260px]">
          <AnimatePresence mode="wait">
            {isObjectives ? (
              <motion.div
                key="objectives"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-4"
              >
                {/* Header Banner Inside Card */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-4 backdrop-blur-md">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-green-primary text-white shadow-md shadow-brand-green-primary/20">
                    <Target size={24} />
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold text-brand-green-primary sm:text-xl">
                      {h.objectivesTitle}
                    </h3>
                    <p className="mt-0.5 text-xs font-semibold text-brand-green-medium sm:text-sm">
                      {h.objectivesIntro}
                    </p>
                  </div>
                </div>

                {/* Items in Glass Pills */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {objectivesList.map((o, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 p-3.5 text-xs font-medium text-[#1E3A2F] shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400/50 hover:bg-white/95 hover:shadow-md sm:text-sm"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-100/90 text-emerald-700 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <CheckCircle size={15} />
                      </span>
                      <span className="leading-snug">{o}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="vision"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-4"
              >
                {/* Header Banner Inside Card */}
                <div className="flex items-center gap-3.5 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 backdrop-blur-md">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-orange-accent text-white shadow-md shadow-brand-orange-accent/20">
                    <Sparkles size={24} />
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#9A4B00] sm:text-xl">
                      {h.visionTitle}
                    </h3>
                    <p className="mt-0.5 text-xs font-semibold text-brand-orange-accent sm:text-sm">
                      {lang === "mr" ? "आमचा संकल्प आणि भविष्याचा वेध" : "Our core mission and guiding path"}
                    </p>
                  </div>
                </div>

                {/* Items in Glass Pills */}
                <div className="grid grid-cols-1 gap-2.5">
                  {visionList.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 p-3.5 text-xs font-medium text-[#3A2410] shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/50 hover:bg-white/95 hover:shadow-md sm:text-sm"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-100/90 text-[#C56505] shadow-2xs group-hover:bg-brand-orange-accent group-hover:text-white transition-colors">
                        <ArrowRightCircle size={15} />
                      </span>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Interactive Indicators */}
        <div className="mt-6 flex items-center justify-center gap-2 border-t border-black/5 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab(0)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              isObjectives ? "w-8 bg-brand-green-primary shadow-xs" : "w-2 bg-black/20 hover:bg-black/40"
            }`}
            aria-label="Objectives"
          />
          <button
            type="button"
            onClick={() => setActiveTab(1)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              !isObjectives ? "w-8 bg-brand-orange-accent shadow-xs" : "w-2 bg-black/20 hover:bg-black/40"
            }`}
            aria-label="Vision"
          />
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const { t, lang, path } = useLanguage();
  const location = useLocation();

  // Load content with fallback to aboutData for the current language
  const staticData = aboutData[lang] || aboutData.mr;
  const cmsAbout = useSiteContent("about");
  const a = cmsAbout ? { ...staticData, ...cmsAbout } : staticData;

  const v = useSiteContent("volunteer") ?? t.pages.volunteer;
  const f = useSiteContent("faq") ?? t.pages.faq;
  const h = useSiteContent("home") ?? t.home;

  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.slice(1);
    const el = document.getElementById(targetId);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [location.hash]);

  const volunteerTitle = splitTitle(v.title);
  const faqTitle = splitTitle(f.title);

  const foundationSec = a.aboutFoundationSection;
  const partSec = a.participationSection;
  const donSec = a.donationSection;

  return (
    <>
      <PageBanner title={a.title || (lang === "mr" ? "लोकमंगल फाऊंडेशन" : "About Lokmangal Foundation")} />



      {/* 2. Page 2 Content - लोकमंगल फाऊंडेशनबद्दल (संस्था परिचय, २००५ स्थापना व आमचे कार्य) */}
      {foundationSec && (
        <section className="border-y border-[#ECE7DA] bg-[#FCFBF8] py-10 sm:py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange-accent/15 px-3.5 py-1 text-xs font-bold tracking-wider text-brand-orange-accent uppercase">
                <Landmark size={13} /> {foundationSec.badge}
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-brand-green-primary sm:text-3xl md:text-4xl">
                {foundationSec.title}
              </h2>
            </div>

            {/* Key Meta Badges */}
            {foundationSec.meta && (
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {foundationSec.meta.map((m, i) => (
                  <div key={i} className="rounded-xl border border-light-green-tint bg-white p-3.5 text-center shadow-xs">
                    <span className="block text-[11px] font-bold text-secondary-text uppercase tracking-wide">{m.label}</span>
                    <span className="mt-0.5 block text-xs font-extrabold text-brand-green-primary sm:text-sm">{m.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Foundation Story Paragraphs */}
            <div className="mt-8 space-y-4 rounded-2xl border border-[#E8E2D3] bg-white p-6 shadow-sm sm:p-8">
              {foundationSec.paragraphs.map((p, idx) => (
                <p key={idx} className="text-sm leading-relaxed text-secondary-text sm:text-base">
                  {p}
                </p>
              ))}
            </div>

            {/* आमचे कार्य (Our Approach & Philosophy) */}
            <div className="mt-8 rounded-2xl border border-brand-green-medium/30 bg-gradient-to-br from-light-green-tint/40 via-white to-light-green-tint/20 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-brand-green-primary">
                <Target size={20} className="text-brand-orange-accent" />
                <h3 className="text-lg font-extrabold sm:text-xl">{foundationSec.ourWorkTitle}</h3>
              </div>
              {foundationSec.ourWorkSubtitle && (
                <p className="mt-1 text-xs font-bold text-brand-orange-accent sm:text-sm">
                  {foundationSec.ourWorkSubtitle}
                </p>
              )}
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-secondary-text sm:text-base">
                {foundationSec.ourWorkText.split("\n\n").filter(Boolean).map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {/* Banner to Explore All 23 Initiatives on Our Projects Page */}
            <div className="mt-8 flex flex-col items-center justify-between gap-6 rounded-2xl border border-brand-green-medium/30 bg-white p-6 text-center shadow-xs sm:flex-row sm:p-8 sm:text-left">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange-accent">
                  <Award size={13} /> {lang === "mr" ? "एकूण २३ उपक्रम" : "All 23 Initiatives"}
                </span>
                <h3 className="mt-2 text-xl font-extrabold text-brand-green-primary sm:text-2xl">
                  {lang === "mr" ? "लोकमंगल फाऊंडेशनचे सर्व सामाजिक उपक्रम" : "Explore All Social Initiatives"}
                </h3>
                <p className="mt-1 max-w-2xl text-xs text-secondary-text sm:text-sm">
                  {lang === "mr"
                    ? "अन्नपूर्णा, जलसंधारण, शिक्षण, आरोग्य आणि महिला सक्षमीकरणासह सर्व २३ उपक्रमांची सविस्तर माहिती आमच्या प्रकल्प पृष्ठावर पहा."
                    : "Explore comprehensive information on all 23 initiatives spanning food security, water, education, healthcare, and women empowerment on our Projects page."}
                </p>
              </div>
              <Link
                to={path("projects")}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-green-primary px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-brand-green-medium hover:shadow-lg sm:text-sm"
              >
                {lang === "mr" ? "सर्व २३ उपक्रम पहा" : "View All 23 Projects"} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 5. Objectives & Vision Section (Interactive Glassmorphic Carousel with 7s Timer & Controls) */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-white via-light-green-tint/20 to-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4">
          <GlassObjectivesVision h={h} lang={lang} />
        </div>
      </section>

      {/* 6. Our Team teaser (full list lives on the About > Our Team sub-page) */}
      <TeamTeaser t={t} lang={lang} path={path} />

      {/* 7. Page 2 Content - आपला सहभाग (Your Participation & Involvement) */}
      {partSec && (
        <section id="participation" className="scroll-mt-24 border-y border-[#E9E4D6] bg-white py-10 sm:py-12">
          <div className="mx-auto max-w-5xl px-4 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-primary/10 px-3.5 py-1 text-xs font-bold tracking-wider text-brand-green-primary uppercase">
              <Users2 size={14} className="text-brand-orange-accent" /> {partSec.badge}
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-brand-green-primary sm:text-3xl md:text-4xl">
              {partSec.title}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold text-brand-orange-accent sm:text-base">
              {partSec.subtitle}
            </p>

            <div className="mx-auto mt-6 max-w-3xl space-y-4 text-left text-sm leading-relaxed text-secondary-text sm:text-base">
              <div className="rounded-xl border border-light-green-tint bg-[#FAF9F5] p-5">
                <p>{partSec.text1}</p>
              </div>
              <div className="rounded-xl border border-light-green-tint bg-[#FAF9F5] p-5">
                <p>{partSec.text2}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#volunteer"
                className="rounded-full bg-brand-green-primary px-7 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-brand-green-medium sm:text-sm"
              >
                {partSec.volunteerButton}
              </a>
              <Link
                to={path("contact")}
                className="rounded-full border border-brand-green-primary bg-white px-7 py-3 text-xs font-bold text-brand-green-primary transition hover:bg-light-green-tint sm:text-sm"
              >
                {partSec.contactButton}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 8. Page 2 Content - आपल्या योगदानातून घडवा एक सकारात्मक बदल (Donation & Support Appeal) */}
      {donSec && (
        <section id="contribute-appeal" className="scroll-mt-24 bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#1E3A2F] py-10 sm:py-12 text-white">
          <div className="mx-auto max-w-5xl px-4">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold tracking-wider text-brand-orange-accent uppercase backdrop-blur-xs">
                <HandHeart size={14} /> {donSec.badge}
              </span>
              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl md:text-4xl text-white">
                {donSec.title}
              </h2>
              <p className="mt-2 text-sm text-[#D8F3DC] sm:text-base">
                {donSec.subtitle}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {donSec.paragraphs.map((para, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-xs transition hover:bg-white/15"
                >
                  <p className="text-xs leading-relaxed text-[#F0FDF4] sm:text-sm">
                    {para}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href={t.common.donateUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange-accent px-8 py-3.5 text-xs font-extrabold text-white shadow-lg transition hover:bg-[#D97A14] hover:shadow-xl sm:text-sm"
              >
                <Heart size={16} /> {donSec.donateButton} <ArrowUpRight size={16} />
              </a>
              <Link
                to={path("contribute")}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-xs font-bold text-white backdrop-blur-xs transition hover:bg-white/20 sm:text-sm"
              >
                {donSec.learnMoreButton}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 9. Volunteer CTA Section */}
      <section id="volunteer" className="scroll-mt-24 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle pre={volunteerTitle.pre} accent={volunteerTitle.accent} />
          <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <img
              src={asset("resource/volunteer-bg.jpg")}
              alt="Volunteer"
              className="h-72 w-full rounded-2xl object-cover shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
              loading="lazy"
            />
            <div>
              <h2 className="text-2xl font-extrabold text-brand-green-primary sm:text-3xl">{v.introTitle}</h2>
              <p className="mt-4 text-sm leading-relaxed text-secondary-text">{v.introText}</p>
              <Link
                to={path("contact")}
                className="mt-6 inline-block rounded-full bg-brand-orange-accent px-7 py-2.5 text-sm font-bold text-orange-btn-text hover:bg-[#D97A14] hover:text-white"
              >
                {h.becomeVolunteer}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ Section */}
      <section id="faq" className="scroll-mt-24 bg-light-green-tint/30 py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle pre={faqTitle.pre} accent={faqTitle.accent} />
          <div className="mx-auto mt-8 max-w-3xl">
            <div className="divide-y divide-light-green-tint overflow-hidden rounded-2xl border border-light-green-tint bg-card-bg">
              {f.items.map((item, i) => {
                const open = openFaq === i;
                return (
                  <div key={i}>
                    <button
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                    >
                      <span className="font-semibold text-brand-green-primary">{item.q}</span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-brand-orange-accent transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open && <div className="px-5 pb-4 text-sm text-secondary-text">{item.a}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

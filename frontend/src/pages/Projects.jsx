import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Sparkles,
  Heart,
  Droplets,
  GraduationCap,
  Users2,
  ExternalLink,
  X,
  Award,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar
} from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";
import { useSiteContent } from "../lib/SiteContentContext.jsx";
import { useApi } from "../lib/useApi.js";
import PageBanner from "../components/ui/PageBanner.jsx";
import { LoadingState, ErrorState } from "../components/ui/AsyncState.jsx";
import ProjectCardMedia from "../components/ui/ProjectCardMedia.jsx";
import FeaturedProjectCard from "../components/ui/FeaturedProjectCard.jsx";
import { FEATURED_CARDS, CATEGORY_MAP, CATEGORIES } from "../lib/projectCatalog.js";

const DEVANAGARI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
function toMarathiNumeral(n) {
  return String(n)
    .split("")
    .map((d) => DEVANAGARI_DIGITS[Number(d)] ?? d)
    .join("");
}

// Top Movement Section Content
const MOVEMENT_CONTENT = {
  badgeMr: "लोकमंगल फाऊंडेशन",
  badgeEn: "Lokmangal Foundation",
  titleMr: "ग्रामीण विकासातून सामाजिक परिवर्तनाची चळवळ",
  titleEn: "A Movement for Social Transformation through Rural Development",
  paragraphsMr: [
    "लोकमंगल फाऊंडेशन ही ग्रामीण समाजाच्या सर्वांगीण विकासासाठी कार्यरत असलेली सेवाभावी संस्था आहे. मा. सुभाष बापू देशमुख यांच्या लोकसेवेच्या ध्येयातून सुरू झालेल्या या संस्थेचा उद्देश ग्रामीण भागातील गरजू नागरिकांना आवश्यक सुविधा, संधी आणि आधार उपलब्ध करून देत त्यांचे जीवनमान उंचावणे हा आहे.",
    "शिक्षण, आरोग्य, अन्नसुरक्षा, जलसंधारण, शेती, ज्येष्ठ नागरिक सेवा आणि सामाजिक कल्याण अशा विविध क्षेत्रांत २३ उपक्रमांच्या माध्यमातून संस्था कार्यरत आहे. अन्नपूर्णा योजना, सामुदायिक विवाह सोहळे, शैक्षणिक उपक्रम, जलसंधारण आणि आरोग्य सेवेसह विविध उपक्रमांद्वारे समाजातील गरजू घटकांपर्यंत सेवा पोहोचवली जात आहे. ग्रामीण भागातील गरजा आणि स्थानिक समस्या समजून घेऊन शाश्वत विकास, स्वावलंबन आणि सामाजिक सक्षमीकरणाला प्राधान्य देणे, हा लोकमंगल फाऊंडेशनच्या कार्याचा केंद्रबिंदू आहे.",
    "समाजाच्या शेवटच्या घटकापर्यंत सेवा आणि विकासाच्या संधी पोहोचवण्याच्या संकल्पातून लोकमंगल फाऊंडेशनची वाटचाल निरंतर सुरू आहे."
  ],
  paragraphsEn: [
    "Lokmangal Foundation is a philanthropic organisation working towards the holistic development of rural communities. Founded with the vision of public service of Hon. Subhash Bapu Deshmukh, the Foundation aims to improve the quality of life of people in rural areas by providing essential facilities, opportunities and support to those in need.",
    "The Foundation works across various areas, including education, healthcare, food security, water conservation, agriculture, services for senior citizens and social welfare through 23 initiatives. Through initiatives such as the Annapurna Yojana, community marriage ceremonies, educational programmes, water conservation and healthcare services, the Foundation strives to reach and support the most vulnerable sections of society. Understanding the needs and local challenges of rural communities and prioritising sustainable development, self-reliance and social empowerment remain at the heart of Lokmangal Foundation's work.",
    "Lokmangal Foundation continues its journey with a commitment to taking essential services and opportunities for development to the last mile of society."
  ],
  stats: [
    { valueMr: "२३", valueEn: "23", labelMr: "एकूण उपक्रम", labelEn: "Total Initiatives" },
    { valueMr: "३,२२१+", valueEn: "3,221+", labelMr: "सामुदायिक विवाह", labelEn: "Couples Married" },
    { valueMr: "१७.३ लाख+", valueEn: "17.3 Lakh+", labelMr: "वितरित टिफिन", labelEn: "Meals Delivered" },
    { valueMr: "१०० कोटी लिटर", valueEn: "100 Cr Litres", labelMr: "वाढीव जलसाठा", labelEn: "Water Storage Added" }
  ]
};

export default function Projects() {
  const { t, lang, path } = useLanguage();
  const pg = useSiteContent("projects") ?? t.pages.projects;
  const { data, error, loading } = useApi("/projects");

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const projectsList = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [data]);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return projectsList.filter((p) => {
      const catInfo = CATEGORY_MAP[p.slug] || { key: "social", mr: "सामाजिक", en: "Social" };
      const matchesCategory = activeCategory === "all" || catInfo.key === activeCategory;
      if (!matchesCategory) return false;

      if (!q) return true;

      const title = (lang === "mr" ? p.titleMr : p.titleEn) || "";
      const summary = (lang === "mr" ? p.summaryMr : p.summaryEn) || "";
      const stat = (lang === "mr" ? p.statMr : p.statEn) || "";
      const categoryName = lang === "mr" ? catInfo.mr : catInfo.en;

      const searchStr = `${title} ${summary} ${stat} ${categoryName}`.toLowerCase();
      return searchStr.includes(q);
    });
  }, [projectsList, activeCategory, searchQuery, lang]);

  const paragraphs = lang === "mr" ? MOVEMENT_CONTENT.paragraphsMr : MOVEMENT_CONTENT.paragraphsEn;

  return (
    <>
      <PageBanner
        title={lang === "mr" ? "लोकमंगल फाऊंडेशनचे उपक्रम" : (pg.title || "Our Projects")}
      />

      {/* 1. Hero / Movement Section (ग्रामीण विकासातून सामाजिक परिवर्तनाची चळवळ) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F7F4] via-white to-[#FAF8F5] py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-green-medium/30 bg-brand-green-primary/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brand-green-primary shadow-xs">
              <Sparkles size={14} className="text-brand-orange-accent" />
              {lang === "mr" ? MOVEMENT_CONTENT.badgeMr : MOVEMENT_CONTENT.badgeEn}
            </span>

            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-brand-green-primary sm:text-4xl md:text-5xl">
              {lang === "mr" ? MOVEMENT_CONTENT.titleMr : MOVEMENT_CONTENT.titleEn}
            </h1>
          </div>

          {/* 3 Story Cards in a Modern Bento Style */}
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Card 1: Founder Vision & Mission */}
            <div className="relative rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-white to-white p-6 shadow-xs transition hover:shadow-md sm:p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-green-primary text-white shadow-xs">
                <Sparkles size={18} />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-brand-green-primary sm:text-lg">
                {lang === "mr" ? "संस्थेची प्रेरणा व ध्येय" : "Mission & Public Service"}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-secondary-text sm:text-sm">
                {paragraphs[0]}
              </p>
            </div>

            {/* Card 2: 23 Initiatives Scope */}
            <div className="relative rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-white to-white p-6 shadow-xs transition hover:shadow-md sm:p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-orange-accent text-white shadow-xs">
                <Award size={18} />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-[#9A4B00] sm:text-lg">
                {lang === "mr" ? "२३ उपक्रमांची व्याप्ती" : "Scope of 23 Initiatives"}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-secondary-text sm:text-sm">
                {paragraphs[1]}
              </p>
            </div>

            {/* Card 3: Continuous Transformation */}
            <div className="relative rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/5 via-white to-white p-6 shadow-xs transition hover:shadow-md sm:p-7">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-xs">
                <Users2 size={18} />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-teal-800 sm:text-lg">
                {lang === "mr" ? "शाश्वत विकास व निरंतर वाटचाल" : "Relentless Transformation"}
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-secondary-text sm:text-sm">
                {paragraphs[2]}
              </p>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {MOVEMENT_CONTENT.stats.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#ECE7DA] bg-white p-5 text-center shadow-xs transition hover:-translate-y-1 hover:border-brand-green-medium hover:shadow-md"
              >
                <div className="text-2xl font-extrabold text-brand-green-primary sm:text-3xl">
                  {lang === "mr" ? stat.valueMr : stat.valueEn}
                </div>
                <div className="mt-1 text-xs font-semibold text-secondary-text sm:text-sm">
                  {lang === "mr" ? stat.labelMr : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. 4 Featured Impact Cards (New Look) */}
      <section className="border-t border-[#ECE7DA] bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange-accent/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange-accent">
              <Award size={14} />
              {lang === "mr" ? "प्रमुख आधारस्तंभ" : "Core Flagship Pillars"}
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-brand-green-primary sm:text-3xl md:text-4xl">
              {lang === "mr" ? "प्रमुख वैशिष्ट्यपूर्ण उपक्रम" : "Featured Impact Initiatives"}
            </h2>
            <p className="mt-2 text-sm text-secondary-text sm:text-base">
              {lang === "mr"
                ? "ग्रामीण जनतेच्या मूलभूत गरजांना प्राधान्य देणारे आमचे प्रमुख उपक्रम"
                : "Flagship programs elevating rural quality of life and creating lasting social change"}
            </p>
          </div>

          {/* 4 Cards Grid - Modern Showcase Look */}
          <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4">
            {FEATURED_CARDS.map((card) => (
              <FeaturedProjectCard key={card.slug} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. All 23 Social Initiatives Explorer Section */}
      <section className="border-t border-[#ECE7DA] bg-gradient-to-b from-[#FAF8F5] via-white to-[#F2F7F4] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green-medium/30 bg-brand-green-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-brand-green-primary">
              <Sparkles size={14} className="text-brand-orange-accent" />
              {lang === "mr" ? "उपक्रम सूची" : "All Projects"}
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-brand-green-primary sm:text-3xl md:text-4xl">
              {lang === "mr" ? "सर्व २३ सामाजिक उपक्रम" : "Explore All 23 Social Initiatives"}
            </h2>
            <p className="mt-2 text-sm text-secondary-text sm:text-base">
              {lang === "mr"
                ? "विषयानुसार निवडा किंवा थेट शोधून प्रत्येक उपक्रमाची सविस्तर माहिती जाणून घ्या"
                : "As mentioned earlier, Lokmangal Foundation works towards improving the quality of life of people in rural areas. The Foundation has undertaken several initiatives aimed at addressing the needs of rural communities. Some of these initiatives are as follows:"}
            </p>
          </div>

          {/* Filter Pills & Live Search Bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Category tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                const count =
                  cat.id === "all"
                    ? projectsList.length
                    : projectsList.filter(
                        (p) => (CATEGORY_MAP[p.slug]?.key || "social") === cat.id
                      ).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-brand-green-primary text-white shadow-sm scale-105"
                        : "bg-white text-secondary-text border border-[#DDD8CA] hover:border-brand-green-medium hover:text-brand-green-primary"
                    }`}
                  >
                    <span>{lang === "mr" ? cat.mr : cat.en}</span>
                    <span
                      className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-light-green-tint text-brand-green-primary"
                      }`}
                    >
                      {lang === "mr" ? toMarathiNumeral(count) : count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Realtime Search Bar */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === "mr" ? "उपक्रम शोधा..." : "Search initiatives..."
                }
                className="w-full rounded-full border border-[#DDD8CA] bg-white py-2 pl-9 pr-9 text-xs outline-none focus:border-brand-green-primary focus:ring-1 focus:ring-brand-green-primary sm:text-sm shadow-2xs"
              />
              <Search
                size={16}
                className="absolute left-3 top-2.5 text-secondary-text"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-secondary-text hover:text-main-text cursor-pointer"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {loading && <LoadingState />}
          {error && <ErrorState />}

          {!loading && !error && (
            <>
              {filteredProjects.length === 0 ? (
                <div className="mt-16 rounded-3xl border border-[#E9E4D8] bg-white p-12 text-center shadow-xs">
                  <p className="text-base font-semibold text-secondary-text">
                    {lang === "mr"
                      ? "कोणताही उपक्रम आढळला नाही."
                      : "No projects found matching your search."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                    className="mt-4 rounded-full bg-brand-green-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-green-medium shadow-xs"
                  >
                    {lang === "mr" ? "सर्व उपक्रम पहा" : "Reset Filters"}
                  </button>
                </div>
              ) : (
                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((p, idx) => {
                    const numberStr =
                      lang === "mr"
                        ? toMarathiNumeral(p.sortOrder || idx + 1).padStart(2, "०")
                        : String(p.sortOrder || idx + 1).padStart(2, "0");
                    const catInfo = CATEGORY_MAP[p.slug] || {
                      mr: "सामाजिक कल्याण",
                      en: "Social Welfare",
                    };
                    const title = lang === "mr" ? p.titleMr : p.titleEn;
                    const summary = lang === "mr" ? p.summaryMr : p.summaryEn;
                    const stat = lang === "mr" ? p.statMr : p.statEn;

                    return (
                      <div
                        key={p.id || p.slug}
                        className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E8E3D7] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-brand-green-medium hover:shadow-xl"
                      >
                        <div>
                          {/* Image / Visual Header */}
                          <div className="relative overflow-hidden">
                            <ProjectCardMedia
                              project={p}
                              title={title}
                              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Number badge */}
                            <span className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-green-primary font-mono text-xs font-extrabold text-white shadow-md">
                              {numberStr}
                            </span>
                            {/* Category badge */}
                            <span className="absolute top-3 right-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-brand-green-primary shadow-xs backdrop-blur-xs">
                              {lang === "mr" ? catInfo.mr : catInfo.en}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <h3 className="text-base font-extrabold text-brand-green-primary transition group-hover:text-brand-green-medium sm:text-lg">
                              {title}
                            </h3>

                            {/* Stat pill */}
                            {stat && (
                              <div className="mt-2.5 inline-block rounded-md bg-light-orange-tint px-2.5 py-1 text-xs font-bold text-orange-icon">
                                {stat}
                              </div>
                            )}

                            {/* Card Content Summary */}
                            <p className="mt-3 text-xs leading-relaxed text-secondary-text sm:text-sm line-clamp-4">
                              {summary}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="flex items-center justify-between border-t border-[#F2ECE1] p-5 pt-3">
                          <Link
                            to={path(`projects/${p.slug}`)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange-accent transition hover:translate-x-0.5 hover:text-[#C56505] sm:text-sm"
                          >
                            <span>{t.common.readMore || (lang === "mr" ? "अधिक वाचा" : "Read More")}</span>
                            <ArrowRight size={14} />
                          </Link>

                          <Link
                            to={path(`projects/${p.slug}`)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-brand-green-medium hover:text-brand-green-primary"
                            title={lang === "mr" ? "सविस्तर माहिती" : "View Details"}
                          >
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

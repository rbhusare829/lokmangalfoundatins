import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Share2,
  Check,
  ChevronRight,
  Newspaper,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";
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

function estimateReadTime(text = "", lang = "mr") {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(3, Math.ceil(words / 150));
  if (lang === "mr") {
    return `${toMarathiNumeral(minutes)} मिनिटे वाचन`;
  }
  return `${minutes} min read`;
}

export default function BlogDetail({ slug }) {
  const { t, lang, path } = useLanguage();
  const { data, error, loading } = useApi("/blogs");
  const [copied, setCopied] = useState(false);

  const post = useMemo(() => {
    return data?.find((p) => p.slug === slug);
  }, [data, slug]);

  const relatedPosts = useMemo(() => {
    if (!data) return [];
    return data.filter((p) => p.slug !== slug).slice(0, 3);
  }, [data, slug]);

  if (loading) return <LoadingState />;
  if (error || !post) return <ErrorState />;

  const title = lang === "mr" ? post.titleMr : post.titleEn;
  const content = lang === "mr" ? post.contentMr : post.contentEn;
  const excerpt = lang === "mr" ? post.excerptMr : post.excerptEn;
  const paragraphs = (content || "").split("\n\n").filter(Boolean);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <PageBanner
        title={lang === "mr" ? "लोकमंगल विशेष लेख" : "Lokmangal Article"}
        subtitle={post.publishedDate}
      />

      <article className="bg-[#FAF8F5] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-secondary-text">
            <Link to={path("")} className="hover:text-brand-orange-accent transition">
              {t.nav.home}
            </Link>
            <ChevronRight size={13} className="text-gray-400" />
            <Link to={path("blogs")} className="hover:text-brand-orange-accent transition">
              {lang === "mr" ? "ब्लॉग्स" : "Blogs"}
            </Link>
            <ChevronRight size={13} className="text-gray-400" />
            <span className="truncate max-w-[260px] font-semibold text-brand-green-primary">
              {title}
            </span>
          </nav>

          {/* Article Header Card */}
          <header className="mb-8 rounded-3xl border border-[#E8E3D7] bg-white p-6 sm:p-10 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5 text-xs sm:text-sm text-secondary-text">
              <div className="flex flex-wrap items-center gap-4">
                {post.publishedDate && (
                  <span className="inline-flex items-center gap-1.5 font-bold text-brand-orange-accent">
                    <CalendarDays size={16} />
                    {post.publishedDate}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 font-semibold text-gray-500">
                  <Clock size={16} />
                  {estimateReadTime(content, lang)}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 font-semibold text-brand-green-primary">
                  <Newspaper size={16} className="text-brand-orange-accent" />
                  {lang === "mr" ? "लोकमंगल संपादकीय" : "Lokmangal Editorial"}
                </span>
              </div>

              {/* Share Controls */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    title + "\n" + window.location.href
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-[#25D366]/15 px-3 py-1.5 text-xs font-bold text-[#128C7E] transition hover:bg-[#25D366] hover:text-white"
                >
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 rounded-full border border-[#D5CEBF] bg-gray-50 px-3 py-1.5 text-xs font-bold text-main-text transition hover:bg-gray-100"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-green-600" />
                      <span className="text-green-600 font-bold">
                        {lang === "mr" ? "कॉपी झाले!" : "Copied!"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Share2 size={13} />
                      <span>{lang === "mr" ? "शेअर" : "Share"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <h1 className="mt-6 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-green-primary leading-tight">
              {title}
            </h1>

            {excerpt && (
              <p className="mt-4 border-l-4 border-brand-orange-accent pl-4 text-base sm:text-lg font-medium italic text-secondary-text leading-relaxed">
                "{excerpt}"
              </p>
            )}
          </header>

          {/* Featured Image */}
          {post.imageUrl && (
            <div className="mb-10 overflow-hidden rounded-3xl border border-[#E8E3D7] bg-white shadow-md">
              <img
                src={post.imageUrl}
                alt={title}
                className="max-h-[500px] w-full object-cover"
              />
            </div>
          )}

          {/* Article Main Body Content */}
          <div className="rounded-3xl border border-[#E8E3D7] bg-white p-6 sm:p-12 shadow-xs leading-relaxed text-[#2C3E50]">
            <div className="space-y-6 text-base sm:text-lg">
              {paragraphs.map((p, i) => {
                const trimmed = p.trim();

                // Bullet point lines
                if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
                  const items = trimmed.split("\n").filter(Boolean);
                  return (
                    <ul key={i} className="my-4 space-y-2.5 pl-2 sm:pl-4">
                      {items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-secondary-text">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-orange-accent" />
                          <span>{item.replace(/^[•\-]\s*/, "")}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                // Subheading (short line ending with colon or numbering)
                if (
                  (trimmed.endsWith(":") ||
                    /^[१२३४५६७८९\d]+[\.\)]/.test(trimmed) ||
                    trimmed.length < 50) &&
                  !trimmed.endsWith(".")
                ) {
                  return (
                    <h3
                      key={i}
                      className="mt-8 mb-3 text-xl sm:text-2xl font-extrabold text-brand-green-primary border-b border-gray-100 pb-2"
                    >
                      {trimmed}
                    </h3>
                  );
                }

                return (
                  <p key={i} className="text-secondary-text leading-relaxed text-base sm:text-lg">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Author Attribution Box */}
            <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl bg-[#FAF8F5] p-6 text-center border border-[#ECE7DA] sm:flex-row sm:text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-green-primary text-white shadow-xs">
                <BookOpen size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-brand-green-primary">
                  {lang === "mr" ? "लोकमंगल फाऊंडेशन, सोलापूर" : "Lokmangal Foundation, Solapur"}
                </h4>
                <p className="text-xs sm:text-sm text-secondary-text mt-1">
                  {lang === "mr"
                    ? "गेल्या अनेक दशकांपासून ग्रामीण विकास, जलसंधारण, शिक्षण आणि सामुदायिक सेवाकार्यात कार्यरत असलेली आघाडीची सामाजिक संस्था."
                    : "Dedicated to rural development, water conservation, education, and community social empowerment for decades."}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6">
              <Link
                to={path("blogs")}
                className="inline-flex items-center gap-2 rounded-full border border-brand-green-primary/30 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-brand-green-primary shadow-xs transition hover:bg-brand-green-primary hover:text-white"
              >
                <ArrowLeft size={16} />
                {lang === "mr" ? "सर्व लेख यादीकडे परत" : "Back to all articles"}
              </Link>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange-accent px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-[#D97A14]"
              >
                <Share2 size={15} />
                {lang === "mr" ? "लेख शेअर करा" : "Share Article"}
              </button>
            </div>
          </div>

          {/* RELATED ARTICLES SECTION */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="mb-6 text-xl sm:text-2xl font-extrabold text-brand-green-primary">
                {lang === "mr" ? "इतर संबंधित लेख" : "Related Articles"}
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((rel) => {
                  const relTitle = lang === "mr" ? rel.titleMr : rel.titleEn;
                  const relExcerpt = lang === "mr" ? rel.excerptMr : rel.excerptEn;
                  return (
                    <article
                      key={rel.id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8E3D7] bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:border-brand-green-medium hover:shadow-md"
                    >
                      <Link
                        to={path(`blogs/${rel.slug}`)}
                        className="relative block h-40 w-full overflow-hidden bg-gray-100"
                      >
                        {rel.imageUrl ? (
                          <img
                            src={rel.imageUrl}
                            alt={relTitle}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-brand-green-primary/5">
                            <Newspaper size={28} className="text-brand-green-medium/50" />
                          </div>
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <span className="text-[11px] font-bold text-brand-orange-accent">
                            {rel.publishedDate}
                          </span>
                          <h4 className="mt-1 text-sm font-bold text-brand-green-primary transition group-hover:text-brand-orange-accent line-clamp-2">
                            <Link to={path(`blogs/${rel.slug}`)}>{relTitle}</Link>
                          </h4>
                          <p className="mt-2 text-xs text-secondary-text line-clamp-2">
                            {relExcerpt}
                          </p>
                        </div>
                        <Link
                          to={path(`blogs/${rel.slug}`)}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand-orange-accent group-hover:underline"
                        >
                          {lang === "mr" ? "वाचा" : "Read"} <ArrowRight size={12} />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}

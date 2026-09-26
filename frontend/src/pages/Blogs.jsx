import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Search,
  X,
  Sparkles,
  Newspaper,
  BookOpen,
} from "lucide-react";
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

function estimateReadTime(text = "", lang = "mr") {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(3, Math.ceil(words / 150));
  if (lang === "mr") {
    return `${toMarathiNumeral(minutes)} मिनिटे वाचन`;
  }
  return `${minutes} min read`;
}

export default function Blogs() {
  const { t, lang, path } = useLanguage();
  const b = useSiteContent("blogs") ?? t.pages.blogs;
  const { data, error, loading } = useApi("/blogs");

  const [searchQuery, setSearchQuery] = useState("");

  const posts = useMemo(() => {
    return data ?? [];
  }, [data]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const title = (lang === "mr" ? p.titleMr : p.titleEn) || "";
      const excerpt = (lang === "mr" ? p.excerptMr : p.excerptEn) || "";
      const content = (lang === "mr" ? p.contentMr : p.contentEn) || "";
      return (
        title.toLowerCase().includes(q) ||
        excerpt.toLowerCase().includes(q) ||
        content.toLowerCase().includes(q)
      );
    });
  }, [posts, searchQuery, lang]);

  const isSearching = searchQuery.trim().length > 0;
  const latestPost = !isSearching && posts.length > 0 ? posts[0] : null;
  const secondaryPosts = !isSearching && posts.length > 0 ? posts.slice(1) : filteredPosts;

  return (
    <>
      <PageBanner
        title={lang === "mr" ? "लोकमंगल विचार मंच व लेख" : (b.title || "Our Blogs & Articles")}
        subtitle={
          lang === "mr"
            ? "ग्रामीण विकास, जलसंधारण, शिक्षण व सामाजिक परिवर्तनाची प्रेरक यशोगाथा"
            : (b.subtitle || "Stories of rural prosperity, education and social transformation")
        }
      />

      <section className="bg-[#FAF8F5] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading && <LoadingState />}
          {error && <ErrorState />}

          {!loading && !error && (
            <>
              {/* Top Search & Filter Bar */}
              <div className="mb-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#E8E3D7] bg-white p-4 shadow-xs sm:flex-row sm:px-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-primary/10 text-brand-green-primary">
                    <BookOpen size={18} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-main-text sm:text-base">
                      {lang === "mr" ? "सर्व अधिकृत ब्लॉग्स" : "All Official Blogs"}
                    </h3>
                    <p className="text-xs text-secondary-text">
                      {lang === "mr"
                        ? `एकूण ${toMarathiNumeral(posts.length)} प्रेरक लेख व यशोगाथा उपलब्ध`
                        : `Total ${posts.length} insightful articles published`}
                    </p>
                  </div>
                </div>

                <div className="relative w-full sm:w-80">
                  <Search
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      lang === "mr"
                        ? "लेखांचे शीर्षक किंवा विषय शोधा..."
                        : "Search blogs by title or topic..."
                    }
                    className="w-full rounded-full border border-[#D5CEBF] bg-[#FAF8F5] py-2.5 pl-10 pr-9 text-xs sm:text-sm text-main-text placeholder-gray-400 transition focus:border-brand-green-primary focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-green-primary/20"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* LATEST FEATURED BLOG (Large, At the Very Top) */}
              {latestPost && (
                <div className="mb-14">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange-accent/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange-accent">
                      <Sparkles size={14} />
                      {lang === "mr" ? "नवीनतम विशेष लेख" : "Latest Featured Story"}
                    </span>
                    <span className="text-xs font-semibold text-secondary-text">
                      {estimateReadTime(
                        lang === "mr" ? latestPost.contentMr : latestPost.contentEn,
                        lang
                      )}
                    </span>
                  </div>

                  <div className="group relative overflow-hidden rounded-3xl border border-[#E4DFD2] bg-white shadow-md transition duration-500 hover:border-brand-green-medium hover:shadow-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                      {/* Left: Big Hero Image */}
                      <div className="relative h-72 sm:h-96 lg:col-span-7 lg:h-[430px] overflow-hidden bg-gray-100">
                        {latestPost.imageUrl ? (
                          <img
                            src={latestPost.imageUrl}
                            alt={lang === "mr" ? latestPost.titleMr : latestPost.titleEn}
                            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-brand-green-primary/5">
                            <Newspaper size={64} className="text-brand-green-medium/40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                      </div>

                      {/* Right: Rich Content Details */}
                      <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 lg:p-10">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-secondary-text">
                            {latestPost.publishedDate && (
                              <span className="inline-flex items-center gap-1.5 font-bold text-brand-orange-accent">
                                <CalendarDays size={14} />
                                {latestPost.publishedDate}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 font-semibold">
                              <Clock size={14} className="text-gray-400" />
                              {estimateReadTime(
                                lang === "mr" ? latestPost.contentMr : latestPost.contentEn,
                                lang
                              )}
                            </span>
                          </div>

                          <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-green-primary transition duration-300 group-hover:text-brand-orange-accent leading-snug">
                            <Link to={path(`blogs/${latestPost.slug}`)}>
                              {lang === "mr" ? latestPost.titleMr : latestPost.titleEn}
                            </Link>
                          </h2>

                          <p className="mt-4 text-sm sm:text-base text-secondary-text leading-relaxed line-clamp-4">
                            {lang === "mr" ? latestPost.excerptMr : latestPost.excerptEn}
                          </p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-500">
                            {lang === "mr" ? "लोकमंगल संपादकीय चमू" : "Lokmangal Editorial"}
                          </span>

                          <Link
                            to={path(`blogs/${latestPost.slug}`)}
                            className="inline-flex items-center gap-2 rounded-full bg-brand-orange-accent px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#D97A14] hover:shadow-md"
                          >
                            {lang === "mr" ? "संपूर्ण लेख वाचा" : "Read Full Story"}
                            <ArrowRight size={15} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* REMAINING BLOGS SECTION (New Look Modern Grid) */}
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-extrabold text-brand-green-primary">
                    {isSearching
                      ? lang === "mr"
                        ? `शोधाचे निकाल (${toMarathiNumeral(filteredPosts.length)})`
                        : `Search Results (${filteredPosts.length})`
                      : lang === "mr"
                      ? "इतर सर्व लेख व उपक्रम यशोगाथा"
                      : "More Articles & Stories"}
                  </h3>
                  {isSearching && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-xs font-bold text-brand-orange-accent hover:underline"
                    >
                      {lang === "mr" ? "सर्व लेख पहा" : "Clear filter"}
                    </button>
                  )}
                </div>

                {secondaryPosts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#D5CEBF] bg-white p-12 text-center">
                    <Newspaper size={40} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-base font-bold text-main-text">
                      {lang === "mr" ? "कोणतेही लेख आढळले नाहीत" : "No articles found"}
                    </p>
                    <p className="mt-1 text-sm text-secondary-text">
                      {lang === "mr"
                        ? "कृपया वेगळा शोध शब्द वापरून पहा किंवा सर्व लेख पाहण्यासाठी फिल्टर साफ करा."
                        : "Try a different search term or clear the filter to view all blogs."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                    {secondaryPosts.map((post) => {
                      const title = lang === "mr" ? post.titleMr : post.titleEn;
                      const excerpt = lang === "mr" ? post.excerptMr : post.excerptEn;
                      const content = lang === "mr" ? post.contentMr : post.contentEn;

                      return (
                        <article
                          key={post.id}
                          className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8E3D7] bg-white shadow-xs transition duration-300 hover:-translate-y-1.5 hover:border-brand-green-medium hover:shadow-xl"
                        >
                          <Link
                            to={path(`blogs/${post.slug}`)}
                            className="relative block h-52 sm:h-56 w-full overflow-hidden bg-gray-100"
                          >
                            {post.imageUrl ? (
                              <img
                                src={post.imageUrl}
                                alt={title}
                                className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-108"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-brand-green-primary/5">
                                <Newspaper size={36} className="text-brand-green-medium/50" />
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

                            {post.publishedDate && (
                              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                                <CalendarDays size={12} className="text-brand-orange-accent" />
                                {post.publishedDate}
                              </span>
                            )}
                          </Link>

                          <div className="flex flex-1 flex-col justify-between p-6">
                            <div>
                              <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-secondary-text">
                                <span className="inline-flex items-center gap-1 text-brand-green-primary font-bold">
                                  <Newspaper size={12} className="text-brand-orange-accent" />
                                  {lang === "mr" ? "लोकमंगल विशेष" : "Editorial"}
                                </span>
                                <span>{estimateReadTime(content, lang)}</span>
                              </div>

                              <h4 className="text-base sm:text-lg font-bold text-brand-green-primary transition group-hover:text-brand-orange-accent line-clamp-2 leading-snug">
                                <Link to={path(`blogs/${post.slug}`)}>{title}</Link>
                              </h4>

                              <p className="mt-2.5 text-xs sm:text-sm text-secondary-text line-clamp-3 leading-relaxed">
                                {excerpt}
                              </p>
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                              <Link
                                to={path(`blogs/${post.slug}`)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange-accent transition hover:text-[#D97A14]"
                              >
                                {lang === "mr" ? "सविस्तर वाचा" : "Read More"}
                                <ArrowRight
                                  size={13}
                                  className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                              </Link>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

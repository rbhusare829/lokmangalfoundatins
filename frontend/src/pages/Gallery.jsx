import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Images,
  ExternalLink,
  Sparkles,
  Search,
} from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";
import { useSiteContent } from "../lib/SiteContentContext.jsx";
import { useApi } from "../lib/useApi.js";
import { CATEGORY_TO_PROJECT_SLUG } from "../lib/projectGalleryCategories.js";
import PageBanner from "../components/ui/PageBanner.jsx";
import { LoadingState, ErrorState } from "../components/ui/AsyncState.jsx";
import { formatYouTubeEmbedUrl } from "../lib/format.js";

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

export default function Gallery() {
  const { t, lang, path } = useLanguage();
  const g = useSiteContent("gallery") ?? t.pages.gallery;
  const { data, error, loading } = useApi("/gallery");
  const { data: projects } = useApi("/projects");

  const [searchParams, setSearchParams] = useSearchParams();
  const activeAlbumKey = searchParams.get("album");

  const [searchAlbumQuery, setSearchAlbumQuery] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Group photos into Albums by category
  const albums = useMemo(() => {
    if (!data) return [];
    const grouped = {};
    for (const img of data) {
      if (!grouped[img.category]) {
        grouped[img.category] = [];
      }
      grouped[img.category].push(img);
    }

    // Preferred presentation order for key initiatives
    const priorityOrder = [
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

    const sortedKeys = Object.keys(grouped).sort((a, b) => {
      const idxA = priorityOrder.indexOf(a);
      const idxB = priorityOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return sortedKeys.map((catKey) => {
      const photos = [...grouped[catKey]].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      const projectSlug = CATEGORY_TO_PROJECT_SLUG[catKey];
      const project = (projects ?? []).find((p) => p.slug === projectSlug);
      const title = t.galleryCategories?.[catKey] ?? prettifyCategory(catKey);

      return {
        key: catKey,
        title,
        photos,
        count: photos.length,
        coverPhoto: photos[0],
        project,
        projectSlug,
      };
    });
  }, [data, projects, t]);

  const activeAlbum = useMemo(() => {
    if (!activeAlbumKey) return null;
    return albums.find((a) => a.key === activeAlbumKey) || null;
  }, [albums, activeAlbumKey]);

  // Filtered albums for search in the main albums view
  const filteredAlbums = useMemo(() => {
    const q = searchAlbumQuery.trim().toLowerCase();
    if (!q) return albums;
    return albums.filter((a) => a.title.toLowerCase().includes(q));
  }, [albums, searchAlbumQuery]);

  const totalPhotosCount = useMemo(() => {
    return (data ?? []).length;
  }, [data]);

  const formatNumber = useCallback(
    (n) => (lang === "mr" ? toMarathiNumeral(n) : String(n)),
    [lang]
  );

  const openAlbum = (albumKey) => {
    setSearchParams({ album: albumKey });
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  const closeAlbum = () => {
    setSearchParams({});
    setLightboxIndex(null);
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback(
    (e) => {
      if (lightboxIndex === null || !activeAlbum) return;
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : activeAlbum.photos.length - 1));
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev < activeAlbum.photos.length - 1 ? prev + 1 : 0));
      }
    },
    [lightboxIndex, activeAlbum]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const currentLightboxPhoto =
    activeAlbum && lightboxIndex !== null ? activeAlbum.photos[lightboxIndex] : null;

  return (
    <>
      <PageBanner
        title={activeAlbum ? activeAlbum.title : (g.title || (lang === "mr" ? "आमची छायाचित्रे" : "Our Gallery"))}
      />

      <section className="bg-gradient-to-b from-[#F9F7F2] via-white to-[#F6F8F6] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4">
          {loading && <LoadingState />}
          {error && <ErrorState />}

          {!loading && !error && (
            <>
              {/* ========================================================
                  VIEW 1: ALL ALBUMS CATALOG (Default View)
                 ======================================================== */}
              {!activeAlbum && (
                <div>
                  {/* Albums Header Banner */}
                  <div className="mx-auto mb-10 max-w-3xl text-center">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-green-primary">
                      <Images size={14} className="text-brand-orange-accent" />
                      {g.albumsTitle || (lang === "mr" ? "फोटो अल्बम्स" : "Photo Albums")}
                    </span>

                    <h2 className="mt-3 text-2xl font-extrabold text-brand-green-primary sm:text-3xl md:text-4xl">
                      {lang === "mr" ? "उपक्रमानुसार फोटो अल्बम्स" : "Initiative Photo Albums"}
                    </h2>

                    <p className="mt-2 text-sm text-secondary-text sm:text-base">
                      {g.subtitle || (lang === "mr" ? "महाराष्ट्रभर सुरू असलेल्या आमच्या कार्याची झलक. अल्बम निवडून सर्व छायाचित्रे पहा." : "A glimpse into our initiatives across Maharashtra. Select an album to view its photos.")}
                    </p>

                    {/* Stats & Search Bar */}
                    <div className="mt-7 flex flex-col items-center justify-between gap-4 sm:flex-row">
                      <div className="inline-flex items-center gap-2 rounded-full border border-light-green-tint bg-white px-4 py-1.5 text-xs font-bold text-brand-green-primary shadow-2xs">
                        <Sparkles size={14} className="text-brand-orange-accent" />
                        <span>
                          {formatNumber(albums.length)} {lang === "mr" ? "अल्बम्स" : "Albums"}
                        </span>
                        <span>•</span>
                        <span>
                          {formatNumber(totalPhotosCount)} {g.photosCount || (lang === "mr" ? "छायाचित्रे" : "Photos")}
                        </span>
                      </div>

                      {albums.length > 6 && (
                        <div className="relative w-full sm:w-72">
                          <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="text"
                            value={searchAlbumQuery}
                            onChange={(e) => setSearchAlbumQuery(e.target.value)}
                            placeholder={lang === "mr" ? "अल्बम शोधा..." : "Search albums..."}
                            className="w-full rounded-full border border-[#E8E3D7] bg-white py-2 pl-9 pr-4 text-xs font-medium text-main-text placeholder-gray-400 shadow-2xs outline-none transition focus:border-brand-green-medium focus:ring-2 focus:ring-brand-green-primary/10"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Albums Grid */}
                  <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredAlbums.map((album) => {
                      return (
                        <div
                          key={album.key}
                          onClick={() => openAlbum(album.key)}
                          className="group relative cursor-pointer"
                        >
                          {/* Stacked photo layers effect */}
                          <div className="absolute inset-0 -top-1.5 left-2 right-2 rounded-2xl border border-[#E4DFD2] bg-white/70 shadow-xs transition-transform duration-300 group-hover:-top-3 group-hover:rotate-1" />
                          <div className="absolute inset-0 -top-0.5 left-1 right-1 rounded-2xl border border-[#E4DFD2] bg-white/90 shadow-xs transition-transform duration-300 group-hover:-top-1.5 group-hover:-rotate-1" />

                          {/* Top Album Card */}
                          <div className="relative overflow-hidden rounded-2xl border border-[#E4DFD2] bg-white shadow-[0_4px_16px_rgba(20,67,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-brand-green-medium hover:shadow-[0_16px_32px_rgba(20,67,42,0.14)]">
                            {/* Album Cover Photo */}
                            <div className="relative h-56 w-full overflow-hidden bg-gray-100 sm:h-60">
                              {album.coverPhoto ? (
                                <img
                                  src={album.coverPhoto.imageUrl}
                                  alt={album.title}
                                  loading="lazy"
                                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-108"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-light-green-tint">
                                  <Images size={36} className="text-brand-green-medium" />
                                </div>
                              )}

                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                              {/* Photo Count Badge */}
                              <span className="absolute right-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md">
                                <Images size={13} className="text-brand-orange-accent" />
                                {formatNumber(album.count)} {g.photosCount || (lang === "mr" ? "छायाचित्रे" : "Photos")}
                              </span>

                              {/* Album Title overlaid on cover bottom */}
                              <div className="absolute bottom-0 inset-x-0 p-4">
                                <h3 className="text-lg font-extrabold text-white drop-shadow-md sm:text-xl">
                                  {album.title}
                                </h3>
                              </div>
                            </div>

                            {/* Card Bottom / Action Area */}
                            <div className="flex items-center justify-between border-t border-gray-100 bg-white px-5 py-3.5">
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green-primary">
                                <FolderOpen size={16} className="text-brand-orange-accent" />
                                {g.openAlbum || (lang === "mr" ? "अल्बम उघडा" : "Open Album")}
                              </span>
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-light-green-tint text-brand-green-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-brand-orange-accent group-hover:text-white">
                                <ArrowRight size={16} />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ========================================================
                  VIEW 2: SELECTED ALBUM DETAIL (Photos inside Album)
                 ======================================================== */}
              {activeAlbum && (
                <div>
                  {/* Top Bar with Back Button & Breadcrumbs */}
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
                    <button
                      onClick={closeAlbum}
                      className="inline-flex items-center gap-2 rounded-full border border-brand-green-primary/30 bg-white px-5 py-2.5 text-xs font-bold text-brand-green-primary shadow-xs transition hover:bg-brand-green-primary hover:text-white"
                    >
                      <ArrowLeft size={16} />
                      {g.backToAlbums || (lang === "mr" ? "सर्व अल्बम्स" : "All Albums")}
                    </button>

                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-secondary-text">
                      <span
                        onClick={closeAlbum}
                        className="cursor-pointer hover:text-brand-green-primary hover:underline"
                      >
                        {g.title || (lang === "mr" ? "छायाचित्रे" : "Gallery")}
                      </span>
                      <span>/</span>
                      <span className="font-bold text-brand-green-primary">{activeAlbum.title}</span>
                    </div>
                  </div>

                  {/* Album Header Banner */}
                  <div className="mb-8 rounded-3xl border border-[#E8E3D7] bg-white p-6 shadow-xs sm:p-8">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-extrabold text-brand-green-primary sm:text-3xl">
                            {activeAlbum.title}
                          </h2>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange-accent/15 px-3 py-1 text-xs font-bold text-[#A85800]">
                            <Images size={14} />
                            {formatNumber(activeAlbum.count)} {g.photosCount || (lang === "mr" ? "छायाचित्रे" : "Photos")}
                          </span>
                        </div>

                        {activeAlbum.project && (
                          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-secondary-text sm:text-base">
                            {lang === "mr" ? activeAlbum.project.summaryMr : activeAlbum.project.summaryEn}
                          </p>
                        )}
                      </div>

                      {activeAlbum.projectSlug && (
                        <div className="shrink-0">
                          <Link
                            to={path(`projects/${activeAlbum.projectSlug}`)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-brand-green-primary px-5 py-2 text-xs font-bold text-brand-green-primary transition hover:bg-brand-green-primary hover:text-white"
                          >
                            {g.readProjectDetails || (lang === "mr" ? "या उपक्रमाची सविस्तर माहिती" : "View Project Details")}{" "}
                            <ExternalLink size={13} />
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Embedded Project Video if available */}
                    {activeAlbum.project?.videoUrl && (
                      <div className="mt-6 aspect-video w-full max-w-2xl overflow-hidden rounded-2xl shadow-md">
                        <iframe
                          src={formatYouTubeEmbedUrl(activeAlbum.project.videoUrl)}
                          title={activeAlbum.title}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>

                  {/* Quick Album Switcher Strip */}
                  <div className="mb-8">
                    <div className="mb-2 text-xs font-bold uppercase tracking-wider text-secondary-text">
                      {lang === "mr" ? "इतर अल्बम्स:" : "Other Albums:"}
                    </div>
                    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
                      {albums.map((alb) => (
                        <button
                          key={alb.key}
                          onClick={() => openAlbum(alb.key)}
                          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                            alb.key === activeAlbum.key
                              ? "bg-brand-orange-accent text-orange-btn-text shadow-xs"
                              : "border border-[#E4DFD2] bg-white text-main-text hover:border-brand-green-medium hover:text-brand-green-primary"
                          }`}
                        >
                          {alb.title} ({formatNumber(alb.count)})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Album Photos Grid */}
                  <motion.div
                    layout
                    className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                  >
                    <AnimatePresence mode="popLayout">
                      {activeAlbum.photos.map((img, i) => {
                        const title = lang === "mr" ? img.titleMr : img.titleEn;
                        return (
                          <motion.figure
                            key={img.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: i * 0.02 }}
                            onClick={() => setLightboxIndex(i)}
                            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E8E3D7] bg-white shadow-2xs transition duration-300 hover:-translate-y-1 hover:border-brand-green-medium hover:shadow-md"
                          >
                            <div className="h-48 w-full overflow-hidden bg-gray-100 sm:h-56">
                              <img
                                src={img.imageUrl}
                                alt={title}
                                className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-108"
                                loading="lazy"
                              />
                            </div>

                            {/* Caption overlay */}
                            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/25 to-transparent p-3.5 opacity-0 transition duration-300 group-hover:opacity-100">
                              <p className="line-clamp-2 text-xs font-bold leading-snug text-white">
                                {title}
                              </p>
                              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-orange-accent">
                                <Images size={12} />
                                {formatNumber(i + 1)} / {formatNumber(activeAlbum.photos.length)}
                              </span>
                            </div>
                          </motion.figure>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ========================================================
          FULLSCREEN LIGHTBOX MODAL WITH NAVIGATION
         ======================================================== */}
      <AnimatePresence>
        {currentLightboxPhoto && activeAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white hover:text-brand-green-primary"
            >
              <X size={22} />
            </button>

            {/* Prev Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev > 0 ? prev - 1 : activeAlbum.photos.length - 1
                );
              }}
              aria-label="Previous Photo"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white hover:text-brand-green-primary"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) =>
                  prev < activeAlbum.photos.length - 1 ? prev + 1 : 0
                );
              }}
              aria-label="Next Photo"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-white hover:text-brand-green-primary"
            >
              <ChevronRight size={24} />
            </button>

            {/* Photo Container */}
            <motion.div
              key={currentLightboxPhoto.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] max-w-4xl text-center"
            >
              <img
                src={currentLightboxPhoto.imageUrl}
                alt={lang === "mr" ? currentLightboxPhoto.titleMr : currentLightboxPhoto.titleEn}
                className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl mx-auto"
              />

              <div className="mt-4 flex flex-col items-center justify-center gap-1 text-white">
                <p className="text-sm sm:text-base font-bold">
                  {lang === "mr" ? currentLightboxPhoto.titleMr : currentLightboxPhoto.titleEn}
                </p>
                <span className="text-xs font-semibold text-white/70">
                  {activeAlbum.title} • {formatNumber(lightboxIndex + 1)} {g.photoOf || (lang === "mr" ? "पैकी" : "of")} {formatNumber(activeAlbum.photos.length)}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

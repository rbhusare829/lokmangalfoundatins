import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2,
  Video,
  Image as ImageIcon,
  ArrowLeft,
  Heart,
  Target,
  FileText,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";
import { useApi } from "../lib/useApi.js";
import { asset } from "../lib/assetUrl.js";
import { PROJECT_GALLERY_CATEGORY } from "../lib/projectGalleryCategories.js";
import PageBanner from "../components/ui/PageBanner.jsx";
import { LoadingState, ErrorState } from "../components/ui/AsyncState.jsx";

const FALLBACK_SLIDER_IMAGES = {
  "lokmangal-annapurna-yojana": "slider/annapoorna-yojana.jpg",
  "jalsandharan-project": "slider/jalsandharan-project.jpg",
  "vidyadaan-yojana": "slider/vidyadaan-yojana.jpg",
  "samudayik-vivah-sohala": "slider/samudayik-vivah-sohala.jpg",
};

function Paragraphs({ text }) {
  const lines = (text || "").split("\n").filter(Boolean);
  return (
    <ul className="space-y-2.5">
      {lines.map((line, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-secondary-text">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-green-primary" />
          <span className="leading-relaxed">{line}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ProjectDetail({ slug: propSlug }) {
  const params = useParams();
  const slug = propSlug || params.slug;

  const { t, lang, path } = useLanguage();
  const { data, error, loading } = useApi("/projects");
  const { data: galleryData } = useApi("/gallery");

  const project = data?.find((p) => p.slug === slug);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!project) return <ErrorState />;

  const title = lang === "mr" ? project.titleMr : project.titleEn;
  const objective = lang === "mr" ? project.objectiveMr : project.objectiveEn;
  const description = lang === "mr" ? project.descriptionMr : project.descriptionEn;
  const stat = lang === "mr" ? project.statMr : project.statEn;
  const descriptionParagraphs = (description || "").split("\n\n").filter(Boolean);
  const objectiveIsList = (objective || "").includes("\n");

  const galleryCategory = PROJECT_GALLERY_CATEGORY[slug];
  const relatedPhotos = galleryCategory
    ? (galleryData ?? []).filter((g) => g.category === galleryCategory)
    : [];

  // Determine cover image URL (database coverImageUrl or fallback slider image)
  let coverImgSrc = null;
  if (project.coverImageUrl) {
    coverImgSrc = project.coverImageUrl;
  } else if (FALLBACK_SLIDER_IMAGES[slug]) {
    coverImgSrc = asset(FALLBACK_SLIDER_IMAGES[slug]);
  }

  return (
    <>
      <PageBanner title={title} />

      <section className="bg-[#FAF8F5] py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4">
          {/* Back Link Breadcrumb */}
          <div className="mb-6">
            <Link
              to={path("projects")}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-green-primary hover:text-brand-green-medium transition-colors"
            >
              <ArrowLeft size={16} />
              <span>{lang === "mr" ? "सर्व उपक्रमांकडे परत जा" : "Back to All Projects"}</span>
            </Link>
          </div>

          {/* Main Card Container */}
          <div className="overflow-hidden rounded-3xl border border-[#ECE7DA] bg-white p-6 shadow-sm sm:p-10">
            {/* Header Title & Stat Pill */}
            <div className="border-b border-[#F2ECE1] pb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-green-primary">
                    <Sparkles size={13} className="text-brand-orange-accent" />
                    {lang === "mr" ? "लोकमंगल उपक्रम" : "Lokmangal Initiative"}
                  </span>
                  <h1 className="mt-3 text-2xl font-extrabold text-brand-green-primary sm:text-3xl md:text-4xl">
                    {title}
                  </h1>
                </div>

                {stat && (
                  <div className="rounded-2xl border border-brand-orange-accent/30 bg-light-orange-tint px-4 py-2 text-center shadow-xs">
                    <span className="block text-[11px] font-bold uppercase tracking-wide text-brand-orange-accent">
                      {lang === "mr" ? "प्रमुख उपलब्धी" : "Key Impact"}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-orange-icon">
                      {stat}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 1. Cover Photo (If Available) */}
            {coverImgSrc && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-[#ECE7DA] shadow-xs">
                <img
                  src={coverImgSrc}
                  alt={title}
                  className="max-h-[460px] w-full object-cover"
                />
              </div>
            )}

            {/* 2. Objective / ध्येय आणि उद्दिष्टे */}
            {objective && (
              <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-white to-light-green-tint/30 p-6 sm:p-7">
                <div className="flex items-center gap-2 text-brand-green-primary">
                  <Target size={20} className="text-brand-orange-accent" />
                  <h2 className="text-lg font-extrabold sm:text-xl">
                    {t.pages.projectDetail.objective || (lang === "mr" ? "ध्येय आणि उद्दिष्ट" : "Mission & Objective")}
                  </h2>
                </div>
                <div className="mt-3 text-sm sm:text-base leading-relaxed text-secondary-text">
                  {objectiveIsList ? (
                    <Paragraphs text={objective} />
                  ) : (
                    <p className="leading-relaxed">{objective}</p>
                  )}
                </div>
              </div>
            )}

            {/* 3. Detailed Description / सविस्तर माहिती */}
            {descriptionParagraphs.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center gap-2 border-b border-[#F2ECE1] pb-3 text-brand-green-primary">
                  <FileText size={20} className="text-brand-green-primary" />
                  <h2 className="text-lg font-extrabold sm:text-xl">
                    {t.pages.projectDetail.whyHow || (lang === "mr" ? "सविस्तर माहिती व कार्यपद्धती" : "Detailed Overview")}
                  </h2>
                </div>
                <div className="mt-5 space-y-4 text-sm sm:text-base leading-relaxed text-secondary-text">
                  {descriptionParagraphs.map((p, i) => (
                    <p key={i} className="leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Video Showcase Section (If videoUrl is present) */}
            {project.videoUrl && (
              <div className="mt-12 rounded-3xl border border-[#ECE7DA] bg-[#FBF9F5] p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-2 text-brand-green-primary">
                  <Video size={22} className="text-red-600" />
                  <h2 className="text-lg font-extrabold sm:text-xl">
                    {lang === "mr" ? "उपक्रमाचा माहितीपट (व्हिडिओ)" : "Project Video Showcase"}
                  </h2>
                </div>
                <div className="aspect-video w-full overflow-hidden rounded-2xl shadow-md">
                  <iframe
                    src={project.videoUrl}
                    title={title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* 5. Related Photo Gallery (If photos exist) */}
            {relatedPhotos.length > 0 && (
              <div className="mt-12">
                <div className="mb-5 flex items-center gap-2 border-b border-[#F2ECE1] pb-3 text-brand-green-primary">
                  <ImageIcon size={20} className="text-brand-orange-accent" />
                  <h2 className="text-lg font-extrabold sm:text-xl">
                    {t.pages.projectDetail.photos || (lang === "mr" ? "उपक्रमाची छायाचित्रे" : "Photo Gallery")}
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {relatedPhotos.map((g) => (
                    <div
                      key={g.id}
                      className="group overflow-hidden rounded-2xl border border-[#ECE7DA] shadow-xs"
                    >
                      <img
                        src={g.imageUrl}
                        alt={lang === "mr" ? g.titleMr : g.titleEn}
                        className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-44"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Navigation Buttons */}
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#F2ECE1] pt-6">
              <Link
                to={path("projects")}
                className="inline-flex items-center gap-2 rounded-full border border-brand-green-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-brand-green-primary transition hover:bg-light-green-tint"
              >
                <ArrowLeft size={16} />
                <span>{lang === "mr" ? "सर्व उपक्रम पहा" : "View All Projects"}</span>
              </Link>

              <Link
                to={path("contribute")}
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange-accent px-7 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:bg-[#D97A14]"
              >
                <Heart size={16} />
                <span>{lang === "mr" ? "या उपक्रमास हातभार लावा" : "Support this Project"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

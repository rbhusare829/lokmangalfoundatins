import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext.jsx";
import { asset } from "../../lib/assetUrl.js";

// Large showcase card for one of the four flagship initiatives (see
// FEATURED_CARDS in lib/projectCatalog.js). Used on the Projects and Home pages.
export default function FeaturedProjectCard({ card }) {
  const { lang, path } = useLanguage();
  const title = lang === "mr" ? card.titleMr : card.titleEn;
  const text = lang === "mr" ? card.textMr : card.textEn;
  const tag = lang === "mr" ? card.tagMr : card.tagEn;
  const badge = lang === "mr" ? card.badgeMr : card.badgeEn;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E9E4D8] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-2 hover:border-brand-green-medium hover:shadow-[0_20px_40px_rgba(20,67,42,0.12)]">
      <div>
        {/* Visual Media Header */}
        <div className="relative h-52 w-full overflow-hidden bg-gray-100">
          <img
            src={asset(card.image)}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Roman Numeral & Tag Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand-green-primary/95 text-xs font-extrabold text-white shadow-sm backdrop-blur-md">
              {card.numeral}
            </span>
            <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-brand-green-primary shadow-xs backdrop-blur-md">
              {tag}
            </span>
          </div>

          {/* Highlight Badge on Image */}
          {badge && (
            <span className="absolute right-3 bottom-3 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-semibold text-white shadow-xs backdrop-blur-md">
              {badge}
            </span>
          )}
        </div>

        {/* Card Content */}
        <div className="p-6">
          <h3 className="text-base font-extrabold text-brand-green-primary transition-colors group-hover:text-brand-orange-accent sm:text-lg">
            {title}
          </h3>
          <p className="mt-3 text-xs leading-relaxed text-secondary-text sm:text-sm">{text}</p>
        </div>
      </div>

      {/* Card Action Link */}
      <div className="border-t border-[#F2ECE1] p-6 pt-4">
        <Link
          to={path(`projects/${card.slug}`)}
          className="inline-flex w-full items-center justify-between rounded-xl bg-brand-orange-accent/10 px-4 py-2.5 text-xs font-bold text-brand-orange-accent transition-all duration-200 group-hover:bg-brand-orange-accent group-hover:text-white group-hover:shadow-md sm:text-sm cursor-pointer"
        >
          <span>{lang === "mr" ? "अधिक वाचा" : "Read More"}</span>
          <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

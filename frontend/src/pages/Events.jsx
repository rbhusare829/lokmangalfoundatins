import { CalendarDays } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";
import { useSiteContent } from "../lib/SiteContentContext.jsx";
import { useApi } from "../lib/useApi.js";
import PageBanner from "../components/ui/PageBanner.jsx";
import { LoadingState, ErrorState } from "../components/ui/AsyncState.jsx";

export default function Events() {
  const { t, lang } = useLanguage();
  const ev = useSiteContent("events") ?? t.pages.events;
  const { data, error, loading } = useApi("/events");

  return (
    <>
      <PageBanner title={ev.title} />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <p className="mb-10 text-center text-secondary-text">{ev.subtitle}</p>

          {loading && <LoadingState />}
          {error && <ErrorState />}

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((ev) => {
                const title = lang === "mr" ? ev.titleMr : ev.titleEn;
                const description = lang === "mr" ? ev.descriptionMr : ev.descriptionEn;
                return (
                  <div
                    key={ev.id}
                    className="group overflow-hidden rounded-2xl bg-card-bg shadow-[0_4px_15px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(20,67,42,0.18)]"
                  >
                    <div className="relative overflow-hidden">
                      {ev.imageUrl ? (
                        <img
                          src={ev.imageUrl}
                          alt={title}
                          className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
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
                          {t.home.viewDetails}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

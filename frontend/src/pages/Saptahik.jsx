import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, CalendarDays, ChevronRight, Download, Library, Newspaper } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";
import { useSiteContent } from "../lib/SiteContentContext.jsx";
import { useApi } from "../lib/useApi.js";
import { loadPdfjs } from "../lib/pdf.js";
import { formatDate, localNumber, weekOfMonth } from "../lib/format.js";
import { LoadingState, ErrorState } from "../components/ui/AsyncState.jsx";
import IssueReader from "../components/saptahik/IssueReader.jsx";

const NAVBAR_HEIGHT = 72;

const yearOf = (issue) => Number(issue.issueDate.slice(0, 4));
const warmPdfjs = () => loadPdfjs().catch(() => {});

// The issue's own title, if the admin gave it one; most issues are known
// simply by their date and week.
function issueTitle(issue, lang) {
  return (lang === "en" && issue.titleEn) || issue.titleMr || "";
}

// Newest first: [{ year, count, months: [{ key: "2026-09", issues }] }].
function groupByYearAndMonth(issues) {
  const years = [];
  for (const issue of issues) {
    const year = yearOf(issue);
    const monthKey = issue.issueDate.slice(0, 7);
    if (years.at(-1)?.year !== year) years.push({ year, count: 0, months: [] });
    const yearGroup = years.at(-1);
    if (yearGroup.months.at(-1)?.key !== monthKey) yearGroup.months.push({ key: monthKey, issues: [] });
    yearGroup.months.at(-1).issues.push(issue);
    yearGroup.count += 1;
  }
  return years;
}

function IssueCover({ issue, title, label }) {
  if (issue.coverImageUrl) {
    return <img src={issue.coverImageUrl} alt={title} loading="lazy" className="aspect-[3/4] w-full bg-white object-cover" />;
  }
  return (
    <div className="flex aspect-[3/4] w-full flex-col justify-between bg-gradient-to-br from-light-orange-tint via-white to-light-green-tint p-4 text-left">
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-orange-accent">{label}</span>
      <Newspaper size={40} className="text-brand-green-primary/25" />
      <span className="line-clamp-3 text-sm font-extrabold leading-snug text-brand-green-primary">{title}</span>
    </div>
  );
}

function WeekCard({ issue, lang, t, fallbackTitle, isNewest, onOpen }) {
  const r = t.saptahikReader;
  const num = (n) => localNumber(n, lang);
  const ownTitle = issueTitle(issue, lang);
  const details = [issue.issueNumber && `${r.issue} ${num(issue.issueNumber)}`, ownTitle].filter(Boolean).join(" · ");
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.35 }}
    >
      <button type="button" onClick={onOpen} onPointerEnter={warmPdfjs} className="group block w-full text-left focus:outline-none">
        <div className="relative overflow-hidden rounded-lg bg-white shadow-[0_8px_22px_rgba(20,67,42,0.12)] ring-1 ring-[#E8E3D7] transition duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_18px_36px_rgba(20,67,42,0.2)] group-focus-visible:ring-2 group-focus-visible:ring-brand-orange-accent">
          <IssueCover issue={issue} title={ownTitle || fallbackTitle} label={t.nav.saptahik} />
          <span className="absolute left-0 top-3 rounded-r-full bg-brand-orange-accent py-1 pl-2.5 pr-3 text-xs font-extrabold text-orange-btn-text shadow-md">
            {r.week} {num(weekOfMonth(issue.issueDate))}
          </span>
          {isNewest && (
            <span className="absolute right-2 top-2.5 rounded-full bg-brand-green-primary px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow">
              {r.newBadge}
            </span>
          )}
          <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-1.5 bg-brand-orange-accent/95 py-2 text-xs font-bold text-orange-btn-text transition duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
            <BookOpen size={14} /> {r.read}
          </span>
        </div>
        <p className="mt-3 text-sm font-extrabold text-brand-green-primary transition group-hover:text-brand-orange-accent">
          {formatDate(issue.issueDate, lang)}
        </p>
        {details && <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-secondary-text">{details}</p>}
      </button>
    </motion.li>
  );
}

const chipClass = (active) =>
  `shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition sm:text-sm ${
    active
      ? "bg-brand-orange-accent text-orange-btn-text shadow-[0_4px_12px_rgba(234,139,34,0.3)]"
      : "bg-white text-secondary-text ring-1 ring-[#E4DFD2] hover:text-brand-green-primary hover:ring-brand-green-medium"
  }`;

export default function Saptahik() {
  const { t, lang, path } = useLanguage();
  const cms = useSiteContent("saptahik") ?? {};
  const tx = (key) => cms[key] ?? t.pages.saptahik[key];
  const num = (n) => localNumber(n, lang);
  const r = t.saptahikReader;

  const { data, error, loading } = useApi("/saptahik");
  const issues = useMemo(
    () => [...(data ?? [])].sort((a, b) => b.issueDate.localeCompare(a.issueDate) || b.id - a.id),
    [data]
  );
  const byYear = useMemo(() => groupByYearAndMonth(issues), [issues]);
  const latest = issues[0];

  // The open issue lives in the URL (?issue=12) so an issue can be shared as
  // a link, and the phone's back button closes the reader.
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const activeIssue = issues.find((i) => String(i.id) === searchParams.get("issue"));
  const openIssue = (issue) => setSearchParams({ issue: String(issue.id) }, { state: { readerOpened: true } });
  const closeIssue = () => {
    if (location.state?.readerOpened) navigate(-1);
    else setSearchParams({}, { replace: true });
  };

  const [pickedYear, setPickedYear] = useState(null);
  const [pickedMonth, setPickedMonth] = useState("all");
  const year = pickedYear ?? (activeIssue ? yearOf(activeIssue) : byYear[0]?.year);
  const yearGroup = byYear.find((g) => g.year === year);
  const months = yearGroup?.months ?? [];
  const visibleMonths = pickedMonth === "all" ? months : months.filter((m) => m.key === pickedMonth);

  // After switching year/month, bring the top of the list back into view if
  // the reader had scrolled past it.
  const filterBarRef = useRef(null);
  const listRef = useRef(null);
  const showList = () => {
    const list = listRef.current;
    if (!list) return;
    const top = list.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - (filterBarRef.current?.offsetHeight ?? 0);
    if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
  };
  const pickYear = (y) => {
    setPickedYear(y);
    setPickedMonth("all");
    showList();
  };
  const pickMonth = (key) => {
    setPickedMonth(key);
    showList();
  };

  const monthName = (key, options = { month: "long" }) => formatDate(`${key}-01`, lang, options);
  const title = tx("title");
  const titleWords = title.split(" ");
  const titleAccent = titleWords.length > 1 ? titleWords.pop() : "";

  const stats = [
    issues.length > 0 && [num(issues.length), tx("statIssues")],
    byYear.length > 1 && [num(byYear.length), tx("statYears")],
    latest && [formatDate(latest.issueDate, lang, { day: "numeric", month: "short" }), tx("latestLabel")],
  ].filter(Boolean);

  // The newest issue in front, the two before it fanned out behind.
  const [behindRight, behindLeft] = issues.slice(1, 3);

  return (
    <>
      {/* Hero: about the publication, plus the newest issues' covers */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-green-primary via-[#17502f] to-brand-green-medium text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-orange-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-5 sm:pb-20">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-white/70 sm:text-sm">
              <li>
                <Link to={path("")} className="transition hover:text-brand-orange-accent">
                  {t.nav.home}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} />
              </li>
              <li>
                <Link to={path("blogs")} className="transition hover:text-brand-orange-accent">
                  {t.nav.blogs}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} />
              </li>
              <li aria-current="page" className="text-white">
                {t.nav.saptahik}
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid items-center gap-12 sm:mt-10 lg:grid-cols-12">
            <div className="text-center lg:col-span-7 lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange-accent ring-1 ring-white/15">
                <CalendarDays size={14} /> {tx("badge")}
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                {titleWords.join(" ")} {titleAccent && <span className="text-brand-orange-accent">{titleAccent}</span>}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base lg:mx-0">{tx("intro")}</p>

              {stats.length > 0 && (
                <dl className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4 lg:justify-start">
                  {stats.map(([value, label]) => (
                    <div key={label}>
                      <dt className="sr-only">{label}</dt>
                      <dd className="text-2xl font-extrabold text-brand-orange-accent sm:text-3xl">{value}</dd>
                      <dd className="mt-0.5 text-xs font-bold uppercase tracking-wider text-white/70">{label}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {latest && (
                <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <button
                    type="button"
                    onClick={() => openIssue(latest)}
                    onPointerEnter={warmPdfjs}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-orange-accent px-7 py-3 text-sm font-bold text-orange-btn-text shadow-[0_4px_16px_rgba(234,139,34,0.35)] transition hover:-translate-y-0.5 hover:bg-[#D97A14] hover:text-white"
                  >
                    <BookOpen size={17} /> {tx("readLatest")}
                  </button>
                  <a
                    href={latest.pdfUrl}
                    download={`Lokmangal-Saptahik-${latest.issueDate}.pdf`}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-7 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-brand-green-primary"
                  >
                    <Download size={17} /> {r.download}
                  </a>
                </div>
              )}
            </div>

            <div className="lg:col-span-5">
              {latest ? (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mx-auto w-52 sm:w-64 lg:w-72"
                >
                  <div className="relative">
                    {[
                      [behindLeft, "-rotate-[8deg] -translate-x-8"],
                      [behindRight, "rotate-[7deg] translate-x-8"],
                    ].map(
                      ([issue, placement]) =>
                        issue && (
                          <div
                            key={issue.id}
                            aria-hidden="true"
                            className={`absolute inset-0 overflow-hidden rounded-xl opacity-70 shadow-2xl ring-2 ring-white/10 ${placement}`}
                          >
                            <IssueCover issue={issue} title={issueTitle(issue, lang) || title} label={t.nav.saptahik} />
                          </div>
                        )
                    )}
                    <button
                      type="button"
                      onClick={() => openIssue(latest)}
                      onPointerEnter={warmPdfjs}
                      aria-label={tx("readLatest")}
                      className="group relative block w-full focus:outline-none"
                    >
                      <span className="relative block overflow-hidden rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.45)] ring-4 ring-white/20 transition duration-500 group-hover:-translate-y-1.5 group-focus-visible:ring-brand-orange-accent">
                        <IssueCover issue={latest} title={issueTitle(latest, lang) || title} label={t.nav.saptahik} />
                      </span>
                      <span className="absolute -left-3 top-5 rounded-r-full bg-brand-orange-accent px-3.5 py-1 text-xs font-extrabold text-orange-btn-text shadow-lg">
                        {tx("latestLabel")}
                      </span>
                    </button>
                  </div>
                  <p className="mt-6 text-center text-sm font-semibold text-white/85">
                    {formatDate(latest.issueDate, lang)} · {r.week} {num(weekOfMonth(latest.issueDate))}
                    {latest.issueNumber && ` · ${r.issue} ${num(latest.issueNumber)}`}
                  </p>
                </motion.div>
              ) : (
                !loading && (
                  <div className="mx-auto flex aspect-[3/4] w-60 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/25 bg-white/5 p-6 text-center sm:w-72">
                    <Newspaper size={48} className="text-brand-orange-accent" />
                    <p className="text-sm font-bold text-white/80">{tx("emptyTitle")}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Archive: year → month → week, newest first */}
      <section className="bg-[#FAF8F5] pb-16 pt-14 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-green-primary">
              <Library size={14} className="text-brand-orange-accent" /> {tx("archiveBadge")}
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-brand-green-primary sm:text-3xl md:text-4xl">{tx("archiveTitle")}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-secondary-text sm:text-base">{tx("archiveSubtitle")}</p>
          </div>

          {loading && <LoadingState />}
          {error && <ErrorState />}

          {!loading && !error && issues.length === 0 && (
            <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-dashed border-[#D5CEBF] bg-white p-12 text-center">
              <Newspaper size={40} className="mx-auto mb-3 text-gray-400" />
              <p className="text-base font-bold text-main-text">{tx("emptyTitle")}</p>
              <p className="mt-1 text-sm text-secondary-text">{tx("emptyText")}</p>
            </div>
          )}
        </div>

        {yearGroup && (
          <>
            <div
              ref={filterBarRef}
              className="sticky z-30 mt-8 border-y border-[#ECE7DA] bg-[#FAF8F5]/95 backdrop-blur"
              style={{ top: NAVBAR_HEIGHT }}
            >
              <div className="mx-auto max-w-7xl space-y-2.5 px-4 py-2.5 sm:py-3">
                <div role="tablist" aria-label={tx("archiveTitle")} className="flex justify-center gap-2">
                  {byYear.map((g) => (
                    <button
                      key={g.year}
                      type="button"
                      role="tab"
                      aria-selected={g.year === year}
                      onClick={() => pickYear(g.year)}
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-extrabold transition sm:px-6 ${
                        g.year === year
                          ? "bg-brand-green-primary text-white shadow-[0_6px_16px_rgba(20,67,42,0.25)]"
                          : "bg-white text-secondary-text ring-1 ring-[#E4DFD2] hover:text-brand-green-primary hover:ring-brand-green-medium"
                      }`}
                    >
                      {num(g.year)}
                      <span
                        className={`rounded-full px-1.5 text-[11px] ${g.year === year ? "bg-white/20" : "bg-light-green-tint text-brand-green-primary"}`}
                      >
                        {num(g.count)}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="no-scrollbar -mx-4 overflow-x-auto px-4">
                  <div className="mx-auto flex w-max gap-2 pb-0.5">
                    <button type="button" onClick={() => pickMonth("all")} className={chipClass(pickedMonth === "all")}>
                      {r.allMonths}
                    </button>
                    {months.map((m) => (
                      <button key={m.key} type="button" onClick={() => pickMonth(m.key)} className={chipClass(pickedMonth === m.key)}>
                        {monthName(m.key)} <span className="opacity-70">({num(m.issues.length)})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div ref={listRef} className="mx-auto max-w-7xl px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${year}-${pickedMonth}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {visibleMonths.map((m) => (
                    <section
                      key={m.key}
                      className="grid gap-5 border-b border-[#E8E2D4] py-10 last:border-b-0 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10"
                    >
                      <header className="flex items-baseline gap-3 lg:sticky lg:top-[210px] lg:block lg:self-start">
                        <h3 className="text-2xl font-extrabold text-brand-green-primary sm:text-3xl">{monthName(m.key)}</h3>
                        <p className="text-sm font-extrabold text-brand-orange-accent lg:mt-1">{num(year)}</p>
                        <p className="text-sm font-semibold text-secondary-text lg:mt-3">
                          <span className="lg:hidden">· </span>
                          {num(m.issues.length)} {r.issues}
                        </p>
                      </header>
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 xl:grid-cols-4">
                        {m.issues.map((issue) => (
                          <WeekCard
                            key={issue.id}
                            issue={issue}
                            lang={lang}
                            t={t}
                            fallbackTitle={title}
                            isNewest={issue.id === latest?.id}
                            onOpen={() => openIssue(issue)}
                          />
                        ))}
                      </ul>
                    </section>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        )}
      </section>

      <AnimatePresence>
        {activeIssue && <IssueReader key={activeIssue.id} issue={activeIssue} onClose={closeIssue} />}
      </AnimatePresence>
    </>
  );
}

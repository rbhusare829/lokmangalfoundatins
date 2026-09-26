import { useEffect, useState } from "react";
import { api, extractErrorMessage } from "../lib/api.js";
import { useSiteContentAdmin } from "../lib/SiteContentContext.jsx";
import DynamicFieldEditor from "./DynamicFieldEditor.jsx";

const CONTENT_SECTIONS = [
  { key: "home", label: "Home Page" },
  { key: "about", label: "About Section" },
  { key: "volunteer", label: "Volunteer Section" },
  { key: "faq", label: "FAQ Section" },
  { key: "contact", label: "Contact Page" },
  { key: "contribute", label: "Contribute Page" },
  { key: "privacy", label: "Privacy Policy" },
  { key: "siteInfo", label: "Site Info (address, phone, email)" },
  { key: "footer", label: "Footer" },
  { key: "gallery", label: "Gallery Page Header" },
  { key: "testimonials", label: "Testimonials Page Header" },
  { key: "events", label: "Events Page Header" },
  { key: "projects", label: "Projects Page Header" },
  { key: "blogs", label: "Blogs Page Header" },
  { key: "team", label: "Team Page (About > Our Team)" },
  { key: "saptahik", label: "Saptahik Page (Blogs > Saptahik)" },
];

export default function ContentManager() {
  const { reload } = useSiteContentAdmin();
  const [activeKey, setActiveKey] = useState(CONTENT_SECTIONS[0].key);
  const [lang, setLang] = useState("en");
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setData(null);
    setError(false);
    setSaved(false);
    setSaveError("");
    api
      .get(`/content/${activeKey}`)
      .then((res) => setData(res.data))
      .catch(() => setError(true));
  }, [activeKey]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setSaveError("");
    try {
      await api.put(`/content/${activeKey}`, { dataEn: data.en, dataMr: data.mr });
      reload();
      setSaved(true);
    } catch (err) {
      setSaveError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-extrabold text-brand-green-primary">Site Content</h1>
      <p className="mt-1 text-sm text-secondary-text">
        Edit the text shown on each page. Changes go live on the website as soon as you save.
      </p>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <nav className="flex shrink-0 flex-col gap-1 lg:w-56">
          {CONTENT_SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveKey(s.key)}
              className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                activeKey === s.key
                  ? "bg-light-green-tint text-brand-green-primary"
                  : "text-secondary-text hover:bg-light-green-tint/60"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          {error && <p className="text-sm text-red-600">Could not load this section.</p>}
          {!error && !data && <p className="text-sm text-secondary-text">Loading…</p>}

          {data && (
            <div className="rounded-xl border border-light-green-tint bg-white p-5">
              <div className="mb-5 flex items-center gap-2">
                <button
                  onClick={() => setLang("en")}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                    lang === "en"
                      ? "bg-brand-green-primary text-white"
                      : "bg-light-green-tint text-brand-green-primary"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang("mr")}
                  className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                    lang === "mr"
                      ? "bg-brand-green-primary text-white"
                      : "bg-light-green-tint text-brand-green-primary"
                  }`}
                >
                  मराठी
                </button>
              </div>

              <DynamicFieldEditor value={data[lang]} onChange={(v) => setData({ ...data, [lang]: v })} />

              <div className="mt-6 flex items-center gap-3 border-t border-light-green-tint pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-brand-orange-accent px-5 py-2 text-sm font-bold text-orange-btn-text hover:bg-[#D97A14] hover:text-white disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                {saved && <span className="text-sm font-semibold text-brand-green-primary">Saved ✓</span>}
                {saveError && <span className="text-sm font-semibold text-red-600">{saveError}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

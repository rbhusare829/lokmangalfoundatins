import { useState } from "react";
import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext.jsx";
import { useSiteContent } from "../lib/SiteContentContext.jsx";
import PageBanner from "../components/ui/PageBanner.jsx";
import SocialIcons from "../components/layout/SocialIcons.jsx";

export default function Contact() {
  const { t } = useLanguage();
  const c = useSiteContent("contact") ?? t.pages.contact;
  const site = useSiteContent("siteInfo") ?? t.common;
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    // No backend endpoint for this yet (out of scope for this phase) — the
    // original site's contact form didn't submit anywhere either, it just
    // showed a client-side thank-you message. Preserving that behavior here.
    setSent(true);
    reset();
  };

  return (
    <>
      <PageBanner title={c.title} />
      <section className="py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-brand-green-primary">{c.formTitle}</h2>

            {sent ? (
              <div className="mt-6 flex items-start gap-3 rounded-xl bg-light-green-tint p-5 text-brand-green-primary">
                <CheckCircle2 size={22} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold">{c.sentTitle}</p>
                  <p className="text-sm">{c.sentText}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <input
                    {...register("name", { required: true })}
                    placeholder={c.nameLabel + " *"}
                    className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-brand-orange-accent"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{c.required}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                    placeholder={c.emailLabel + " *"}
                    className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-brand-orange-accent"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{c.invalidEmail}</p>}
                </div>
                <input
                  {...register("phone")}
                  placeholder={c.phoneLabel}
                  className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-brand-orange-accent"
                />
                <input
                  {...register("subject")}
                  placeholder={c.subjectLabel}
                  className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-brand-orange-accent"
                />
                <div className="sm:col-span-2">
                  <textarea
                    {...register("message", { required: true })}
                    placeholder={c.messageLabel + " *"}
                    rows={5}
                    className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 text-sm outline-none focus:border-brand-orange-accent"
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-600">{c.required}</p>}
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="rounded-full bg-brand-orange-accent px-7 py-2.5 text-sm font-bold text-orange-btn-text hover:bg-[#D97A14] hover:text-white"
                  >
                    {c.send}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-brand-green-primary">{c.quickContactTitle}</h2>
            <p className="mt-3 text-sm text-secondary-text">{c.quickContactText}</p>
            <ul className="mt-5 space-y-3 text-sm text-secondary-text">
              <li className="flex gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-brand-orange-accent" /> {site.address}
              </li>
              <li className="flex gap-2">
                <Phone size={16} className="mt-0.5 shrink-0 text-brand-orange-accent" /> {site.phoneDisplay}
              </li>
              <li className="flex gap-2">
                <Mail size={16} className="mt-0.5 shrink-0 text-brand-orange-accent" /> {site.email}
              </li>
            </ul>
            <SocialIcons className="mt-5" />
          </div>
        </div>
      </section>
    </>
  );
}

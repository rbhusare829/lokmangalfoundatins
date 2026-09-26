import { Link } from "react-router-dom";
import { Images, MessageSquareQuote, Users, Layers, CalendarDays, Newspaper, BookOpen, FileText } from "lucide-react";

const CARDS = [
  {
    to: "/admin/content",
    label: "Site Content",
    icon: FileText,
    desc: "Edit the text on every page — Home, About, Contact, FAQ, and more.",
  },
  {
    to: "/admin/gallery",
    label: "Gallery & Albums",
    icon: Images,
    desc: "Manage photo albums and photos categorized by initiative.",
  },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote, desc: "Manage supporter quotes." },
  { to: "/admin/team", label: "Team", icon: Users, desc: "Manage office bearers and members on About > Our Team." },
  { to: "/admin/projects", label: "Projects", icon: Layers, desc: "Manage the four core initiatives." },
  { to: "/admin/events", label: "Events", icon: CalendarDays, desc: "Manage past events and awards." },
  { to: "/admin/blogs", label: "Blogs", icon: Newspaper, desc: "Write and manage blog posts." },
  {
    to: "/admin/saptahik",
    label: "Saptahik (Weekly PDF)",
    icon: BookOpen,
    desc: "Upload each week's Saptahik PDF for Blogs > Saptahik.",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-xl font-extrabold text-brand-green-primary">Dashboard</h1>
      <p className="mt-1 text-sm text-secondary-text">Choose what you'd like to manage.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(({ to, label, icon: Icon, desc }) => (
          <Link
            key={to}
            to={to}
            className="rounded-xl border border-light-green-tint bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:border-brand-orange-accent"
          >
            <Icon size={22} className="text-brand-green-primary" />
            <h3 className="mt-3 font-bold text-main-text">{label}</h3>
            <p className="mt-1 text-sm text-secondary-text">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

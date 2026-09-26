import { NavLink, Navigate, Outlet } from "react-router-dom";
import { Images, MessageSquareQuote, Users, Layers, CalendarDays, Newspaper, BookOpen, FileText, LogOut, ExternalLink } from "lucide-react";
import { useAdminAuth } from "./AuthContext.jsx";

const NAV = [
  { to: "/admin/content", label: "Site Content", icon: FileText },
  { to: "/admin/gallery", label: "Gallery & Albums", icon: Images },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/projects", label: "Projects", icon: Layers },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { to: "/admin/saptahik", label: "Saptahik (Weekly PDF)", icon: BookOpen },
];

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
    isActive ? "bg-light-green-tint text-brand-green-primary" : "text-secondary-text hover:bg-light-green-tint/60"
  }`;

export default function AdminLayout() {
  const { admin, loading, logout } = useAdminAuth();

  if (loading) return <div className="flex min-h-screen items-center justify-center text-secondary-text">Loading…</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex min-h-screen bg-page-bg">
      <aside className="flex w-64 shrink-0 flex-col border-r border-light-green-tint bg-white">
        <div className="border-b border-light-green-tint px-5 py-5">
          <h1 className="text-sm font-extrabold text-brand-green-primary">Lokmangal Admin</h1>
          <p className="mt-0.5 truncate text-xs text-secondary-text">{admin.email}</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <a
          href="/mr"
          target="_blank"
          rel="noreferrer"
          className="mx-3 mb-1 flex items-center justify-between rounded-lg border border-light-green-tint bg-light-green-tint/40 px-3.5 py-2 text-xs font-bold text-brand-green-primary transition hover:bg-light-green-tint"
        >
          <span>वेबसाइट पहा (View Site)</span>
          <ExternalLink size={14} />
        </a>
        <button
          onClick={logout}
          className="m-3 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-secondary-text hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={17} /> Log Out
        </button>
      </aside>

      <main className="flex-1 overflow-x-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

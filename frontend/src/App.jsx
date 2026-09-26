import { Routes, Route, Outlet } from "react-router-dom";
import { LanguageProvider } from "./lib/LanguageContext.jsx";
import { SiteContentProvider } from "./lib/SiteContentContext.jsx";
import Layout from "./components/layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Team from "./pages/Team.jsx";
import Contact from "./pages/Contact.jsx";
import Contribute from "./pages/Contribute.jsx";
import Gallery from "./pages/Gallery.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Events from "./pages/Events.jsx";
import Blogs from "./pages/Blogs.jsx";
import Saptahik from "./pages/Saptahik.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import DynamicProjectOrNotFound from "./pages/DynamicProjectOrNotFound.jsx";
import { PAGE_SLUGS } from "./lib/pages.js";

import { AdminAuthProvider } from "./admin/AuthContext.jsx";
import AdminLogin from "./admin/AdminLogin.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import EntityManager from "./admin/EntityManager.jsx";
import ContentManager from "./admin/ContentManager.jsx";
import {
  galleryConfig,
  testimonialsConfig,
  teamConfig,
  projectsConfig,
  eventsConfig,
  blogsConfig,
  saptahikConfig,
} from "./admin/entityConfigs.js";

const PROJECT_SLUGS = [
  "jalsandharan-project",
  "lokmangal-annapurna-yojana",
  "vidyadaan-yojana",
  "samudayik-vivah-sohala",
];

const PAGE_COMPONENTS = {
  about: <About />,
  "about/team": <Team />,
  contact: <Contact />,
  contribute: <Contribute />,
  gallery: <Gallery />,
  projects: <Projects />,
  events: <Events />,
  blogs: <Blogs />,
  "blogs/saptahik": <Saptahik />,
  "privacy-policy": <PrivacyPolicy />,
};

function pageElement(slug) {
  if (!slug) return <Home />;
  if (PROJECT_SLUGS.includes(slug)) return <ProjectDetail slug={slug} />;
  return PAGE_COMPONENTS[slug];
}

export default function App() {
  return (
    <LanguageProvider>
      <SiteContentProvider>
        <Routes>
          <Route element={<Layout />}>
            {PAGE_SLUGS.map((slug) => (
              <Route key={slug || "home"} index={!slug} path={slug || undefined} element={pageElement(slug)} />
            ))}
            <Route path="projects/:slug" element={<DynamicProjectOrNotFound />} />
            <Route path="blogs/:slug" element={<DynamicProjectOrNotFound />} />
            <Route path="mr">
              {PAGE_SLUGS.map((slug) => (
                <Route
                  key={`mr-${slug || "home"}`}
                  index={!slug}
                  path={slug || undefined}
                  element={pageElement(slug)}
                />
              ))}
              <Route path="projects/:slug" element={<DynamicProjectOrNotFound />} />
              <Route path="blogs/:slug" element={<DynamicProjectOrNotFound />} />
              <Route path="*" element={<DynamicProjectOrNotFound />} />
            </Route>
            <Route path="*" element={<DynamicProjectOrNotFound />} />
          </Route>

          <Route
            path="/admin"
            element={
              <AdminAuthProvider>
                <Outlet />
              </AdminAuthProvider>
            }
          >
            <Route path="login" element={<AdminLogin />} />
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="content" element={<ContentManager />} />
              <Route path="gallery" element={<EntityManager config={galleryConfig} />} />
              <Route path="testimonials" element={<EntityManager config={testimonialsConfig} />} />
              <Route path="team" element={<EntityManager config={teamConfig} />} />
              <Route path="projects" element={<EntityManager config={projectsConfig} />} />
              <Route path="events" element={<EntityManager config={eventsConfig} />} />
              <Route path="blogs" element={<EntityManager config={blogsConfig} />} />
              <Route path="saptahik" element={<EntityManager config={saptahikConfig} />} />
            </Route>
          </Route>
        </Routes>
      </SiteContentProvider>
    </LanguageProvider>
  );
}

import { useLocation, useParams } from "react-router-dom";
import { useApi } from "../lib/useApi.js";
import { LoadingState } from "../components/ui/AsyncState.jsx";
import ProjectDetail from "./ProjectDetail.jsx";
import BlogDetail from "./BlogDetail.jsx";
import NotFound from "./NotFound.jsx";

// Catch-all for any URL that isn't one of the fixed PAGE_SLUGS routes.
// Handles both /projects/:slug and /:slug (as well as /mr/projects/:slug and /mr/:slug).
export default function DynamicProjectOrNotFound() {
  const location = useLocation();
  const params = useParams();

  // If matched via Route path="projects/:slug", params.slug is available directly
  const paramSlug = params.slug;

  const rawPath = location.pathname.replace(/^\/mr/, "").replace(/^\//, "").replace(/\/$/, "");
  const projectSlug = paramSlug || rawPath.replace(/^projects\//, "");
  const blogSlug = paramSlug || rawPath.replace(/^blogs\//, "");

  const { data: projects, loading: projectsLoading } = useApi("/projects");
  const { data: blogs, loading: blogsLoading } = useApi("/blogs");

  if (projectsLoading || blogsLoading) return <LoadingState />;

  const matchedProject = projects?.find(
    (p) => p.slug === projectSlug || p.slug === rawPath
  );
  if (matchedProject) return <ProjectDetail slug={matchedProject.slug} />;

  const matchedBlog = blogs?.find(
    (b) => b.slug === blogSlug || b.slug === rawPath
  );
  if (matchedBlog) return <BlogDetail slug={matchedBlog.slug} />;

  return <NotFound />;
}

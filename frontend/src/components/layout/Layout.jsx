import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../../lib/LanguageContext.jsx";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  const { lang, t } = useLanguage();

  return (
    <div data-lang={lang}>
      <Helmet htmlAttributes={{ lang }}>
        <title>{`${t.meta.siteName} | ${t.meta.tagline}`}</title>
      </Helmet>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

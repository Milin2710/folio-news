import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";

export default function Layout() {
  const { pathname } = useLocation();

  // Start each new page at the top
  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return (
    <>
      <Navbar />
      <main className="container page">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

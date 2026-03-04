import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { useScrollToTop } from "../hooks";

export function Layout() {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  useScrollToTop();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet context={{ searchQuery }} />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

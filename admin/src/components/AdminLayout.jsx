import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const sidebarVisible = !isMobile || mobileOpen;
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar collapsed={sidebarCollapsed} onClose={mobileOpen ? () => setMobileOpen(false) : undefined} mobileOpen={sidebarVisible} />
      <div className={`min-h-screen transition-[margin-left] duration-200 ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"}`}>
        <AdminTopbar onToggleSidebar={() => setSidebarCollapsed((c) => !c)} onMobileMenu={() => setMobileOpen((o) => !o)} />
        <main className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

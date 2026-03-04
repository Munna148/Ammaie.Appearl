import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const MENU = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/users", label: "Users", icon: "👥" },
  { path: "/products", label: "Products", icon: "👗" },
  { path: "/orders", label: "Orders", icon: "📦" },
  { path: "/complaints", label: "Complaints", icon: "💬" },
  { path: "/analytics", label: "Analytics", icon: "📈" },
  { path: "/settings", label: "Settings", icon: "⚙️" },
];

export function AdminSidebar({ collapsed, onClose, mobileOpen }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const showSidebar = mobileOpen === undefined ? true : mobileOpen;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <AnimatePresence>
        {onClose && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40 bg-black/30 lg:hidden" aria-hidden="true" />
        )}
      </AnimatePresence>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        className="fixed left-0 top-0 z-50 flex h-full flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
        style={showSidebar ? {} : { display: "none" }}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
          {!collapsed && <span className="text-lg font-semibold text-rose-600 dark:text-rose-400">Admin</span>}
          {onClose && <button type="button" onClick={onClose} className="rounded p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Close">✕</button>}
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {MENU.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400" : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-gray-200 p-2 dark:border-gray-700">
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
            <span className="text-lg">🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}

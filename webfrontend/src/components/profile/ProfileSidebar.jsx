import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MENU_ITEMS = [
  { key: "profile", label: "My Profile", icon: "👤", path: null },
  { key: "orders", label: "My Orders", icon: "📦", path: null },
  { key: "addresses", label: "My Addresses", icon: "📍", path: null },
  { key: "wishlist", label: "Wishlist", icon: "❤️", path: "/wishlist" },
  { key: "password", label: "Change Password", icon: "🔒", path: null },
];

export function ProfileSidebar({ currentSection, onSelect, onLogout, mobileOpen, onClose }) {
  const content = (
    <nav className="flex flex-col gap-1">
      {MENU_ITEMS.map((item) => (
        item.path ? (
          <Link
            key={item.key}
            to={item.path}
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-rose-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ) : (
          <button
            key={item.key}
            type="button"
            onClick={() => { onSelect(item.key); onClose?.(); }}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
              currentSection === item.key
                ? "bg-rose-100 font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
                : "text-gray-700 hover:bg-rose-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        )
      ))}
      <button
        type="button"
        onClick={() => { onLogout(); onClose?.(); }}
        className="mt-4 flex items-center gap-3 rounded-lg px-4 py-3 text-left text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
      >
        <span className="text-xl">🚪</span>
        <span>Logout</span>
      </button>
    </nav>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="sticky top-24 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          {content}
        </motion.div>
      </aside>
      {/* Mobile */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="h-full w-72 max-w-[85vw] border-r border-rose-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-white">Menu</span>
              <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-500">✕</button>
            </div>
            {content}
          </motion.aside>
        </motion.div>
      )}
    </>
  );
}

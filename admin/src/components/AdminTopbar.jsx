import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ProfileAvatar } from "./ProfileAvatar";

export function AdminTopbar({ onToggleSidebar, onMobileMenu }) {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMobileMenu ?? onToggleSidebar} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" aria-label="Toggle menu">☰</button>
        <div className="hidden md:block">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input type="search" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={toggleTheme} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" aria-label={isDark ? "Light" : "Dark"}>{isDark ? "☀️" : "🌙"}</button>
        <button type="button" className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" aria-label="Notifications">🔔<span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" /></button>
        <div className="relative" ref={ref}>
          <button type="button" onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
            <ProfileAvatar size="sm" editable={false} />
            <span className="hidden max-w-[120px] truncate text-sm font-medium text-gray-700 dark:text-gray-300 sm:block">{user?.email}</span>
            <span className="text-gray-400">▾</span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-700">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{user?.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
              <Link to="/settings" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700" onClick={() => setProfileOpen(false)}>Settings</Link>
              <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">View Store</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

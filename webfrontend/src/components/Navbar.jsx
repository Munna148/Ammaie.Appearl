import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ProfileAvatar } from "./profile";

export function Navbar({ searchQuery, onSearchChange }) {
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full border-b border-rose-200/60 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95 supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-rose-700 dark:text-rose-400">
          <span className="text-2xl">👗</span>
          <span>Ammaie Apparels</span>
        </Link>

        <div className="hidden flex-1 max-w-md lg:block">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="search"
              placeholder="Search dresses..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full rounded-full border border-rose-200 bg-rose-50/50 py-2 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-rose-500 dark:focus:ring-gray-600"
            />
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-gray-700 transition hover:bg-rose-100 hover:text-rose-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-rose-400"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          <Link
            to="/shop"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-rose-100 hover:text-rose-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-rose-400"
          >
            Shop
          </Link>
          <Link
            to="/cart"
            className="relative rounded-lg p-2 text-gray-700 transition hover:bg-rose-100 hover:text-rose-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-rose-400"
            aria-label="Cart"
          >
            🛒
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white"
              >
                {count > 99 ? "99+" : count}
              </motion.span>
            )}
          </Link>
          <Link
            to="/wishlist"
            className="relative rounded-lg p-2 text-gray-700 transition hover:bg-rose-100 hover:text-rose-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-rose-400"
            aria-label="Wishlist"
          >
            ❤️
            {wishlistCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white"
              >
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </motion.span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-rose-100 hover:text-rose-700 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-rose-400"
              >
                <ProfileAvatar size="sm" editable={false} />
                <span className="max-w-[100px] truncate lg:max-w-[120px]" title={user?.email}>
                  {user?.email}
                </span>
                <span className="text-gray-500">▾</span>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-rose-100 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="border-b border-rose-100 px-4 py-3 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <ProfileAvatar size="sm" editable={false} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-white" title={user?.email}>
                            {user?.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Your account</p>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => setProfileOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      type="button"
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-rose-50 dark:text-red-400 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500"
            >
              Login
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-gray-700 dark:text-gray-300"
            aria-label={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-lg p-2 text-gray-700 dark:text-gray-300"
            aria-label="Toggle menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <div className="border-t border-rose-100 px-4 py-2 dark:border-gray-700 lg:hidden">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="search"
            placeholder="Search dresses..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full rounded-full border border-rose-200 bg-rose-50/50 py-2 pl-10 pr-4 text-sm outline-none focus:border-rose-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-rose-100 bg-white dark:border-gray-700 dark:bg-gray-900 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              <Link
                to="/shop"
                className="rounded-lg px-3 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-rose-100 dark:hover:bg-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/cart"
                className="rounded-lg px-3 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-rose-100 dark:hover:bg-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                Cart {count > 0 && `(${count})`}
              </Link>
              <Link
                to="/wishlist"
                className="rounded-lg px-3 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-rose-100 dark:hover:bg-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              {isAuthenticated ? (
                <>
                  <div className="border-t border-rose-100 px-3 py-2 dark:border-gray-700">
                    <p className="truncate text-sm text-gray-600 dark:text-gray-400" title={user?.email}>
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="rounded-lg px-3 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-rose-100 dark:hover:bg-gray-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="rounded-lg px-3 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-rose-100 dark:hover:bg-gray-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="rounded-lg px-3 py-2 text-left font-medium text-red-600 dark:text-red-400 hover:bg-rose-50 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="rounded-lg bg-rose-500 px-4 py-2 text-center font-medium text-white dark:bg-rose-600"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-rose-200/60 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-rose-700 dark:text-rose-400">Ammaie Apparels</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Beautiful dresses for every occasion. Quality fabrics, modern designs, and a touch of elegance.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/shop" className="text-sm text-gray-600 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400">Shop</Link></li>
              <li><Link to="/cart" className="text-sm text-gray-600 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400">Cart</Link></li>
              <li><Link to="/wishlist" className="text-sm text-gray-600 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400">Wishlist</Link></li>
              <li><Link to="/profile" className="text-sm text-gray-600 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>📧 hello@ammaieapparels.com</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 123 Fashion Street, City</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">Newsletter</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Subscribe for new arrivals and offers.</p>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-sm outline-none focus:border-rose-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-4 flex gap-3">
              <a href="#" className="text-gray-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400" aria-label="Instagram">📷</a>
              <a href="#" className="text-gray-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400" aria-label="Facebook">📘</a>
              <a href="#" className="text-gray-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400" aria-label="Pinterest">📌</a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-rose-100 dark:border-gray-700 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Ammaie Apparels. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

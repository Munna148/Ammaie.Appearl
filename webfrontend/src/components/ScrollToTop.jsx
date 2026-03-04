import { useState, useEffect } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollTop}
      className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg transition hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:bg-rose-600 dark:hover:bg-rose-500"
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}

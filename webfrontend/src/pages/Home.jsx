import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ProductCard } from "../components";
import { products } from "../data/products";
import { HERO_IMAGE, CATEGORY_IMAGES } from "../data/constants";

const HERO_FALLBACK = "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1600";
const CATEGORY_FALLBACKS = {
  Party: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
  Casual: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500",
  Wedding: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500",
  Summer: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
};

const CATEGORIES = [
  { name: "Party Wear", slug: "Party" },
  { name: "Casual Wear", slug: "Casual" },
  { name: "Wedding Collection", slug: "Wedding" },
  { name: "Summer Collection", slug: "Summer" },
];

const WHY_CHOOSE_US = [
  { title: "Free Shipping", description: "On orders over ₹2,000", icon: "🚚" },
  { title: "Easy Returns", description: "30-day hassle-free returns", icon: "↩️" },
  { title: "Premium Quality", description: "Curated fabrics & craftsmanship", icon: "✨" },
  { title: "Secure Checkout", description: "100% secure payment", icon: "🔒" },
];

export function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const [heroSrc, setHeroSrc] = useState(HERO_IMAGE);
  const [categorySrc, setCategorySrc] = useState(CATEGORY_IMAGES);

  return (
    <div>
      {/* Hero with banner image */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-[70vh] overflow-hidden bg-rose-100 dark:bg-gray-900"
      >
        <div className="absolute inset-0">
          <img
            src={heroSrc}
            alt="Elegant dresses"
            className="h-full w-full object-cover object-center"
            onError={() => setHeroSrc(HERO_FALLBACK)}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900/70 via-rose-800/50 to-transparent dark:from-gray-900/90 dark:via-gray-900/70" />
        </div>
        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl"
          >
            Elegant Dresses for{" "}
            <span className="text-rose-200">Every Occasion</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-4 max-w-xl text-lg text-white/95 drop-shadow sm:text-xl"
          >
            Discover our curated collection of party, casual, wedding, and summer dresses. Quality fabrics and modern designs for the modern you.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8"
          >
            <Link
              to="/shop"
              className="inline-flex rounded-full bg-rose-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl"
        >
          Shop by Category
        </motion.h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Find your perfect style</p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={categorySrc[cat.slug] || CATEGORY_FALLBACKS[cat.slug]}
                    alt={cat.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    onError={() => setCategorySrc((prev) => ({ ...prev, [cat.slug]: CATEGORY_FALLBACKS[cat.slug] }))}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-lg font-semibold text-white drop-shadow-lg">
                    {cat.name}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-rose-50/50 py-16 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl"
          >
            Featured Dresses
          </motion.h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Trending now — handpicked for you</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link
              to="/shop"
              className="inline-flex items-center rounded-full border-2 border-rose-500 px-6 py-2.5 font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-400 dark:text-rose-400 dark:hover:bg-gray-800"
            >
              View All Products →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl"
        >
          Why Choose Us
        </motion.h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">We make shopping delightful</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE_US.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center rounded-2xl border border-rose-100 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <span className="text-4xl">{item.icon}</span>
              <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-rose-100/80 py-16 dark:bg-gray-800/80">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl"
          >
            Stay in the loop
          </motion.h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Subscribe for new arrivals, exclusive offers, and style tips.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSuccess(true);
    setEmail("");
  };

  if (success) {
    return (
      <p className="mt-6 font-medium text-rose-700 dark:text-rose-400">
        Thanks for subscribing! We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(""); }}
        placeholder="Enter your email"
        className="w-full rounded-full border border-rose-200 bg-white px-5 py-3 text-gray-900 outline-none placeholder:text-gray-500 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 sm:max-w-sm"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-rose-500 px-6 py-3 font-medium text-white transition hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500"
      >
        Subscribe
      </button>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </form>
  );
}

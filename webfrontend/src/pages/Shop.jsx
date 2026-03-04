import { useMemo, useState } from "react";
import { useSearchParams, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { ProductCard } from "../components";
import { ProductGridSkeleton } from "../components/Skeleton";
import { products, categories, sizes, allColors } from "../data/products";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Popular" },
];

export function Shop() {
  const { searchQuery } = useOutletContext() ?? {};
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const category = searchParams.get("category") ?? "";
  const size = searchParams.get("size") ?? "";
  const color = searchParams.get("color") ?? "";
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
  const sort = searchParams.get("sort") ?? "newest";

  const filteredAndSorted = useMemo(() => {
    let list = [...products];

    if (searchQuery?.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    if (category) list = list.filter((p) => p.category === category);
    if (size) list = list.filter((p) => p.sizes?.includes(size));
    if (color) list = list.filter((p) => p.colors?.includes(color));
    if (minPrice != null) list = list.filter((p) => (p.discount ?? p.price) >= minPrice);
    if (maxPrice != null) list = list.filter((p) => (p.discount ?? p.price) <= maxPrice);

    if (sort === "price_asc") list.sort((a, b) => (a.discount ?? a.price) - (b.discount ?? b.price));
    else if (sort === "price_desc") list.sort((a, b) => (b.discount ?? b.price) - (a.discount ?? a.price));
    else if (sort === "popular") list.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    else list.sort((a, b) => b.id - a.id);

    return list;
  }, [searchQuery, category, size, color, minPrice, maxPrice, sort]);

  const totalPages = Math.ceil(filteredAndSorted.length / perPage);
  const paginated = useMemo(
    () => filteredAndSorted.slice((page - 1) * perPage, page * perPage),
    [filteredAndSorted, page]
  );

  const updateFilter = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
    setPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shop Dresses</h1>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* Filters sidebar */}
        <aside className="w-full shrink-0 rounded-xl border border-rose-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 lg:w-64">
          <h3 className="font-semibold text-gray-800 dark:text-white">Filters</h3>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              value={category}
              onChange={(e) => updateFilter("category", e.target.value)}
              className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Size</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateFilter("size", size === s ? "" : s)}
                  className={`rounded-full px-3 py-1 text-sm ${size === s ? "bg-rose-500 text-white dark:bg-rose-600" : "bg-rose-100 text-gray-700 hover:bg-rose-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
            <select
              value={color}
              onChange={(e) => updateFilter("color", e.target.value)}
              className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">All</option>
              {allColors.filter((c, i, a) => a.indexOf(c) === i).slice(0, 20).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price Range</label>
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice ?? ""}
                onChange={(e) => updateFilter("minPrice", e.target.value || "")}
                className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice ?? ""}
                onChange={(e) => updateFilter("maxPrice", e.target.value || "")}
                className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredAndSorted.length} product(s)
            </p>
            <select
              value={sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="rounded-lg border border-rose-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : paginated.length === 0 ? (
            <div className="py-16 text-center text-gray-500 dark:text-gray-400">
              No dresses found. Try adjusting filters or search.
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {paginated.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-lg border border-rose-200 px-4 py-2 text-sm disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  >
                    Previous
                  </button>
                  <span className="flex items-center px-4 text-sm text-gray-600 dark:text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-lg border border-rose-200 px-4 py-2 text-sm disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { RatingStars } from "./RatingStars";
import { LazyImage } from "./LazyImage";

export function ProductCard({ product, showQuickAdd = true, index = 0 }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { addToast } = useToast();

  const price = product.discount ?? product.price;
  const hasDiscount = product.discount != null;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const size = product.sizes?.[0] ?? "M";
    const color = product.colors?.[0] ?? "Default";
    addItem(product, size, color, 1);
    addToast("Added to cart!");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleItem(product.id);
    addToast(isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm transition hover:shadow-md hover:border-rose-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-rose-50 dark:bg-gray-700">
          <LazyImage
            src={product.images[0]}
            fallbackSrc={product.images[1]}
            alt={product.name}
            className="h-full w-full transition duration-300 group-hover:scale-105"
          />
          {hasDiscount && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-medium text-white"
            >
              Sale
            </motion.span>
          )}
          <button
            type="button"
            onClick={handleWishlist}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow transition hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-700"
            aria-label="Wishlist"
          >
            <span className={isInWishlist(product.id) ? "text-rose-500" : ""}>
              {isInWishlist(product.id) ? "❤️" : "🤍"}
            </span>
          </button>
          {showQuickAdd && (
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3"
            >
              <button
                type="button"
                onClick={handleQuickAdd}
                className="w-full rounded-lg bg-white py-2 text-sm font-medium text-gray-800 transition hover:bg-rose-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                Quick Add to Cart
              </button>
            </motion.div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-medium text-gray-800 line-clamp-2 group-hover:text-rose-700 dark:text-gray-100 dark:group-hover:text-rose-400">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-semibold text-rose-600 dark:text-rose-400">₹{price.toLocaleString()}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through dark:text-gray-500">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          <div className="mt-2">
            <RatingStars rating={product.rating} showValue reviewCount={product.reviewCount} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

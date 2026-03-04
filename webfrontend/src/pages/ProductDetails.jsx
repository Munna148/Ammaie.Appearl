import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { Breadcrumb, ProductCard, RatingStars, LazyImage } from "../components";
import { products } from "../data/products";

export function ProductDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { addToast } = useToast();

  const product = products.find((p) => p.id === Number(id));
  const [selectedImage, setSelectedImage] = useState(0);
  const [size, setSize] = useState(product?.sizes?.[0] ?? "M");
  const [color, setColor] = useState(product?.colors?.[0] ?? "");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-gray-600 dark:text-gray-400">Product not found.</p>
        <Link to="/shop" className="mt-4 inline-block text-rose-600 hover:underline dark:text-rose-400">Back to Shop</Link>
      </div>
    );
  }

  const price = product.discount ?? product.price;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, size, color, quantity);
    addToast("Added to cart!");
  };

  const handleWishlist = () => {
    toggleItem(product.id);
    addToast(isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <Breadcrumb
        items={[
          { to: "/shop", label: "Shop" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-rose-50 dark:bg-gray-700">
            <LazyImage
              src={product.images[selectedImage]}
              alt={product.name}
              aspectRatio=""
              className="h-full w-full"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedImage(i)}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${selectedImage === i ? "border-rose-500 dark:border-rose-400" : "border-transparent dark:border-gray-600"}`}
              >
                <LazyImage src={img} alt="" aspectRatio="aspect-square" className="h-full w-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{product.name}</h1>
          <div className="mt-2">
            <RatingStars rating={product.rating} size="lg" showValue reviewCount={product.reviewCount} />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">₹{price.toLocaleString()}</span>
            {product.discount != null && (
              <span className="text-gray-400 line-through dark:text-gray-500">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{product.description}</p>

          {/* Size */}
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Size</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes?.map((s) => (
                <motion.button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-full px-4 py-2 text-sm ${size === s ? "bg-rose-500 text-white dark:bg-rose-600" : "border border-rose-200 hover:border-rose-400 dark:border-gray-600 dark:hover:border-gray-500"}`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color */}
          {product.colors?.length > 0 && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="mt-2 w-full max-w-xs rounded-lg border border-rose-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              >
                {product.colors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
            <div className="mt-2 flex items-center gap-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 dark:border-gray-600 dark:bg-gray-800"
              >
                −
              </motion.button>
              <span className="w-12 text-center font-medium dark:text-gray-100">{quantity}</span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 dark:border-gray-600 dark:bg-gray-800"
              >
                +
              </motion.button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <motion.button
              type="button"
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full bg-rose-500 px-8 py-3 font-medium text-white transition hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500"
            >
              Add to Cart
            </motion.button>
            <motion.button
              type="button"
              onClick={handleWishlist}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full border-2 border-rose-500 px-8 py-3 font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-400 dark:text-rose-400 dark:hover:bg-gray-800"
            >
              {isInWishlist(product.id) ? "❤️ In Wishlist" : "🤍 Wishlist"}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 border-t border-rose-100 dark:border-gray-700 pt-12"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reviews</h2>
        <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50/30 p-6 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            &ldquo;{product.reviewCount} customers have reviewed this product. Average rating: {product.rating} stars.&rdquo;
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">Displaying sample review section. Connect to your backend for real reviews.</p>
        </div>
      </motion.section>

      {/* Related */}
      {related.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 border-t border-rose-100 dark:border-gray-700 pt-12"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Related Products</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} showQuickAdd={false} index={i} />
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}

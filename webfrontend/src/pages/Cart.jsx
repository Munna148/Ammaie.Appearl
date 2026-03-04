import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { Breadcrumb } from "../components";
import { LazyImage } from "../components";

export function Cart() {
  const { items, removeItem, updateQuantity, subtotal, tax, shipping, total } = useCart();

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <Breadcrumb items={[{ label: "Cart" }]} />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/30 py-20 text-center dark:border-gray-700 dark:bg-gray-800">
          <span className="text-6xl">🛒</span>
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Your cart is empty</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Add some beautiful dresses to get started.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block rounded-full bg-rose-500 px-8 py-3 font-medium text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500"
          >
            Shop Now
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <Breadcrumb items={[{ label: "Cart" }]} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                const price = item.product.discount ?? item.product.price;
                const itemTotal = price * item.quantity;
                return (
                  <motion.li
                    key={item.key}
                    layout
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex flex-col gap-4 rounded-xl border border-rose-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-center"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-rose-50 dark:bg-gray-700">
                      <LazyImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        aspectRatio="aspect-square"
                        className="h-full w-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.size} · {item.color}</p>
                      <p className="mt-1 font-medium text-rose-600 dark:text-rose-400">₹{price.toLocaleString()} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center rounded border border-rose-200 dark:border-gray-600 dark:bg-gray-700"
                      >
                        −
                      </motion.button>
                      <span className="w-8 text-center text-sm font-medium dark:text-gray-100">{item.quantity}</span>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded border border-rose-200 dark:border-gray-600 dark:bg-gray-700"
                      >
                        +
                      </motion.button>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">₹{itemTotal.toLocaleString()}</p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="text-sm text-red-600 hover:underline dark:text-red-400"
                    >
                      Remove
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-24 rounded-xl border border-rose-100 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Order Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between dark:text-gray-300">
                <dt className="text-gray-600 dark:text-gray-400">Subtotal</dt>
                <dd>₹{subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between dark:text-gray-300">
                <dt className="text-gray-600 dark:text-gray-400">Tax (5%)</dt>
                <dd>₹{tax.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between dark:text-gray-300">
                <dt className="text-gray-600 dark:text-gray-400">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : `₹${shipping}`}</dd>
              </div>
              <div className="flex justify-between border-t border-rose-100 dark:border-gray-700 pt-4 text-base font-semibold dark:text-white">
                <dt>Total</dt>
                <dd>₹{total.toLocaleString()}</dd>
              </div>
            </dl>
            <Link
              to="/checkout"
              className="mt-6 block w-full rounded-full bg-rose-500 py-3 text-center font-medium text-white transition hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500"
            >
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="mt-3 block text-center text-sm text-rose-600 hover:underline dark:text-rose-400">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

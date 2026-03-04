import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useProfile } from "../../context/ProfileContext";
import { OrderCard } from "./OrderCard";

export function OrderList() {
  const { orders } = useProfile();

  if (!orders?.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-white py-16 dark:border-gray-700 dark:bg-gray-800"
      >
        <span className="text-6xl">📦</span>
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No orders yet</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Your order history will appear here.</p>
        <Link
          to="/shop"
          className="mt-6 rounded-full bg-rose-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500"
        >
          Start Shopping
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Orders</h2>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </motion.div>
  );
}

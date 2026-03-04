import { motion } from "framer-motion";

const TRACKING_STEPS = ["placed", "confirmed", "shipped", "delivered"];
const STATUS_INDEX = { Pending: 0, Processing: 1, Shipped: 2, Delivered: 3 };

export function OrderCard({ order }) {
  const steps = order.tracking || TRACKING_STEPS;
  const currentIndex = STATUS_INDEX[order.status] ?? steps.indexOf(order.status?.toLowerCase()) ?? 0;
  const progress = (currentIndex / (steps.length - 1)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{order.id}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{order.date}</p>
          <p className="mt-1 text-sm text-rose-600 dark:text-rose-400">₹{order.total?.toLocaleString()}</p>
        </div>
        <span className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${
          order.status === "Delivered" ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400" :
          order.status === "Shipped" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400" :
          "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400"
        }`}>
          {order.status}
        </span>
      </div>
      {/* Order tracking progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          {steps.map((step, i) => (
            <span key={step} className={i <= currentIndex ? "font-medium text-rose-600 dark:text-rose-400" : ""}>
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </span>
          ))}
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-rose-100 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-rose-500 dark:bg-rose-600"
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          type="button"
          className="text-sm font-medium text-rose-600 hover:underline dark:text-rose-400"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
}

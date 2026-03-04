import { motion } from "framer-motion";

export function StatCard({ icon, label, value, growth }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {growth != null && (
            <p className={`mt-1 text-xs font-medium ${growth >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {growth >= 0 ? "↑" : "↓"} {Math.abs(growth)}% vs last month
            </p>
          )}
        </div>
        <span className="rounded-lg bg-rose-100 p-3 text-2xl transition-transform group-hover:scale-110 dark:bg-rose-900/40">{icon}</span>
      </div>
    </motion.div>
  );
}

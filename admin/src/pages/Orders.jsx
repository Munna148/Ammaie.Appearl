import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin, useToast } from "../context";

const PER_PAGE = 5;
const STATUSES = ["Pending", "Shipped", "Delivered", "Cancelled"];

export function Orders() {
  const { orders, updateOrderStatus } = useAdmin();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [detailOrder, setDetailOrder] = useState(null);

  const filtered = useMemo(() => {
    let list = orders;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) => o.id.toLowerCase().includes(q) || (o.customerName || "").toLowerCase().includes(q));
    }
    if (statusFilter) list = list.filter((o) => o.status === statusFilter);
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [orders, search, statusFilter]);
  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  const handleStatusChange = (id, status) => {
    updateOrderStatus(id, status);
    addToast("Order status updated");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Management</h1>
      <div className="flex flex-wrap gap-4">
        <input type="search" placeholder="Search by Order ID or customer..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Payment</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginated.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{o.id}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{o.customerName || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{o.date}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400">₹{Number(o.amount).toLocaleString()}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{o.paymentMethod || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <select value={o.status} onChange={(e) => handleStatusChange(o.id, e.target.value)} className="rounded border border-gray-200 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button type="button" onClick={() => setDetailOrder(o)} className="text-rose-600 hover:underline dark:text-rose-400">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="py-8 text-center text-gray-500 dark:text-gray-400">No orders found.</p>}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600">Previous</button>
          <span className="py-1.5 text-sm text-gray-600 dark:text-gray-400">Page {page} of {totalPages}</span>
          <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600">Next</button>
        </div>
      )}
      <AnimatePresence>
        {detailOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDetailOrder(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Details</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div><dt className="text-gray-500 dark:text-gray-400">Order ID</dt><dd className="font-medium text-gray-900 dark:text-white">{detailOrder.id}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">Customer</dt><dd className="font-medium text-gray-900 dark:text-white">{detailOrder.customerName}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">Email</dt><dd className="font-medium text-gray-900 dark:text-white">{detailOrder.customerEmail || "—"}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">Date</dt><dd className="font-medium text-gray-900 dark:text-white">{detailOrder.date}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">Amount</dt><dd className="font-medium text-gray-900 dark:text-white">₹{Number(detailOrder.amount).toLocaleString()}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">Payment</dt><dd className="font-medium text-gray-900 dark:text-white">{detailOrder.paymentMethod || "—"}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">Status</dt><dd className="font-medium text-gray-900 dark:text-white">{detailOrder.status}</dd></div>
              </dl>
              <button type="button" onClick={() => setDetailOrder(null)} className="mt-6 w-full rounded-lg bg-rose-500 py-2 text-sm font-medium text-white hover:bg-rose-600">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

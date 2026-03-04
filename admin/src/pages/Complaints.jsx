import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin, useToast } from "../context";

export function Complaints() {
  const { complaints, updateComplaint, deleteComplaint } = useAdmin();
  const { addToast } = useToast();
  const [statusFilter, setStatusFilter] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => (statusFilter ? complaints.filter((c) => c.status === statusFilter) : complaints), [complaints, statusFilter]);

  const handleResolve = (id) => {
    updateComplaint(id, { status: "Resolved" });
    addToast("Complaint marked as resolved");
  };
  const handleDelete = (id) => {
    deleteComplaint(id);
    setConfirmDelete(null);
    addToast("Complaint deleted");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complaints Management</h1>
      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
        <option value="">All statuses</option>
        <option value="Open">Open</option>
        <option value="Resolved">Resolved</option>
      </select>
      <div className="space-y-4">
        {filtered.map((c) => (
          <motion.div key={c.id} layout className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">#{c.id}</p>
                <p className="font-semibold text-gray-900 dark:text-white">{c.subject}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{c.userName} · {c.email}</p>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{c.message}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Created: {c.createdAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${c.status === "Resolved" ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400" : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400"}`}>{c.status}</span>
                {c.status === "Open" && <button type="button" onClick={() => handleResolve(c.id)} className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600">Mark Resolved</button>}
                <button type="button" onClick={() => setConfirmDelete(c)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20">Delete</button>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && <p className="py-8 text-center text-gray-500 dark:text-gray-400">No complaints found.</p>}
      </div>
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
              <p className="text-gray-700 dark:text-gray-300">Delete complaint &quot;{confirmDelete.subject}&quot;?</p>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => handleDelete(confirmDelete.id)} className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600">Delete</button>
                <button type="button" onClick={() => setConfirmDelete(null)} className="flex-1 rounded-lg border border-gray-200 py-2 text-sm dark:border-gray-600">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

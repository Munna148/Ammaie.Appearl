import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin, useToast } from "../context";

const PER_PAGE = 5;

export function Users() {
  const { users, updateUser, deleteUser } = useAdmin();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewUser, setViewUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter((u) => (u.fullName || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q) || (u.phone || "").includes(q));
  }, [users, search]);
  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  const handleRoleChange = (id, role) => {
    updateUser(id, { role });
    addToast("Role updated");
  };
  const handleDelete = (id) => {
    deleteUser(id);
    setConfirmDelete(null);
    setPage((p) => Math.min(p, Math.ceil((filtered.length - 1) / PER_PAGE) || 1));
    addToast("User removed");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
      <input type="search" placeholder="Search by name, email, phone..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="max-w-xs rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Joined</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginated.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{u.fullName || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{u.phone || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <select value={u.role || "user"} onChange={(e) => handleRoleChange(u.id, e.target.value)} className="rounded border border-gray-200 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{u.joinedDate || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button type="button" onClick={() => setViewUser(u)} className="mr-2 text-rose-600 hover:underline dark:text-rose-400">View</button>
                    <button type="button" onClick={() => setConfirmDelete(u)} className="text-red-600 hover:underline dark:text-red-400">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="py-8 text-center text-gray-500 dark:text-gray-400">No users found.</p>}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600">Previous</button>
          <span className="py-1.5 text-sm text-gray-600 dark:text-gray-400">Page {page} of {totalPages}</span>
          <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600">Next</button>
        </div>
      )}
      <AnimatePresence>
        {viewUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewUser(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Profile</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div><dt className="text-gray-500 dark:text-gray-400">Name</dt><dd className="font-medium text-gray-900 dark:text-white">{viewUser.fullName || "—"}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">Email</dt><dd className="font-medium text-gray-900 dark:text-white">{viewUser.email}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">Phone</dt><dd className="font-medium text-gray-900 dark:text-white">{viewUser.phone || "—"}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">Role</dt><dd className="font-medium text-gray-900 dark:text-white">{viewUser.role || "user"}</dd></div>
                <div><dt className="text-gray-500 dark:text-gray-400">Joined</dt><dd className="font-medium text-gray-900 dark:text-white">{viewUser.joinedDate || "—"}</dd></div>
              </dl>
              <button type="button" onClick={() => setViewUser(null)} className="mt-6 w-full rounded-lg bg-rose-500 py-2 text-sm font-medium text-white hover:bg-rose-600">Close</button>
            </motion.div>
          </motion.div>
        )}
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
              <p className="text-gray-700 dark:text-gray-300">Delete user <strong>{confirmDelete.fullName || confirmDelete.email}</strong>? This cannot be undone.</p>
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

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin, useToast } from "../context";

const PER_PAGE = 5;
const CATEGORIES = ["Casual", "Party", "Traditional", "Formal"];

export function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [modalProduct, setModalProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    let list = products;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q));
    }
    if (categoryFilter) list = list.filter((p) => p.category === categoryFilter);
    return list;
  }, [products, search, categoryFilter]);
  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  const handleSave = (form) => {
    if (modalProduct?.id) {
      updateProduct(modalProduct.id, form);
      addToast("Product updated");
    } else {
      addProduct(form);
      addToast("Product added");
    }
    setModalProduct(null);
  };
  const handleDelete = (id) => {
    deleteProduct(id);
    setConfirmDelete(null);
    addToast("Product deleted");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Management</h1>
      <div className="flex flex-wrap gap-4">
        <input type="search" placeholder="Search products..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="button" onClick={() => setModalProduct({})} className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600">Add Product</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginated.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                      {p.image ? <img src={p.image} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center text-2xl">👗</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{p.category || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">₹{Number(p.price).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <input type="number" min={0} value={p.stock} onChange={(e) => updateProduct(p.id, { stock: Number(e.target.value) || 0 })} className="w-16 rounded border border-gray-200 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100" />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">⭐ {p.rating ?? "—"}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => updateProduct(p.id, { active: !p.active })} className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.active !== false ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400" : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400"}`}>{p.active !== false ? "Active" : "Inactive"}</button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button type="button" onClick={() => setModalProduct(p)} className="mr-2 text-rose-600 hover:underline dark:text-rose-400">Edit</button>
                    <button type="button" onClick={() => setConfirmDelete(p)} className="text-red-600 hover:underline dark:text-red-400">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="py-8 text-center text-gray-500 dark:text-gray-400">No products found.</p>}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600">Previous</button>
          <span className="py-1.5 text-sm text-gray-600 dark:text-gray-400">Page {page} of {totalPages}</span>
          <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600">Next</button>
        </div>
      )}
      <AnimatePresence>
        {modalProduct !== null && <ProductModal product={modalProduct} onSave={handleSave} onClose={() => setModalProduct(null)} />}
        {confirmDelete && <ConfirmModal title="Delete product?" message={`Remove "${confirmDelete.name}"?`} onConfirm={() => handleDelete(confirmDelete.id)} onCancel={() => setConfirmDelete(null)} />}
      </AnimatePresence>
    </motion.div>
  );
}

function ProductModal({ product, onSave, onClose }) {
  const [form, setForm] = useState({ name: product.name ?? "", category: product.category ?? "Casual", price: product.price ?? "", stock: product.stock ?? 0, rating: product.rating ?? "", active: product.active !== false });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, price: Number(form.price) || 0, stock: Number(form.stock) || 0, rating: form.rating ? Number(form.rating) : undefined });
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.id ? "Edit Product" : "Add Product"}</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label><input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label><select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white">{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (₹)</label><input type="number" required min={0} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label><input type="number" min={0} value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rating (optional)</label><input type="number" min={0} max={5} step={0.1} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <div className="flex items-center gap-2"><input type="checkbox" id="active" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="rounded border-gray-300" /><label htmlFor="active" className="text-sm text-gray-700 dark:text-gray-300">Active</label></div>
          <div className="flex gap-2 pt-2"><button type="submit" className="flex-1 rounded-lg bg-rose-500 py-2 text-sm font-medium text-white hover:bg-rose-600">Save</button><button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-200 py-2 text-sm dark:border-gray-600">Cancel</button></div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p>
        <div className="mt-4 flex gap-2"><button type="button" onClick={onConfirm} className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600">Delete</button><button type="button" onClick={onCancel} className="flex-1 rounded-lg border border-gray-200 py-2 text-sm dark:border-gray-600">Cancel</button></div>
      </motion.div>
    </motion.div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export function DeleteAccountSection() {
  const { deleteAccount } = useAuth();
  const { addToast } = useToast();
  const [confirm, setConfirm] = useState("");
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    if (confirm !== "DELETE") {
      addToast("Type DELETE to confirm", "error");
      return;
    }
    deleteAccount();
    addToast("Account deleted.");
    setOpen(false);
    setConfirm("");
    window.location.href = "/";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-red-200 bg-white p-6 dark:border-red-900/50 dark:bg-gray-800"
    >
      <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Delete Account</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Permanently delete your account and all associated data. This cannot be undone.
      </p>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 rounded-full border border-red-500 px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          Delete my account
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">Type <strong>DELETE</strong> to confirm.</p>
          <input
            type="text"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="DELETE"
            className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Confirm Delete
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); setConfirm(""); }}
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

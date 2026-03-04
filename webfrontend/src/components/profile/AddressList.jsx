import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "../../context/ProfileContext";
import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";

export function AddressList() {
  const { addresses } = useProfile();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Addresses</h2>
        {!showForm && !editing && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="rounded-full bg-rose-500 px-5 py-2 text-sm font-medium text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500"
          >
            + Add Address
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {(showForm || editing) ? (
          <AddressForm
            key={editing?.id ?? "new"}
            address={editing}
            onDone={() => { setShowForm(false); setEditing(null); }}
          />
        ) : (
          <>
            {addresses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-white py-16 dark:border-gray-700 dark:bg-gray-800"
              >
                <span className="text-6xl">📍</span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No addresses yet</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Add an address for faster checkout.</p>
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="mt-6 rounded-full bg-rose-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-600 dark:bg-rose-600"
                >
                  Add Address
                </button>
              </motion.div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {addresses.map((addr) => (
                  <AddressCard key={addr.id} address={addr} onEdit={setEditing} />
                ))}
              </div>
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

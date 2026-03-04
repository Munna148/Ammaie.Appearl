import { motion } from "framer-motion";
import { useProfile } from "../../context/ProfileContext";
import { useToast } from "../../context/ToastContext";

export function AddressCard({ address, onEdit }) {
  const { deleteAddress, setDefaultAddress } = useProfile();
  const { addToast } = useToast();

  const handleSetDefault = () => {
    setDefaultAddress(address.id);
    addToast("Default address updated!");
  };

  const handleDelete = () => {
    if (window.confirm("Delete this address?")) {
      deleteAddress(address.id);
      addToast("Address removed.");
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      {address.isDefault && (
        <span className="mb-2 inline-block rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-400">
          Default
        </span>
      )}
      <p className="font-medium text-gray-900 dark:text-white">{address.fullName}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{address.phone}</p>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {address.street}, {address.city}, {address.state} {address.pincode}, {address.country}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {!address.isDefault && (
          <button
            type="button"
            onClick={handleSetDefault}
            className="text-sm font-medium text-rose-600 hover:underline dark:text-rose-400"
          >
            Set as default
          </button>
        )}
        <button type="button" onClick={() => onEdit?.(address)} className="text-sm font-medium text-rose-600 hover:underline dark:text-rose-400">
          Edit
        </button>
        <button type="button" onClick={handleDelete} className="text-sm font-medium text-red-600 hover:underline dark:text-red-400">
          Delete
        </button>
      </div>
    </motion.div>
  );
}

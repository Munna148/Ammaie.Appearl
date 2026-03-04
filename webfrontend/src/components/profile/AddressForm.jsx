import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useProfile } from "../../context/ProfileContext";
import { useToast } from "../../context/ToastContext";

const INITIAL = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export function AddressForm({ address, onDone }) {
  const { addAddress, updateAddress } = useProfile();
  const { addToast } = useToast();
  const [form, setForm] = useState(address || INITIAL);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(address ? { ...INITIAL, ...address } : INITIAL);
  }, [address?.id]);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName?.trim()) e.fullName = "Required";
    if (!form.phone?.trim()) e.phone = "Required";
    if (!form.street?.trim()) e.street = "Required";
    if (!form.city?.trim()) e.city = "Required";
    if (!form.state?.trim()) e.state = "Required";
    if (!form.pincode?.trim()) e.pincode = "Required";
    if (!form.country?.trim()) e.country = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (address?.id) {
      updateAddress(address.id, form);
      addToast("Address updated!");
    } else {
      addAddress({ ...form, isDefault: false });
      addToast("Address added!");
    }
    onDone?.();
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-rose-100 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
    >
      <h3 className="font-semibold text-gray-900 dark:text-white">{address ? "Edit Address" : "Add New Address"}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Street Address</label>
        <input
          type="text"
          value={form.street}
          onChange={(e) => handleChange("street", e.target.value)}
          className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        {errors.street && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.street}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {errors.city && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => handleChange("state", e.target.value)}
            className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {errors.state && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.state}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pincode</label>
          <input
            type="text"
            value={form.pincode}
            onChange={(e) => handleChange("pincode", e.target.value)}
            className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {errors.pincode && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pincode}</p>}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
        <input
          type="text"
          value={form.country}
          onChange={(e) => handleChange("country", e.target.value)}
          className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div className="flex gap-2">
        <motion.button type="submit" whileTap={{ scale: 0.98 }} className="rounded-full bg-rose-500 px-5 py-2 text-sm font-medium text-white hover:bg-rose-600 dark:bg-rose-600">
          {address ? "Update" : "Add"} Address
        </motion.button>
        {onDone && (
          <button type="button" onClick={onDone} className="rounded-full border border-rose-200 px-5 py-2 text-sm font-medium text-rose-600 dark:border-gray-600 dark:text-rose-400">
            Cancel
          </button>
        )}
      </div>
    </motion.form>
  );
}

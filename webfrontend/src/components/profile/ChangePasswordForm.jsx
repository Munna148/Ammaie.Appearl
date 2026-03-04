import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ mode: "onBlur" });
  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    setLoading(true);
    const result = changePassword(data.currentPassword, data.newPassword);
    setLoading(false);
    if (result?.success) {
      addToast("Password changed successfully!");
      reset();
    } else {
      addToast(result?.message || "Failed to change password", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
          <input
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            {...register("currentPassword", { required: "Required" })}
          />
          {errors.currentPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.currentPassword.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
          <input
            type="password"
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            {...register("newPassword", {
              required: "Required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
          />
          {errors.newPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.newPassword.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
          <input
            type="password"
            autoComplete="new-password"
            className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            {...register("confirmPassword", {
              required: "Required",
              validate: (v) => v === newPassword || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>}
        </div>
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-full bg-rose-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-70 dark:bg-rose-600 dark:hover:bg-rose-500"
        >
          {loading ? "Updating..." : "Update Password"}
        </motion.button>
      </form>
    </motion.div>
  );
}

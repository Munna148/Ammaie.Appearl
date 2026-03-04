import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Register() {
  const { register: registerUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = registerUser(data.email, data.password);
      if (result?.success) {
        addToast("Account created! Welcome.");
        navigate("/");
      } else {
        addToast("Registration failed", "error");
      }
    } catch {
      addToast("Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex min-h-[85vh] max-w-md flex-col justify-center px-4 py-12"
    >
      <div className="rounded-2xl border border-rose-100 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Join Ammaie Apparels for the best dresses</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2.5 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-rose-500"
              {...registerField("email", {
                required: "Email is required",
                pattern: { value: emailRegex, message: "Please enter a valid email" },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full rounded-lg border border-rose-200 px-3 py-2.5 pr-10 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-rose-500"
                {...registerField("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="reg-confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                id="reg-confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                className="w-full rounded-lg border border-rose-200 px-3 py-2.5 pr-10 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-rose-500"
                {...registerField("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (v) => v === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? "🙈" : "👁"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
            )}
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="w-full rounded-full bg-rose-500 py-3 font-medium text-white transition hover:bg-rose-600 disabled:opacity-70 dark:bg-rose-600 dark:hover:bg-rose-500"
          >
            {loading ? "Creating account..." : "Register"}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-rose-600 hover:underline dark:text-rose-400">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Login() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm({ mode: "onBlur" });
  const rememberMe = watch("rememberMe");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = login(data.email, data.password, data.rememberMe);
      if (result?.success) {
        addToast("Welcome back!");
        navigate(from, { replace: true });
      } else {
        setError("root", { message: "Invalid email or password" });
        addToast("Login failed", "error");
      }
    } catch {
      setError("root", { message: "Something went wrong" });
      addToast("Login failed", "error");
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Login</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">Welcome back to Ammaie Apparels</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {errors.root && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
            >
              {errors.root.message}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="login-email"
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
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="w-full rounded-lg border border-rose-200 px-3 py-2.5 pr-10 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-rose-500"
                {...registerField("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
            className="flex items-center justify-between"
          >
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                {...registerField("rememberMe")}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-rose-600 hover:underline dark:text-rose-400"
            >
              Forgot password?
            </Link>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="w-full rounded-full bg-rose-500 py-3 font-medium text-white transition hover:bg-rose-600 disabled:opacity-70 dark:bg-rose-600 dark:hover:bg-rose-500"
          >
            {loading ? "Signing in..." : "Login"}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-rose-600 hover:underline dark:text-rose-400">
            Register
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useToast } from "../context/ToastContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPassword() {
  const { addToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
    addToast("If an account exists, we've sent a reset link to your email.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12"
    >
      <div className="rounded-2xl border border-rose-100 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 rounded-lg bg-rose-50 p-4 text-center dark:bg-rose-900/20"
          >
            <p className="text-rose-700 dark:text-rose-400">
              Check your inbox. If you don&apos;t see an email, check your spam folder.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-block text-sm font-medium text-rose-600 hover:underline dark:text-rose-400"
            >
              Back to Login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2.5 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: emailRegex, message: "Please enter a valid email" },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-rose-500 py-3 font-medium text-white transition hover:bg-rose-600 disabled:opacity-70 dark:bg-rose-600 dark:hover:bg-rose-500"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <Link to="/login" className="font-medium text-rose-600 hover:underline dark:text-rose-400">
            ← Back to Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

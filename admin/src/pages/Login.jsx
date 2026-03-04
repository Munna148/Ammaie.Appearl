import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } from "../admin";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = login(email, password);
    if (result?.success) {
      navigate(from, { replace: true });
    } else {
      setError(result?.message || "Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Ammaie Apparels Admin Panel</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ammaie.com" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-rose-500 py-3 font-medium text-white hover:bg-rose-600 disabled:opacity-70">Sign in</button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-500">Demo: {DEFAULT_ADMIN_EMAIL} / {DEFAULT_ADMIN_PASSWORD}</p>
      </div>
    </motion.div>
  );
}

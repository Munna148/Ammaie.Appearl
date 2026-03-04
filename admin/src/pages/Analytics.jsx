import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useAdmin } from "../context";
import { StatCard } from "../components/StatCard";

const PINK = "#f43f5e";

function salesByCategory(products) {
  const byCat = {};
  products.forEach((p) => { byCat[p.category || "Other"] = (byCat[p.category || "Other"] || 0) + 1; });
  return Object.entries(byCat).map(([name, count]) => ({ name, sales: count }));
}

function registrationsByMonth(users) {
  const byMonth = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
    byMonth[key] = 0;
  }
  users.forEach((u) => {
    const key = (u.joinedDate || "").slice(0, 7);
    const label = key ? new Date(key + "-01").toLocaleString("default", { month: "short", year: "2-digit" }) : "";
    if (byMonth[label] != null) byMonth[label]++;
  });
  return Object.entries(byMonth).map(([name, users]) => ({ name, users }));
}

function topCustomers(orders) {
  const byEmail = {};
  orders.forEach((o) => {
    const e = o.customerEmail || o.customerName || "Unknown";
    byEmail[e] = (byEmail[e] || 0) + (Number(o.amount) || 0);
  });
  return Object.entries(byEmail)
    .map(([name, revenue]) => ({ name: name.length > 20 ? name.slice(0, 20) + "…" : name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

export function Analytics() {
  const { users, products, orders } = useAdmin();
  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + (Number(o.amount) || 0), 0), [orders]);
  const salesData = useMemo(() => salesByCategory(products), [products]);
  const regData = useMemo(() => registrationsByMonth(users), [users]);
  const topCustData = useMemo(() => topCustomers(orders), [orders]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="💰" label="Revenue Summary" value={`₹${(totalRevenue / 1000).toFixed(0)}k`} />
        <StatCard icon="👥" label="Total Users" value={users.length} />
        <StatCard icon="📦" label="Total Orders" value={orders.length} />
        <StatCard icon="👗" label="Products" value={products.length} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Products by category</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData.length ? salesData : [{ name: "No data", sales: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="sales" fill={PINK} radius={[4, 4, 0, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">User registrations per month</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="users" fill={PINK} radius={[4, 4, 0, 0]} name="New users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Top customers by revenue (₹)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCustData.length ? topCustData : [{ name: "No data", revenue: 0 }]} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
              <XAxis type="number" stroke="#6b7280" tickFormatter={(v) => `₹${v}`} />
              <YAxis type="category" dataKey="name" width={80} stroke="#6b7280" />
              <Tooltip formatter={(v) => [`₹${v}`, "Revenue"]} />
              <Bar dataKey="revenue" fill={PINK} radius={[0, 4, 4, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

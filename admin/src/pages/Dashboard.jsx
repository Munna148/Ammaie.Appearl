import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { useAdmin } from "../context/AdminContext";
import { StatCard } from "../components/StatCard";

const CHART_COLORS = ["#f43f5e", "#fb7185", "#fda4af", "#fecdd3", "#e11d48"];

function getOrdersPerMonth(orders) {
  const byMonth = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
    byMonth[key] = 0;
  }
  orders.forEach((o) => {
    const key = new Date(o.date).toLocaleString("default", { month: "short", year: "2-digit" });
    if (byMonth[key] != null) byMonth[key]++;
  });
  return Object.entries(byMonth).map(([name, orders]) => ({ name, orders }));
}

function getRevenueByMonth(orders) {
  const byMonth = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
    byMonth[key] = 0;
  }
  orders.forEach((o) => {
    const key = new Date(o.date).toLocaleString("default", { month: "short", year: "2-digit" });
    if (byMonth[key] != null) byMonth[key] += Number(o.amount) || 0;
  });
  return Object.entries(byMonth).map(([name, revenue]) => ({ name, revenue }));
}

export function Dashboard() {
  const { users, products, orders, complaints } = useAdmin();
  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + (Number(o.amount) || 0), 0), [orders]);
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === "Pending").length, [orders]);
  const ordersPerMonthData = useMemo(() => getOrdersPerMonth(orders), [orders]);
  const revenueData = useMemo(() => getRevenueByMonth(orders), [orders]);
  const topProductsData = useMemo(
    () => products.slice(0, 5).map((p, i) => ({ name: p.name, value: (5 - i) * 10 + 5 })).filter((d) => d.value > 0) || [{ name: "No data", value: 1 }],
    [products]
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon="👥" label="Total Users" value={users.length} growth={12} />
        <StatCard icon="📦" label="Total Orders" value={orders.length} growth={8} />
        <StatCard icon="👗" label="Total Products" value={products.length} growth={5} />
        <StatCard icon="💰" label="Total Revenue" value={`₹${(totalRevenue / 1000).toFixed(0)}k`} growth={15} />
        <StatCard icon="⏳" label="Pending Orders" value={pendingOrders} growth={-3} />
        <StatCard icon="💬" label="Complaints" value={complaints.length} growth={0} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Orders per month</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersPerMonthData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ borderRadius: "8px" }} />
                <Bar dataKey="orders" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Revenue (₹)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ borderRadius: "8px" }} formatter={(v) => [`₹${v}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#f43f5e" strokeWidth={2} dot={{ fill: "#f43f5e" }} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="max-w-md rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Top selling products</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={topProductsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {topProductsData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v, name) => [v, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

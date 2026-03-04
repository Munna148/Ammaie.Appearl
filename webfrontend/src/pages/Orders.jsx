import { Link } from "react-router-dom";
import { ProtectedRoute } from "../components";
import { Breadcrumb } from "../components";
import { OrderList } from "../components/profile";

function OrdersContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ to: "/profile", label: "Profile" }, { label: "Orders" }]} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
      <OrderList />
    </div>
  );
}

export function Orders() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}

import { createContext, useContext, useState, useCallback, useEffect } from "react";

const AdminContext = createContext(null);
const USERS_KEY = "ammaie-admin-users";
const PRODUCTS_KEY = "ammaie-admin-products";
const ORDERS_KEY = "ammaie-admin-orders";
const COMPLAINTS_KEY = "ammaie-admin-complaints";

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

const SEED_USERS = [
  { id: "1", fullName: "Admin User", email: "admin@ammaie.com", phone: "9876543210", role: "admin", joinedDate: "2024-01-01" },
  { id: "2", fullName: "Priya Sharma", email: "priya@example.com", phone: "9123456789", role: "user", joinedDate: "2025-01-15" },
  { id: "3", fullName: "Anita Reddy", email: "anita@example.com", phone: "9988776655", role: "user", joinedDate: "2025-02-01" },
  { id: "4", fullName: "Meera Krishnan", email: "meera@example.com", phone: "9876123450", role: "user", joinedDate: "2025-02-10" },
  { id: "5", fullName: "Sneha Patel", email: "sneha@example.com", phone: "9765432109", role: "user", joinedDate: "2025-02-20" },
];

const SEED_PRODUCTS = [
  { id: "p1", name: "Floral Summer Dress", category: "Casual", price: 1999, stock: 45, rating: 4.5, image: null, active: true },
  { id: "p2", name: "Party Wear Gown", category: "Party", price: 4499, stock: 12, rating: 4.8, image: null, active: true },
  { id: "p3", name: "Cotton Day Dress", category: "Casual", price: 1299, stock: 80, rating: 4.2, image: null, active: true },
  { id: "p4", name: "Designer Lehenga", category: "Traditional", price: 8999, stock: 8, rating: 4.9, image: null, active: true },
  { id: "p5", name: "Anarkali Suit", category: "Traditional", price: 2599, stock: 25, rating: 4.6, image: null, active: true },
  { id: "p6", name: "Evening Cocktail Dress", category: "Party", price: 3599, stock: 15, rating: 4.4, image: null, active: false },
];

const SEED_ORDERS = [
  { id: "ORD-A001", customerName: "Priya Sharma", customerEmail: "priya@example.com", date: "2025-02-20", amount: 4299, paymentMethod: "COD", status: "Delivered" },
  { id: "ORD-A002", customerName: "Anita Reddy", customerEmail: "anita@example.com", date: "2025-02-18", amount: 8199, paymentMethod: "Online", status: "Shipped" },
  { id: "ORD-A003", customerName: "Meera Krishnan", customerEmail: "meera@example.com", date: "2025-02-22", amount: 1999, paymentMethod: "COD", status: "Pending" },
  { id: "ORD-A004", customerName: "Sneha Patel", customerEmail: "sneha@example.com", date: "2025-02-15", amount: 8999, paymentMethod: "Online", status: "Delivered" },
  { id: "ORD-A005", customerName: "Priya Sharma", customerEmail: "priya@example.com", date: "2025-02-10", amount: 2599, paymentMethod: "COD", status: "Cancelled" },
];

const SEED_COMPLAINTS = [
  { id: "c1", userId: "2", userName: "Priya Sharma", email: "priya@example.com", subject: "Wrong size delivered", message: "I ordered M but received S.", status: "Open", createdAt: "2025-02-21" },
  { id: "c2", userId: "4", userName: "Meera Krishnan", email: "meera@example.com", subject: "Late delivery", message: "Order was supposed to arrive on 20th.", status: "Resolved", createdAt: "2025-02-19" },
];

export function AdminProvider({ children }) {
  const [users, setUsers] = useState(() => load(USERS_KEY, SEED_USERS));
  const [products, setProducts] = useState(() => load(PRODUCTS_KEY, SEED_PRODUCTS));
  const [orders, setOrders] = useState(() => load(ORDERS_KEY, SEED_ORDERS));
  const [complaints, setComplaints] = useState(() => load(COMPLAINTS_KEY, SEED_COMPLAINTS));

  useEffect(() => { save(USERS_KEY, users); }, [users]);
  useEffect(() => { save(PRODUCTS_KEY, products); }, [products]);
  useEffect(() => { save(ORDERS_KEY, orders); }, [orders]);
  useEffect(() => { save(COMPLAINTS_KEY, complaints); }, [complaints]);

  const updateUser = useCallback((id, updates) => setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u))), []);
  const deleteUser = useCallback((id) => setUsers((prev) => prev.filter((u) => u.id !== id)), []);
  const addProduct = useCallback((product) => {
    const newProduct = { id: `p${Date.now()}`, ...product, active: product.active !== false };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct.id;
  }, []);
  const updateProduct = useCallback((id, updates) => setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p))), []);
  const deleteProduct = useCallback((id) => setProducts((prev) => prev.filter((p) => p.id !== id)), []);
  const updateOrderStatus = useCallback((id, status) => setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o))), []);
  const addComplaint = useCallback((complaint) => {
    const newComplaint = { id: `c${Date.now()}`, ...complaint, status: "Open", createdAt: new Date().toISOString().slice(0, 10) };
    setComplaints((prev) => [...prev, newComplaint]);
    return newComplaint.id;
  }, []);
  const updateComplaint = useCallback((id, updates) => setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c))), []);
  const deleteComplaint = useCallback((id) => setComplaints((prev) => prev.filter((c) => c.id !== id)), []);

  const value = {
    users,
    products,
    orders,
    complaints,
    updateUser,
    deleteUser,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    addComplaint,
    updateComplaint,
    deleteComplaint,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

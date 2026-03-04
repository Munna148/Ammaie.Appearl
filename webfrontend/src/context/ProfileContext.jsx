import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext(null);
const ADDRESSES_KEY = "ammaie-addresses";
const ORDERS_KEY = "ammaie-orders";

function getStoredAddresses(userId) {
  try {
    const raw = localStorage.getItem(`${ADDRESSES_KEY}-${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getStoredOrders(userId) {
  try {
    const raw = localStorage.getItem(`${ORDERS_KEY}-${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const DEMO_ORDERS = [
  { id: "ORD-001", date: "2025-02-20", status: "Delivered", total: 4299, items: 2, tracking: ["placed", "confirmed", "shipped", "delivered"] },
  { id: "ORD-002", date: "2025-02-15", status: "Shipped", total: 8199, items: 3, tracking: ["placed", "confirmed", "shipped"] },
  { id: "ORD-003", date: "2025-02-10", status: "Processing", total: 1999, items: 1, tracking: ["placed", "confirmed"] },
];

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user?.id) {
      setAddresses([]);
      setOrders([]);
      return;
    }
    setAddresses(getStoredAddresses(user.id));
    const stored = getStoredOrders(user.id);
    setOrders(stored ?? DEMO_ORDERS);
    if (!stored) {
      localStorage.setItem(`${ORDERS_KEY}-${user.id}`, JSON.stringify(DEMO_ORDERS));
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    localStorage.setItem(`${ADDRESSES_KEY}-${user.id}`, JSON.stringify(addresses));
  }, [user?.id, addresses]);

  const addAddress = useCallback((address) => {
    const newAddr = {
      id: Date.now().toString(),
      ...address,
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => {
      if (newAddr.isDefault) {
        return prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr);
      }
      return [...prev, newAddr];
    });
    return newAddr.id;
  }, [addresses.length]);

  const updateAddress = useCallback((id, updates) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  }, []);

  const deleteAddress = useCallback((id) => {
    setAddresses((prev) => {
      const removed = prev.find((a) => a.id === id);
      const next = prev.filter((a) => a.id !== id);
      if (removed?.isDefault && next.length > 0) {
        next[0].isDefault = true;
      }
      return next;
    });
  }, []);

  const setDefaultAddress = useCallback((id) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  }, []);

  const value = {
    addresses,
    orders,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    setOrders,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}

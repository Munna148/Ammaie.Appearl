import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { isDefaultAdminEmail } from "../admin";

const AuthContext = createContext(null);
const STORAGE_KEY = "ammaie-admin-auth";

function getStored() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getStored());
  }, []);

  const login = useCallback((email, password) => {
    const emailNorm = email.trim().toLowerCase();
    if (!isDefaultAdminEmail(emailNorm)) {
      return { success: false, message: "Access denied. Admin only." };
    }
    const userData = {
      id: "admin-1",
      email: emailNorm,
      fullName: "Admin",
      role: "admin",
      avatar: null,
    };
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateAvatar = useCallback((base64) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, avatar: base64 };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const changePassword = useCallback((current, newPass) => {
    if (!newPass || newPass.length < 6) return { success: false, message: "Password must be at least 6 characters" };
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile, updateAvatar, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

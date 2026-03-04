import { createContext, useContext, useState, useCallback, useEffect } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "girls-dresses-auth";
const PROFILE_KEY = "ammaie-profile";
const REMEMBER_KEY = "girls-dresses-remember";

function getStoredUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function getStoredProfile(email) {
  if (!email) return null;
  try {
    const data = localStorage.getItem(`${PROFILE_KEY}-${email}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveProfile(email, profile) {
  if (!email) return;
  localStorage.setItem(`${PROFILE_KEY}-${email}`, JSON.stringify(profile));
}

function getRememberMe() {
  try {
    return localStorage.getItem(REMEMBER_KEY) === "true";
  } catch {
    return false;
  }
}

const defaultProfile = () => ({
  fullName: "",
  phone: "",
  gender: "",
  dob: "",
  avatar: null,
  memberSince: new Date().toISOString().slice(0, 10),
  emailVerified: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      setInitialized(true);
      return;
    }
    const profile = getStoredProfile(stored.email);
    setUser(profile ? { ...stored, ...profile } : stored);
    setInitialized(true);
  }, []);

  const login = useCallback((email, password, rememberMe = false) => {
    const emailNorm = email.trim().toLowerCase();
    const existingProfile = getStoredProfile(emailNorm);
    const userData = existingProfile
      ? { ...existingProfile }
      : {
          id: Date.now(),
          email: emailNorm,
          ...defaultProfile(),
          memberSince: new Date().toISOString().slice(0, 10),
        };
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: userData.id, email: userData.email }));
    saveProfile(emailNorm, userData);
    localStorage.setItem(REMEMBER_KEY, rememberMe ? "true" : "false");
    return { success: true };
  }, []);

  const register = useCallback((email, password) => {
    const emailNorm = email.trim().toLowerCase();
    const userData = {
      id: Date.now(),
      email: emailNorm,
      ...defaultProfile(),
      memberSince: new Date().toISOString().slice(0, 10),
    };
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: userData.id, email: userData.email }));
    saveProfile(emailNorm, userData);
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
      saveProfile(prev.email, next);
      return next;
    });
  }, []);

  const updateAvatar = useCallback((base64) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, avatar: base64 };
      saveProfile(prev.email, next);
      return next;
    });
  }, []);

  const changePassword = useCallback((currentPassword, newPassword) => {
    if (!newPassword || newPassword.length < 6) return { success: false, message: "Password must be at least 6 characters" };
    return { success: true };
  }, []);

  const deleteAccount = useCallback(() => {
    if (user?.email) {
      localStorage.removeItem(`${PROFILE_KEY}-${user.email}`);
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, [user?.email]);

  const value = {
    user,
    currentUser: user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    updateAvatar,
    changePassword,
    deleteAccount,
    initialized,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

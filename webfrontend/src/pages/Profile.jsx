import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { ProtectedRoute } from "../components";
import {
  ProfileSidebar,
  MyProfileSection,
  ChangePasswordForm,
  OrderList,
  AddressList,
  DeleteAccountSection,
} from "../components/profile";

const SECTIONS = {
  profile: { title: "My Profile", Component: MyProfileSection },
  orders: { title: "My Orders", Component: OrderList },
  addresses: { title: "My Addresses", Component: AddressList },
  password: { title: "Change Password", Component: ChangePasswordForm },
};

function ProfileDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [section, setSection] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const { title, Component } = SECTIONS[section] || SECTIONS.profile;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-gray-700 lg:hidden dark:text-gray-300"
          aria-label="Open menu"
        >
          ☰
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account</h1>
      </div>

      <div className="flex gap-8">
        <ProfileSidebar
          currentSection={section}
          onSelect={setSection}
          onLogout={handleLogout}
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
              <Component />
              {section === "profile" && (
                <div className="mt-8">
                  <DeleteAccountSection />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export function Profile() {
  return (
    <ProtectedRoute>
      <ProfileDashboard />
    </ProtectedRoute>
  );
}

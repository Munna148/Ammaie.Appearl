import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { ProfileAvatar } from "./ProfileAvatar";

const GENDERS = ["Female", "Male", "Other", "Prefer not to say"];

export function MyProfileSection() {
  const { user, updateProfile, updateAvatar } = useAuth();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    phone: user?.phone ?? "",
    gender: user?.gender ?? "",
    dob: user?.dob ?? "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "",
      gender: user?.gender ?? "",
      dob: user?.dob ?? "",
    });
  }, [user?.fullName, user?.phone, user?.gender, user?.dob]);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const e = {};
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    updateProfile(form);
    setEditing(false);
    addToast("Profile updated successfully!");
  };

  const handleCancel = () => {
    setForm({
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "",
      gender: user?.gender ?? "",
      dob: user?.dob ?? "",
    });
    setErrors({});
    setEditing(false);
  };

  const memberSince = user?.memberSince
    ? new Date(user.memberSince).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <ProfileAvatar editable={editing} onUpload={updateAvatar} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Profile</h2>
            {user?.emailVerified && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400">
                ✓ Email verified
              </span>
            )}
          </div>
          {!editing ? (
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="text-gray-500 dark:text-gray-400">Full Name:</span> <span className="text-gray-900 dark:text-white">{user?.fullName || "—"}</span></p>
              <p><span className="text-gray-500 dark:text-gray-400">Email:</span> <span className="text-gray-900 dark:text-white">{user?.email}</span></p>
              <p><span className="text-gray-500 dark:text-gray-400">Phone:</span> <span className="text-gray-900 dark:text-white">{user?.phone || "—"}</span></p>
              <p><span className="text-gray-500 dark:text-gray-400">Gender:</span> <span className="text-gray-900 dark:text-white">{user?.gender || "—"}</span></p>
              <p><span className="text-gray-500 dark:text-gray-400">Date of Birth:</span> <span className="text-gray-900 dark:text-white">{user?.dob || "—"}</span></p>
              <p><span className="text-gray-500 dark:text-gray-400">Member since:</span> <span className="text-gray-900 dark:text-white">{memberSince}</span></p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input type="email" value={user?.email} disabled className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500 dark:border-gray-600 dark:bg-gray-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                <input
                  type="date"
                  value={form.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-rose-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          )}
          <div className="mt-6 flex gap-2">
            {!editing ? (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setEditing(true)}
                className="rounded-full bg-rose-500 px-5 py-2 text-sm font-medium text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500"
              >
                Edit Profile
              </motion.button>
            ) : (
              <>
                <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={handleSave} className="rounded-full bg-rose-500 px-5 py-2 text-sm font-medium text-white hover:bg-rose-600">
                  Save
                </motion.button>
                <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={handleCancel} className="rounded-full border border-rose-200 px-5 py-2 text-sm font-medium text-rose-600 dark:border-gray-600 dark:text-rose-400">
                  Cancel
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

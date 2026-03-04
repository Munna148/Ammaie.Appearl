import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth, useTheme, useToast } from "../context";
import { ProfileAvatar } from "../components/ProfileAvatar";

export function Settings() {
  const { user, updateProfile, updateAvatar, changePassword } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [profileForm, setProfileForm] = useState({ fullName: user?.fullName ?? "", phone: user?.phone ?? "" });
  const [passForm, setPassForm] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState({ email: true, order: true });

  useEffect(() => {
    setProfileForm({ fullName: user?.fullName ?? "", phone: user?.phone ?? "" });
  }, [user?.fullName, user?.phone]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    addToast("Profile updated");
  };
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passForm.new !== passForm.confirm) {
      addToast("New passwords do not match", "error");
      return;
    }
    const result = changePassword(passForm.current, passForm.new);
    if (result.success) {
      addToast("Password changed");
      setPassForm({ current: "", new: "", confirm: "" });
    } else {
      addToast(result.message || "Failed to change password", "error");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Profile</h2>
        <div className="mt-4 flex items-center gap-4">
          <ProfileAvatar size="lg" editable onUpload={(base64) => { updateAvatar(base64); addToast("Profile image updated"); }} />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Profile picture</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Upload (stored in browser)</p>
          </div>
        </div>
        <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label><input type="text" value={profileForm.fullName} onChange={(e) => setProfileForm((f) => ({ ...f, fullName: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label><input type="text" value={user?.email ?? ""} disabled className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label><input type="text" value={profileForm.phone} onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <button type="submit" className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600">Save changes</button>
        </form>
      </section>
      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
        <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label><input type="password" value={passForm.current} onChange={(e) => setPassForm((f) => ({ ...f, current: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password (min 6)</label><input type="password" value={passForm.new} onChange={(e) => setPassForm((f) => ({ ...f, new: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label><input type="password" value={passForm.confirm} onChange={(e) => setPassForm((f) => ({ ...f, confirm: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white" /></div>
          <button type="submit" className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600">Change Password</button>
        </form>
      </section>
      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">Dark mode</span>
          <button type="button" onClick={toggleTheme} className={`relative h-6 w-11 rounded-full transition ${isDark ? "bg-rose-500" : "bg-gray-200 dark:bg-gray-600"}`}><span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition ${isDark ? "translate-x-5" : ""}`} /></button>
        </div>
      </section>
      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications (UI only)</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-2"><input type="checkbox" checked={notifications.email} onChange={(e) => setNotifications((n) => ({ ...n, email: e.target.checked }))} className="rounded border-gray-300" /><span className="text-sm text-gray-700 dark:text-gray-300">Email notifications</span></label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={notifications.order} onChange={(e) => setNotifications((n) => ({ ...n, order: e.target.checked }))} className="rounded border-gray-300" /><span className="text-sm text-gray-700 dark:text-gray-300">Order updates</span></label>
        </div>
      </section>
    </motion.div>
  );
}

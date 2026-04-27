import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useDev } from "../context/DevContext";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Lock, Shield, Database, Sun, Moon,
  CheckCircle, AlertCircle, Trash2, LogOut, RotateCcw
} from "lucide-react";

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 mb-5">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-100 dark:border-slate-800">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Icon size={16} />
        </div>
        <h3 className="font-bold text-gray-800 dark:text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;
  const isOk = type === "success";
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold border ${
      isOk
        ? "bg-green-50  dark:bg-green-900/30 border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-400"
        : "bg-red-50   dark:bg-red-900/30   border-red-200  dark:border-red-800/40  text-red-700  dark:text-red-400"
    }`}>
      {isOk ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  );
}

const inputClass = "w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 focus:border-transparent transition";

export default function Settings() {
  const { user, updateUser, changePassword, logout } = useAuth();
  const { theme, setTheme, clearProjects, clearSkills, resetAllData } = useDev();
  const navigate = useNavigate();

  // Profile
  const [name, setName]       = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");

  // Account
  const [email, setEmail]     = useState(user?.email || "");

  // Password
  const [oldPw, setOldPw]     = useState("");
  const [newPw, setNewPw]     = useState("");
  const [confPw, setConfPw]   = useState("");

  // Toast
  const [toast, setToast] = useState({ msg: "", type: "" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  // Handlers
  const handleProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) return showToast("Name cannot be empty.", "error");
    updateUser({ name: name.trim(), username: username.trim() });
    showToast("Profile updated successfully!");
  };

  const handleAccount = (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return showToast("Enter a valid email address.", "error");
    }
    updateUser({ email: email.trim() });
    showToast("Email updated successfully!");
  };

  const handlePassword = (e) => {
    e.preventDefault();
    if (!oldPw || !newPw || !confPw) return showToast("All password fields are required.", "error");
    if (newPw.length < 6)            return showToast("New password must be at least 6 characters.", "error");
    if (newPw !== confPw)            return showToast("New passwords do not match.", "error");
    const result = changePassword(oldPw, newPw);
    if (!result.ok) return showToast(result.error, "error");
    setOldPw(""); setNewPw(""); setConfPw("");
    showToast("Password changed successfully!");
  };

  const handleLogoutAll = () => {
    logout();
    navigate("/login");
  };

  const confirmClear = (label, action) => {
    if (window.confirm(`Are you sure you want to ${label}? This cannot be undone.`)) {
      action();
      showToast(`${label.charAt(0).toUpperCase() + label.slice(1)} completed.`);
    }
  };

  return (
    <Layout title="Settings">
      <div className="max-w-2xl">
        {/* Profile */}
        <Section title="Profile" icon={User}>
          <form onSubmit={handleProfile} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Full name</label>
                <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Developer" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Username</label>
                <input className={inputClass} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="alexdev" />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">
                Currently logged in as <span className="font-semibold text-gray-600 dark:text-slate-300">{user?.email}</span>
              </p>
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30">
              Save Profile
            </button>
          </form>
        </Section>

        {/* Account / Email */}
        <Section title="Account" icon={Mail}>
          <form onSubmit={handleAccount} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Email address</label>
              <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30">
              Update Email
            </button>
          </form>
        </Section>

        {/* Password */}
        <Section title="Change Password" icon={Lock}>
          <form onSubmit={handlePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Current password</label>
              <input type="password" className={inputClass} value={oldPw} onChange={(e) => setOldPw(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">New password</label>
                <input type="password" className={inputClass} value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 6 characters" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Confirm new password</label>
                <input type="password" className={inputClass} value={confPw} onChange={(e) => setConfPw(e.target.value)} placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30">
              Change Password
            </button>
          </form>
        </Section>

        {/* Appearance */}
        <Section title="Appearance" icon={Sun}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-white text-sm">Theme</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Switch between light and dark mode</p>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                theme === "dark" ? "bg-indigo-600" : "bg-gray-200 dark:bg-slate-700"
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform duration-300 ${
                theme === "dark" ? "translate-x-7" : ""
              }`}>
                {theme === "dark"
                  ? <Moon size={12} className="text-indigo-600" />
                  : <Sun  size={12} className="text-amber-500" />
                }
              </span>
            </button>
          </div>
        </Section>

        {/* Security */}
        <Section title="Security" icon={Shield}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800 dark:text-white text-sm">Sign out all sessions</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Logs you out and clears your session data</p>
            </div>
            <button
              onClick={handleLogoutAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </Section>

        {/* Data */}
        <Section title="Data Management" icon={Database}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-white text-sm">Clear all projects</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Permanently delete all project data</p>
              </div>
              <button
                onClick={() => confirmClear("clear all projects", clearProjects)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-800/40 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <Trash2 size={14} />
                Clear
              </button>
            </div>

            <div className="border-t border-gray-100 dark:border-slate-800 pt-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-white text-sm">Clear all skills</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Permanently delete all skill data</p>
              </div>
              <button
                onClick={() => confirmClear("clear all skills", clearSkills)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-800/40 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <Trash2 size={14} />
                Clear
              </button>
            </div>

            <div className="border-t border-gray-100 dark:border-slate-800 pt-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800 dark:text-white text-sm">Reset all app data</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Deletes all projects and skills at once</p>
              </div>
              <button
                onClick={() => confirmClear("reset all app data", resetAllData)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
              >
                <RotateCcw size={14} />
                Reset all
              </button>
            </div>
          </div>
        </Section>
      </div>

      <Toast msg={toast.msg} type={toast.type} />
    </Layout>
  );
}
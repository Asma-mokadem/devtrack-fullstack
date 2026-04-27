import { useNavigate } from "react-router-dom";
import { Search, Plus, Bell } from "lucide-react";

export default function Navbar({ title = "Dashboard", onSearch }) {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10">
      {/* Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-gray-800 dark:text-white tracking-tight">
          {title}
        </h1>
      </div>

      {/* Search + actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 focus:border-transparent transition w-52"
          />
        </div>

        {/* Bell */}
        <button className="relative w-9 h-9 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
        </button>

        {/* New Project CTA */}
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30 transition-colors"
        >
          <Plus size={15} />
          New Project
        </button>
      </div>
    </header>
  );
}
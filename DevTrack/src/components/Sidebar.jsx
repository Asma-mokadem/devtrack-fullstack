import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Star,
  Settings,
  LogOut,
  User,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDev } from "../context/DevContext";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/projects",  icon: FolderKanban,   label: "Projects"  },
  { to: "/skills",    icon: Star,           label: "Skills"    },
  { to: "/settings",  icon: Settings,       label: "Settings"  },
];

export default function Sidebar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const { projects, skills } = useDev();

  const counts = {
    "/projects": projects.length,
    "/skills":   skills.length,
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <aside className="w-60 min-h-screen bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 h-16 border-b border-gray-100 dark:border-slate-800 flex items-center">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-indigo-900/40 group-hover:bg-indigo-700 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.95"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.3"/>
            </svg>
          </span>
          <span className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-white">
            DevTrack
          </span>
        </Link>
      </div>

      {/* User card */}
      <div className="px-3 py-3 border-b border-gray-100 dark:border-slate-800">
        <button
          onClick={() => navigate("/settings")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 text-white text-sm font-semibold">
            {initial}
          </div>
          <div className="flex-1 overflow-hidden text-left">
            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate leading-none mb-0.5">
              {user?.name || "Developer"}
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500 truncate">
              {user?.email || ""}
            </p>
          </div>
          <ChevronRight size={14} className="text-gray-300 dark:text-slate-600 group-hover:text-gray-400 transition-colors shrink-0" />
        </button>
      </div>

      {/* Label */}
      <div className="px-5 pt-4 pb-1.5">
        <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-gray-400 dark:text-slate-500">
          Navigation
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-1 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          const count  = counts[to];
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon
                size={16}
                className={active ? "text-indigo-600 dark:text-indigo-400" : ""}
              />
              <span className="flex-1">{label}</span>
              {count !== undefined && count > 0 && (
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                  active
                    ? "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400"
                }`}>
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-4 pt-2 border-t border-gray-100 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 dark:hover:text-red-400 transition-all duration-150"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
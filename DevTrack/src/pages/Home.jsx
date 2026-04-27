import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, BarChart2, Star, FolderKanban, CheckCircle } from "lucide-react";

const FEATURES = [
  { icon: FolderKanban, title: "Project Tracking", desc: "Manage all your projects with status, tech stack, duration, and difficulty metrics." },
  { icon: Star,         title: "Skills Dashboard", desc: "Visualize your skill progression with dynamic progress bars and level tracking." },
  { icon: BarChart2,   title: "Analytics",         desc: "Beautiful charts showing your coding time distribution and monthly activity." },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1e] text-gray-900 dark:text-white">
      {/* Top nav */}
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.95"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.3"/>
            </svg>
          </span>
          <span className="font-bold text-gray-900 dark:text-white">DevTrack</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              Go to Dashboard
              <ArrowRight size={14} />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-2"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Get Started
                <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <CheckCircle size={12} />
          Built for developers who care about growth
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white mb-6">
          Track your{" "}
          <span className="text-indigo-600">developer growth</span>{" "}
          like a pro
        </h1>
        <p className="text-lg text-gray-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          DevTrack helps you analyze your projects, skills, and coding time with powerful analytics and real performance insights — all in one clean dashboard.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 transition-all hover:-translate-y-0.5"
          >
            Sign in
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                <Icon size={18} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
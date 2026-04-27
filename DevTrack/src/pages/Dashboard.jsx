import { useState } from "react";
import Layout from "../components/Layout";
import StatCard from "../components/Statcard.jsx";
import TechPieChart from "../components/charts/TechPieChart";
import MonthlyBarChart from "../components/charts/MonthlyBarChart";
import SkillLineChart from "../components/charts/SkillLineChart";
import { useDev } from "../context/DevContext";
import { useAuth } from "../context/AuthContext";
import { FolderKanban, Clock, Star, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_STYLE = {
  Completed:   "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "In Progress": "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  Pending:     "bg-red-100  dark:bg-red-900/30  text-red-700  dark:text-red-400",
};

export default function Dashboard() {
  const { projects, skills, totalHours, averageDifficulty, completedProjects } = useDev();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Top technology by hours
  const techMap = {};
  projects.forEach((p) => {
    if (p.tech && p.duration) techMap[p.tech] = (techMap[p.tech] || 0) + p.duration;
  });
  const topTech = Object.entries(techMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  // Recent activity feed
  const recentItems = [
    ...projects.map((p) => ({ type: "project", label: `Added project: `, name: p.name, date: new Date(p.date) })),
    ...skills.map((s)  => ({ type: "skill",   label: `Added skill: `,   name: `${s.name} — ${s.level}%`, date: new Date() })),
  ]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);

  const recentProjects = [...projects].reverse().slice(0, 3);

  const filteredProjects = search
    ? recentProjects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tech.toLowerCase().includes(search.toLowerCase())
      )
    : recentProjects;

  return (
    <Layout title="Dashboard" onSearch={setSearch}>
      {/* Greeting */}
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Good day, {user?.name?.split(" ")[0] || "Developer"} 👋
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
          Here's an overview of your developer journey.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total projects"  value={projects.length}        icon={FolderKanban} color="indigo" />
        <StatCard label="Total hours"     value={`${totalHours}h`}       icon={Clock}        color="purple" />
        <StatCard label="Top technology"  value={topTech}                icon={Star}         color="amber"  sub="by hours spent" />
        <StatCard label="Skills tracked"  value={skills.length}          icon={CheckCircle}  color="green"  />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
        <TechPieChart />
        <MonthlyBarChart />
        <SkillLineChart />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 dark:text-white text-sm uppercase tracking-wide">
              Recent Activity
            </h3>
          </div>
          {recentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-slate-500">
              <FolderKanban size={32} className="mb-2 opacity-30" />
              <p className="text-sm">No recent activity yet.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentItems.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.type === "project" ? "bg-indigo-500" : "bg-green-500"}`} />
                  <span className="text-gray-500 dark:text-slate-400">{item.label}</span>
                  <span className="font-semibold text-gray-800 dark:text-white truncate">{item.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 dark:text-white text-sm uppercase tracking-wide">
              Recent Projects
            </h3>
            <button
              onClick={() => navigate("/projects")}
              className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-slate-500">
              <FolderKanban size={32} className="mb-2 opacity-30" />
              <p className="text-sm">{search ? "No matching projects." : "No projects added yet."}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((p) => (
                <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">{p.name}</p>
                      <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLE[p.status]}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-slate-500">
                      Tech: {p.tech} · {p.duration}h · {p.difficulty}/10
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
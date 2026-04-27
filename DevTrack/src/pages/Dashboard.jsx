import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TechPieChart from "../components/charts/TechPieChart";
import MonthlyBarChart from "../components/charts/MonthlyBarChart";
import SkillLineChart from "../components/charts/SkillLineChart";
import { useDev } from "../context/DevContext";

export default function Dashboard() {

  const {
    projects,
    skills,
    totalHours,
    averageDifficulty,
    completedProjects
  } = useDev();
  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-10 text-white">
          <h1 className="text-4xl font-bold mb-6">
            Welcome to <span className="text-indigo-500">DevTrack</span>
          </h1>

          <p className="text-slate-400 mb-8">
            Track your projects, skills, and progress.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <TechPieChart />
            <MonthlyBarChart />
            <SkillLineChart />
          </div>
          <div className="mt-6 p-6 bg-slate-900 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-3">
              Recent Activity
            </h2>

            {projects.length === 0 ? (
              <p className="text-slate-400">
                You have no recent activity.
              </p>
            ) : (
              <ul className="space-y-2">
                {projects.slice(-3).reverse().map((project) => (
                  <li key={project.id} className="text-slate-300">
                    Added project: <span className="text-white font-semibold">{project.name}</span>
                  </li>
                ))}
              </ul>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}
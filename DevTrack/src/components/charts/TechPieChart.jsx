import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useDev } from "../../context/DevContext";

const COLORS = ["#6366f1", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

export default function TechPieChart() {
  const { projects } = useDev();

  const techMap = {};
  projects.forEach((p) => {
    if (!p.tech || !p.duration) return;
    techMap[p.tech] = (techMap[p.tech] || 0) + p.duration;
  });

  const data = Object.keys(techMap).map((tech) => ({ name: tech, value: techMap[tech] }));

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 py-5 flex flex-col h-64">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gray-400 dark:text-slate-500 mb-4">
          Time by technology
        </p>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-400 dark:text-slate-500">No project data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 py-5">
      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gray-400 dark:text-slate-500 mb-4">
        Time by technology
      </p>
      {/* Horizontal bar list */}
      <div className="space-y-2.5">
        {data.map(({ name, value }, i) => {
          const max = Math.max(...data.map((d) => d.value));
          const pct = Math.round((value / max) * 100);
          return (
            <div key={name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-slate-300">{name}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">{value}h</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
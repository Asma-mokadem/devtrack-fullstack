import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useDev } from "../../context/DevContext";

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#e0d9fe", "#4f46e5", "#7c3aed"];

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
      <div className="bg-white dark:bg-[#0d1526] border border-slate-200/70 dark:border-slate-800 rounded-2xl px-6 py-5 flex items-center justify-center h-64">
        <p className="text-sm text-slate-400 dark:text-slate-500">No project data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0d1526] border border-slate-200/70 dark:border-slate-800 rounded-2xl px-6 py-5">
      <p className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-400 dark:text-slate-500 mb-4">
        Time by technology
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={75} dataKey="value" label>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--tw-color-white, #fff)",
              border: "0.5px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ResponsiveContainer } from "recharts";
import { useDev } from "../../context/DevContext";

export default function MonthlyBarChart() {
  const { projects } = useDev();

  const monthMap = {};
  projects.forEach((p) => {
    if (!p.date) return;
    const month = new Date(p.date).toLocaleString("default", { month: "short" });
    monthMap[month] = (monthMap[month] || 0) + 1;
  });

  const data = Object.keys(monthMap).map((month) => ({ month, projects: monthMap[month] }));

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
        Projects per month
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "0.5px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="projects" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill="#6366f1" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
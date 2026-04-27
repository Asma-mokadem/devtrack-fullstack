import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, ResponsiveContainer } from "recharts";
import { useDev } from "../../context/DevContext";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg text-xs">
        <p className="font-semibold text-gray-700 dark:text-white">{label}</p>
        <p className="text-indigo-600 dark:text-indigo-400">{payload[0].value} project{payload[0].value !== 1 ? "s" : ""}</p>
      </div>
    );
  }
  return null;
};

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
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 py-5 flex flex-col h-64">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gray-400 dark:text-slate-500 mb-4">
          Projects per month
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
        Projects per month
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
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
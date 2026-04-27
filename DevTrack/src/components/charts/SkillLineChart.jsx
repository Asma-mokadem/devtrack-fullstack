import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useDev } from "../../context/DevContext";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg text-xs">
        <p className="font-semibold text-gray-700 dark:text-white truncate max-w-[120px]">{label}</p>
        <p className="text-indigo-600 dark:text-indigo-400">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function SkillLineChart() {
  const { skills } = useDev();
  const data = skills.map((s) => ({ name: s.name, level: s.level }));

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 py-5 flex flex-col h-64">
        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gray-400 dark:text-slate-500 mb-4">
          Skill levels
        </p>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-400 dark:text-slate-500">No skills added yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl px-6 py-5">
      <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-gray-400 dark:text-slate-500 mb-4">
        Skill levels
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="skillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="level"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#skillGrad)"
            dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#4f46e5", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
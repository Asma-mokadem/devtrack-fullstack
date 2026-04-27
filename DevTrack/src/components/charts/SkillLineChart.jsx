import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useDev } from "../../context/DevContext";

export default function SkillLineChart() {
  const { skills } = useDev();
  const data = skills.map((s) => ({ name: s.name, level: s.level }));

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0d1526] border border-slate-200/70 dark:border-slate-800 rounded-2xl px-6 py-5 flex items-center justify-center h-64">
        <p className="text-sm text-slate-400 dark:text-slate-500">No skills added yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0d1526] border border-slate-200/70 dark:border-slate-800 rounded-2xl px-6 py-5">
      <p className="text-xs font-semibold tracking-[0.12em] uppercase text-slate-400 dark:text-slate-500 mb-4">
        Skill levels
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "#fff",
              border: "0.5px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="level"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#4f46e5" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
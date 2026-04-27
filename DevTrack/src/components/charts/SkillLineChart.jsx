import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useDev } from "../../context/DevContext";

export default function SkillLineChart() {
  const { skills } = useDev();

  const data = skills.map((skill) => ({
    name: skill.name,
    level: skill.level,
  }));

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl w-full md:w-96">
      <h3 className="text-white text-lg font-semibold mb-4">
        Skill Levels
      </h3>

      <LineChart width={300} height={300} data={data}>
        <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="level"
          stroke="#6366F1"
          strokeWidth={3}
        />
      </LineChart>
    </div>
  );
}
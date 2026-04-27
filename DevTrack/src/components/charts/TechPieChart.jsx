import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useDev } from "../../context/DevContext";

export default function TechPieChart() {
  const { projects } = useDev();

  // Regrouper duree par technologie
  const techMap = {};

  projects.forEach((project) => {
    if (!project.tech || !project.duration) return;

    techMap[project.tech] =
      (techMap[project.tech] || 0) + project.duration;
  });

  const data = Object.keys(techMap).map((tech) => ({
    name: tech,
    value: techMap[tech],
  }));

  const COLORS = ["#6366F1", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"];

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl w-full md:w-96">
      <h3 className="text-white text-lg font-semibold mb-4">
        Time by Technology
      </h3>

      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
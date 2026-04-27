import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useDev } from "../../context/DevContext";

export default function MonthlyBarChart() {
  const { projects } = useDev();

  // Grouper projets par mois
  const monthMap = {};

  projects.forEach((project) => {
    if (!project.date) return;

    const month = new Date(project.date).toLocaleString("default", {
      month: "short",
    });

    monthMap[month] = (monthMap[month] || 0) + 1;
  });

  const data = Object.keys(monthMap).map((month) => ({
    month,
    projects: monthMap[month],
  }));

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl w-full md:w-96">
      <h3 className="text-white text-lg font-semibold mb-4">
        Projects per Month
      </h3>

      <BarChart width={300} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="month" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip />
        <Bar dataKey="projects" fill="#6366F1" radius={[5, 5, 0, 0]} />
      </BarChart>
    </div>
  );
}
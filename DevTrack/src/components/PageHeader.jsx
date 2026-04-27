import { useNavigate } from "react-router-dom";

export default function PageHeader({ title }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-white">
        {title}
      </h1>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-slate-800 px-5 py-2 rounded-xl border border-slate-700 hover:bg-slate-700 transition text-white font-semibold"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
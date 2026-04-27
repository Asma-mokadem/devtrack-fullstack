import { useState } from "react";
import { useDev } from "../context/DevContext";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { FolderKanban, Clock, TrendingUp, Plus, X, Edit2, Trash2, CheckCircle } from "lucide-react";

const STATUS_STYLE = {
  Completed:   "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40",
  "In Progress": "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40",
  Pending:     "bg-red-100  dark:bg-red-900/30  text-red-700  dark:text-red-400  border-red-200  dark:border-red-800/40",
};

const STATUSES = ["All", "Pending", "In Progress", "Completed"];

const EMPTY_FORM = { name: "", tech: "", status: "Pending", difficulty: "", duration: "" };

export default function Projects() {
  const { projects, addProject, deleteProject, updateProject } = useDev();

  const [form, setForm]       = useState(EMPTY_FORM);
  const [editId, setEditId]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter]   = useState("All");
  const [search, setSearch]   = useState("");
  const [errors, setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())          e.name = "Required";
    if (!form.tech.trim())          e.tech = "Required";
    if (!form.difficulty || form.difficulty < 1 || form.difficulty > 10) e.difficulty = "1–10";
    if (!form.duration || form.duration < 1)  e.duration = "Min 1h";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    if (editId) {
      updateProject(editId, { ...form, difficulty: Number(form.difficulty), duration: Number(form.duration) });
      setEditId(null);
    } else {
      addProject({
        id: Date.now(),
        ...form,
        difficulty: Number(form.difficulty),
        duration: Number(form.duration),
        date: new Date().toISOString(),
      });
    }
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const startEdit = (p) => {
    setForm({ name: p.name, tech: p.tech, status: p.status, difficulty: String(p.difficulty), duration: String(p.duration) });
    setEditId(p.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setErrors({});
    setShowForm(false);
  };

  const totalHours = projects.reduce((a, p) => a + p.duration, 0);
  const avgDiff    = projects.length ? (projects.reduce((a, p) => a + p.difficulty, 0) / projects.length).toFixed(1) : 0;
  const completed  = projects.filter((p) => p.status === "Completed").length;

  const filtered = projects
    .filter((p) => filter === "All" || p.status === filter)
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.tech.toLowerCase().includes(search.toLowerCase()))
    .slice()
    .reverse();

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 text-sm rounded-xl border ${
      errors[field]
        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
        : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
    } text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 focus:border-transparent transition`;

  return (
    <Layout title="Projects" onSearch={setSearch}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total projects"    value={projects.length}  icon={FolderKanban} color="indigo" />
        <StatCard label="Total hours"       value={`${totalHours}h`} icon={Clock}        color="purple" />
        <StatCard label="Avg difficulty"    value={`${avgDiff}/10`}  icon={TrendingUp}   color="amber"  />
        <StatCard label="Completed"         value={completed}        icon={CheckCircle}  color="green"  />
      </div>

      {/* Header + Add */}
      <div className="flex items-center justify-between mb-5">
        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === s
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30 transition-colors"
        >
          <Plus size={15} />
          Add Project
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800 dark:text-white">
              {editId ? "Edit Project" : "Add New Project"}
            </h3>
            <button onClick={cancelForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Project name</label>
                <input className={inputClass("name")} placeholder="My Awesome App" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Technology</label>
                <input className={inputClass("tech")} placeholder="React, Node.js…" value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })} />
                {errors.tech && <p className="text-red-500 text-xs mt-1">{errors.tech}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Status</label>
                <select className={inputClass("status")} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Difficulty (1–10)</label>
                <input type="number" min="1" max="10" className={inputClass("difficulty")} placeholder="7" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} />
                {errors.difficulty && <p className="text-red-500 text-xs mt-1">{errors.difficulty}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Duration (hours)</label>
                <input type="number" min="1" className={inputClass("duration")} placeholder="24" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
                {editId ? "Save Changes" : "Add Project"}
              </button>
              <button type="button" onClick={cancelForm} className="text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white transition-colors px-4 py-2.5">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-slate-500">
          <FolderKanban size={40} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">{search || filter !== "All" ? "No projects match your filters." : "No projects yet. Add your first one!"}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg hover:shadow-gray-100 dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-800 dark:text-white truncate pr-2">{p.name}</h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => startEdit(p)} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => deleteProject(p.id)} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border mb-4 ${STATUS_STYLE[p.status]}`}>
                {p.status}
              </span>
              <div className="space-y-1.5 text-sm text-gray-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Tech</span>
                  <span className="font-medium text-gray-700 dark:text-slate-200">{p.tech}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span className="font-medium text-gray-700 dark:text-slate-200">{p.duration}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty</span>
                  <span className="font-medium text-gray-700 dark:text-slate-200">{p.difficulty}/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

import { useState } from "react";
import { useDev } from "../context/DevContext";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { FolderKanban, Clock, TrendingUp, Plus, X, Edit2, Trash2, CheckCircle, Loader2 } from "lucide-react";

const STATUS_STYLE = {
  Completed:    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40",
  "In Progress":"bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40",
  Pending:      "bg-red-100  dark:bg-red-900/30  text-red-700  dark:text-red-400  border-red-200  dark:border-red-800/40",
};

const STATUSES = ["All", "Pending", "In Progress", "Completed"];
const EMPTY_FORM = { name: "", tech: "", status: "Pending", difficulty: "", duration: "" };

export default function Projects() {
  const { projects, addProject, deleteProject, updateProject, loadingData } = useDev();

  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter]     = useState("All");
  const [search, setSearch]     = useState("");
  const [errors, setErrors]     = useState({});
  const [saving, setSaving]     = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Requis";
    if (!form.tech.trim()) e.tech = "Requis";
    if (!form.difficulty || form.difficulty < 1 || form.difficulty > 10) e.difficulty = "1–10";
    if (!form.duration || form.duration < 1) e.duration = "Min 1h";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setApiError("");
    setSaving(true);

    try {
      if (editId) {
        await updateProject(editId, {
          ...form,
          difficulty: Number(form.difficulty),
          duration:   Number(form.duration),
        });
        setEditId(null);
      } else {
        await addProject({
          ...form,
          difficulty: Number(form.difficulty),
          duration:   Number(form.duration),
        });
      }
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      setApiError(err.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce projet ?")) return;
    try {
      await deleteProject(id);
    } catch (err) {
      alert(err.message || "Erreur lors de la suppression.");
    }
  };

  const startEdit = (p) => {
    setForm({
      name:       p.name,
      tech:       p.tech,
      status:     p.status,
      difficulty: String(p.difficulty),
      duration:   String(p.duration),
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setErrors({});
    setApiError("");
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
    <Layout title="Projets" onSearch={setSearch}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total projets"  value={projects.length}  icon={FolderKanban} color="indigo" />
        <StatCard label="Total heures"   value={`${totalHours}h`} icon={Clock}        color="purple" />
        <StatCard label="Difficulté moy" value={`${avgDiff}/10`}  icon={TrendingUp}   color="amber"  />
        <StatCard label="Terminés"       value={completed}        icon={CheckCircle}  color="green"  />
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === s ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white"
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
          Ajouter
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800 dark:text-white">{editId ? "Modifier le projet" : "Nouveau projet"}</h3>
            <button onClick={cancelForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors"><X size={18} /></button>
          </div>

          {apiError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Nom du projet</label>
                <input className={inputClass("name")} placeholder="Mon super projet" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Technologie</label>
                <input className={inputClass("tech")} placeholder="React, Node.js…" value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })} />
                {errors.tech && <p className="text-red-500 text-xs mt-1">{errors.tech}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Statut</label>
                <select className={inputClass("status")} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Difficulté (1–10)</label>
                <input type="number" min="1" max="10" className={inputClass("difficulty")} placeholder="7" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} />
                {errors.difficulty && <p className="text-red-500 text-xs mt-1">{errors.difficulty}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Durée (heures)</label>
                <input type="number" min="1" className={inputClass("duration")} placeholder="24" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editId ? "Sauvegarder" : "Ajouter"}
              </button>
              <button type="button" onClick={cancelForm} className="text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white transition-colors px-4 py-2.5">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste */}
      {loadingData ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-indigo-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-slate-500">
          <FolderKanban size={40} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">{search || filter !== "All" ? "Aucun projet trouvé." : "Aucun projet. Créez-en un !"}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg hover:shadow-gray-100 dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-800 dark:text-white truncate pr-2">{p.name}</h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => startEdit(p)} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-600 transition-colors">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors">
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
                  <span className="font-medium text-gray-700 dark:text-slate-200 truncate max-w-[140px]">{p.tech}</span>
                </div>
                <div className="flex justify-between">
                  <span>Durée</span>
                  <span className="font-medium text-gray-700 dark:text-slate-200">{p.duration}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulté</span>
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
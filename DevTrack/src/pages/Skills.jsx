import { useState } from "react";
import { useDev } from "../context/DevContext";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { Star, TrendingUp, Plus, X, Edit2, Trash2 } from "lucide-react";

const CATEGORIES = ["All", "Language", "Framework", "Tool", "Other"];

const CATEGORY_COLOR = {
  Language:  "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  Framework: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  Tool:      "bg-amber-100  dark:bg-amber-900/30  text-amber-600  dark:text-amber-400",
  Other:     "bg-gray-100   dark:bg-slate-700     text-gray-600   dark:text-slate-300",
};

const LEVEL_COLOR = (level) => {
  if (level >= 80) return "bg-green-500";
  if (level >= 60) return "bg-indigo-500";
  if (level >= 40) return "bg-amber-500";
  return "bg-red-400";
};

const EMPTY_FORM = { name: "", level: "", category: "Language" };

export default function Skills() {
  const { skills, addSkill, deleteSkill, updateSkill } = useDev();

  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter]     = useState("All");
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.level || form.level < 1 || form.level > 100) e.level = "1–100";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    if (editId) {
      updateSkill(editId, { ...form, level: Number(form.level) });
      setEditId(null);
    } else {
      addSkill({ id: Date.now(), ...form, level: Number(form.level) });
    }
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const startEdit = (s) => {
    setForm({ name: s.name, level: String(s.level), category: s.category || "Language" });
    setEditId(s.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setErrors({});
    setShowForm(false);
  };

  const totalSkills = skills.length;
  const avgLevel = skills.length
    ? (skills.reduce((a, s) => a + s.level, 0) / skills.length).toFixed(1)
    : 0;
  const expertSkills = skills.filter((s) => s.level >= 80).length;

  const filtered = skills
    .filter((s) => filter === "All" || (s.category || "Other") === filter)
    .slice()
    .reverse();

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 text-sm rounded-xl border ${
      errors[field]
        ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10"
        : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
    } text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 focus:border-transparent transition`;

  return (
    <Layout title="Skills">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        <StatCard label="Total skills"  value={totalSkills}    icon={Star}      color="indigo" />
        <StatCard label="Average level" value={`${avgLevel}%`} icon={TrendingUp} color="purple" />
        <StatCard label="Expert level"  value={expertSkills}   icon={Star}      color="green"  sub="≥ 80%" />
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === c
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm shadow-indigo-200 dark:shadow-indigo-900/30 transition-colors"
        >
          <Plus size={15} />
          Add Skill
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800 dark:text-white">{editId ? "Edit Skill" : "Add New Skill"}</h3>
            <button onClick={cancelForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Skill name</label>
                <input className={inputClass("name")} placeholder="TypeScript" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Level (%)</label>
                <input type="number" min="1" max="100" className={inputClass("level")} placeholder="80" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
                {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Category</label>
                <select className={inputClass("category")} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.slice(1).map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
                {editId ? "Save Changes" : "Add Skill"}
              </button>
              <button type="button" onClick={cancelForm} className="text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white transition-colors px-4 py-2.5">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Skills list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-slate-500">
          <Star size={40} className="mb-3 opacity-30" />
          <p className="text-sm font-medium">
            {filter !== "All" ? `No ${filter} skills yet.` : "No skills yet. Add your first one!"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl px-5 py-4 flex items-center gap-5 hover:shadow-md hover:shadow-gray-100 dark:hover:shadow-black/20 transition-all group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-800 dark:text-white">{s.name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLOR[s.category || "Other"]}`}>
                    {s.category || "Other"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${LEVEL_COLOR(s.level)}`}
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-slate-200 w-12 text-right">{s.level}%</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => startEdit(s)} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => deleteSkill(s.id)} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
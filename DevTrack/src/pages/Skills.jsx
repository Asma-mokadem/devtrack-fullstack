import { useState } from "react";
import { useDev } from "../context/DevContext";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { Star, TrendingUp, Plus, X, Edit2, Trash2 } from "lucide-react";

const CATEGORIES = ["All", "Language", "Framework", "Tool", "Other"];

const CATEGORY_COLOR = {
  Language:  "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  Framework: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  Tool:      "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  Other:     "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300",
};

const LEVEL_COLOR = (level) => {
  if (level >= 80) return "bg-green-500";
  if (level >= 60) return "bg-indigo-500";
  if (level >= 40) return "bg-amber-500";
  return "bg-red-400";
};

const EMPTY_FORM = { name: "", level: "", category: "Language" };

export default function Skills() {
  const { skills, addSkill, updateSkill, deleteSkill } = useDev();

  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.level || form.level < 1 || form.level > 100) e.level = "1–100";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});

    const payload = {
      name: form.name,
      level: Number(form.level),
      category: form.category,
    };

    try {
      if (editId) {
        await updateSkill(editId, payload);
        setEditId(null);
      } else {
        await addSkill(payload);
      }

      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (s) => {
    setForm({
      name: s.name,
      level: String(s.level),
      category: s.category || "Language",
    });
    setEditId(s.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setErrors({});
    setShowForm(false);
  };

  const filtered = skills
    .filter((s) => filter === "All" || (s.category || "Other") === filter)
    .slice()
    .reverse();

  const totalSkills = skills.length;
  const avgLevel = skills.length
    ? (skills.reduce((a, s) => a + s.level, 0) / skills.length).toFixed(1)
    : 0;
  const expertSkills = skills.filter((s) => s.level >= 80).length;

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 text-sm rounded-xl border ${
      errors[field]
        ? "border-red-300 bg-red-50 dark:bg-red-900/10"
        : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
    }`;

  return (
    <Layout title="Skills">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        <StatCard label="Total skills" value={totalSkills} icon={Star} />
        <StatCard label="Average level" value={`${avgLevel}%`} icon={TrendingUp} />
        <StatCard label="Expert" value={expertSkills} icon={Star} sub="≥80%" />
      </div>

      {/* Header */}
      <div className="flex justify-between mb-5">
        <div className="flex gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1 rounded-lg text-xs ${
                filter === c ? "bg-indigo-600 text-white" : ""
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-5 bg-white dark:bg-slate-900 rounded-xl mb-6">
          <div className="flex justify-between mb-4">
            <h3>{editId ? "Edit Skill" : "Add Skill"}</h3>
            <button onClick={cancelForm}><X /></button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-3">
            <input
              placeholder="Skill name"
              className={inputClass("name")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p>{errors.name}</p>}

            <input
              type="number"
              placeholder="Level"
              className={inputClass("level")}
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
            />

            <select
              className={inputClass("category")}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.slice(1).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <button className="bg-indigo-600 text-white py-2 rounded-xl">
              {editId ? "Save" : "Add"}
            </button>
          </form>
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-3">
        {filtered.map((s) => (
          <div key={s.id} className="p-4 bg-white dark:bg-slate-900 rounded-xl flex justify-between">
            <div>
              <div className="flex gap-2 items-center">
                <span>{s.name}</span>
                <span className={CATEGORY_COLOR[s.category || "Other"]}>
                  {s.category}
                </span>
              </div>

              <div className="w-60 h-2 bg-gray-200 rounded-full mt-2">
                <div
                  className={LEVEL_COLOR(s.level)}
                  style={{ width: `${s.level}%`, height: "100%" }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => startEdit(s)}>
                <Edit2 size={14} />
              </button>
              <button onClick={() => deleteSkill(s.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
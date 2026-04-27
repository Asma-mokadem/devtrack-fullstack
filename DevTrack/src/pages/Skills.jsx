import { useState } from "react";
import { useDev } from "../context/DevContext";
import PageHeader from "../components/PageHeader";

export default function Skills() {
  const { skills, addSkill, deleteSkill } = useDev();

  const [name, setName] = useState("");
  const [level, setLevel] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !level) return;

    const newSkill = {
      id: Date.now(),
      name,
      level: Number(level),
    };

    addSkill(newSkill);

    setName("");
    setLevel("");
  };
  const totalSkills = skills.length;

  const avgLevel =
    skills.length > 0
      ? (
          skills.reduce((acc, skill) => acc + skill.level, 0) /
          skills.length
        ).toFixed(1)
      : 0;

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen text-white p-10">
      <PageHeader title="Skills" />
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg">
          <h3 className="text-slate-400 text-sm">Total Skills</h3>
          <p className="text-2xl font-bold mt-2">{totalSkills}</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg">
          <h3 className="text-slate-400 text-sm">Average Level</h3>
          <p className="text-2xl font-bold mt-2">{avgLevel}%</p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-6 rounded-2xl shadow-lg mb-10 flex flex-col md:flex-row gap-4"
      >
        <input
          className="p-3 rounded bg-slate-800 outline-none flex-1"
          placeholder="Skill name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          min="1"
          max="100"
          className="p-3 rounded bg-slate-800 outline-none w-32"
          placeholder="Level %"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />

        <button className="bg-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
          Add Skill
        </button>
      </form>
      {skills.length === 0 ? (
        <p className="text-slate-400 text-center">
          No skills added yet
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-slate-900 p-6 rounded-2xl shadow-lg"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">{skill.name}</h2>

                <div className="flex items-center gap-4">
                  <span>{skill.level}%</span>
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="text-red-400 text-sm hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-4">
                <div
                  className="bg-indigo-500 h-4 rounded-full transition-all"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
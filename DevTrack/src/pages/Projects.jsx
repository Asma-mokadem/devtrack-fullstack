import { useState } from "react";
import { useDev } from "../context/DevContext";
import PageHeader from "../components/PageHeader";

export default function Projects() {
  const { projects, addProject, deleteProject } = useDev();

  const [name, setName] = useState("");
  const [status, setStatus] = useState("Pending");
  const [difficulty, setDifficulty] = useState("");
  const [duration, setDuration] = useState("");
  const [tech, setTech] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !difficulty || !duration || !tech) return;

    const newProject = {
      id: Date.now(),
      name,
      status,
      difficulty: Number(difficulty),
      duration: Number(duration),
      tech,
      date: new Date().toISOString(),
    };

    addProject(newProject);

    setName("");
    setDifficulty("");
    setDuration("");
    setTech("");
    setStatus("Pending");
  };

  const statusColors = {
    Completed: "bg-green-500",
    "In Progress": "bg-yellow-500",
    Pending: "bg-red-500",
  };

  // les statistiques 

  const totalProjects = projects.length;

  const totalHours = projects.reduce(
    (acc, project) => acc + project.duration,
    0
  );

  const avgDifficulty =
    projects.length > 0
      ? (
          projects.reduce(
            (acc, project) => acc + project.difficulty,
            0
          ) / projects.length
        ).toFixed(1)
      : 0;

  return (
    <div className="flex-1 flex flex-col bg-slate-950 min-h-screen text-white p-10">
      <PageHeader title="Projects" />

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg">
          <h3 className="text-slate-400 text-sm">Total Projects</h3>
          <p className="text-2xl font-bold mt-2">{totalProjects}</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg">
          <h3 className="text-slate-400 text-sm">Total Hours</h3>
          <p className="text-2xl font-bold mt-2">{totalHours}h</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-lg">
          <h3 className="text-slate-400 text-sm">Avg Difficulty</h3>
          <p className="text-2xl font-bold mt-2">{avgDifficulty}/10</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-6 rounded-2xl shadow-lg mb-10 grid md:grid-cols-2 gap-4"
      >
        <input
          className="p-3 rounded bg-slate-800 outline-none"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="p-3 rounded bg-slate-800 outline-none"
          placeholder="Technology (React, Node, etc)"
          value={tech}
          onChange={(e) => setTech(e.target.value)}
        />

        <select
          className="p-3 rounded bg-slate-800 outline-none"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <input
          type="number"
          min="1"
          max="10"
          className="p-3 rounded bg-slate-800 outline-none"
          placeholder="Difficulty (1-10)"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        />

        <input
          type="number"
          min="1"
          className="p-3 rounded bg-slate-800 outline-none"
          placeholder="Duration (hours)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <button
          type="submit"
          className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 transition p-3 rounded-xl font-semibold"
        >
          Add Project
        </button>
      </form>
      
      {projects.length === 0 ? (
        <p className="text-slate-400 text-center">
          No projects added yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-900 p-6 rounded-2xl shadow-lg hover:shadow-indigo-600/30 transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                {project.name}
              </h2>

              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${statusColors[project.status]}`}
              >
                {project.status}
              </span>

              <p className="text-sm text-slate-400">
                Tech: <span className="text-white">{project.tech}</span>
              </p>

              <p className="text-sm text-slate-400">
                Difficulty:{" "}
                <span className="text-white">
                  {project.difficulty}/10
                </span>
              </p>

              <p className="text-sm text-slate-400 mb-4">
                Duration:{" "}
                <span className="text-white">
                  {project.duration}h
                </span>
              </p>

              <button
                onClick={() => deleteProject(project.id)}
                className="text-red-400 hover:text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
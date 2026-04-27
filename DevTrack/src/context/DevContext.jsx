import { createContext, useContext, useState, useEffect } from "react";

const DevContext = createContext();

export function DevProvider({ children }) {
  const [skills, setSkills] = useState(() => {
    try { return JSON.parse(localStorage.getItem("skills")) || []; } catch { return []; }
  });

  const [projects, setProjects] = useState(() => {
    try { return JSON.parse(localStorage.getItem("projects")) || []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("skills", JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const addSkill    = (skill)   => setSkills((prev) => [...prev, skill]);
  const deleteSkill = (id)      => setSkills((prev) => prev.filter((s) => s.id !== id));
  const addProject  = (project) => setProjects((prev) => [...prev, project]);
  const deleteProject = (id)    => setProjects((prev) => prev.filter((p) => p.id !== id));

  const totalHours = projects.reduce((a, p) => a + (p.duration || 0), 0);

  const averageDifficulty =
    projects.length > 0
      ? (projects.reduce((a, p) => a + (p.difficulty || 0), 0) / projects.length).toFixed(1)
      : 0;

  const completedProjects = projects.filter((p) => p.status === "Completed").length;

  return (
    <DevContext.Provider
      value={{
        skills, projects,
        addSkill, deleteSkill,
        addProject, deleteProject,
        totalHours, averageDifficulty, completedProjects,
      }}
    >
      {children}
    </DevContext.Provider>
  );
}

export function useDev() {
  return useContext(DevContext);
}
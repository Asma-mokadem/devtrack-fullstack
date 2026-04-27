import { createContext, useContext, useState, useEffect } from "react";

const DevContext = createContext();

export function DevProvider({ children }) {
  const [skills, setSkills] = useState(() => {
    try { return JSON.parse(localStorage.getItem("skills")) || []; } catch { return []; }
  });

  const [projects, setProjects] = useState(() => {
    try { return JSON.parse(localStorage.getItem("projects")) || []; } catch { return []; }
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem("accentColor") || "indigo";
  });

  // Persist skills
  useEffect(() => {
    localStorage.setItem("skills", JSON.stringify(skills));
  }, [skills]);

  // Persist projects
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("accentColor", accentColor);
  }, [accentColor]);

  // Skills CRUD
  const addSkill    = (skill)   => setSkills((prev) => [...prev, skill]);
  const deleteSkill = (id)      => setSkills((prev) => prev.filter((s) => s.id !== id));
  const updateSkill = (id, updated) =>
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));

  // Projects CRUD
  const addProject    = (project) => setProjects((prev) => [...prev, project]);
  const deleteProject = (id)      => setProjects((prev) => prev.filter((p) => p.id !== id));
  const updateProject = (id, updated) =>
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));

  // Data reset helpers
  const clearProjects = () => { setProjects([]); localStorage.removeItem("projects"); };
  const clearSkills   = () => { setSkills([]);   localStorage.removeItem("skills"); };
  const resetAllData  = () => { clearProjects(); clearSkills(); };

  // Computed stats
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
        addSkill, deleteSkill, updateSkill,
        addProject, deleteProject, updateProject,
        clearProjects, clearSkills, resetAllData,
        totalHours, averageDifficulty, completedProjects,
        theme, setTheme,
        accentColor, setAccentColor,
      }}
    >
      {children}
    </DevContext.Provider>
  );
}

export function useDev() {
  return useContext(DevContext);
}
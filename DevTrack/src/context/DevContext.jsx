
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { projectsAPI, skillsAPI } from "../services/api";
import { useAuth } from "./AuthContext";

const DevContext = createContext();

export function DevProvider({ children }) {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [skills, setSkills]     = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const [theme, setThemeState] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  const setTheme = useCallback((t) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    theme === "dark" ? root.classList.add("dark") : root.classList.remove("dark");
  }, [theme]);

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setSkills([]);
      return;
    }
    setLoadingData(true);
    Promise.all([projectsAPI.getAll(), skillsAPI.getAll()])
      .then(([projData, skillData]) => {
        setProjects(projData.projects || []);
        setSkills(skillData.skills || []);
      })
      .catch((err) => console.error("Erreur chargement données :", err))
      .finally(() => setLoadingData(false));
  }, [user]);


  const addProject = useCallback(async (payload) => {

    const backendPayload = {
      title:      payload.name,
      techStack:  [payload.tech],
      status:     payload.status?.toLowerCase().replace(" ", " ") || "pending",
      hoursSpent: payload.duration,
      progress:   payload.difficulty * 10, // approximation
      description: payload.description || "",
    };
    const data = await projectsAPI.create(backendPayload);
    // Stocker le projet au format frontend enrichi avec l'_id Mongo
    const newProject = _backendToFrontendProject(data.project);
    setProjects((prev) => [...prev, newProject]);
    return newProject;
  }, []);

  const deleteProject = useCallback(async (id) => {
    await projectsAPI.delete(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateProject = useCallback(async (id, updates) => {
    const backendPayload = {
      title:      updates.name,
      techStack:  [updates.tech],
      status:     updates.status?.toLowerCase() || "pending",
      hoursSpent: updates.duration,
      progress:   updates.difficulty ? updates.difficulty * 10 : undefined,
    };
    const data = await projectsAPI.update(id, backendPayload);
    const updated = _backendToFrontendProject(data.project);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  }, []);


  const addSkill = useCallback(async (payload) => {
    const data = await skillsAPI.create({
      name:     payload.name,
      level:    payload.level,
      category: payload.category || "Other",
    });
    const newSkill = _backendToFrontendSkill(data.skill);
    setSkills((prev) => [...prev, newSkill]);
    return newSkill;
  }, []);

  const deleteSkill = useCallback(async (id) => {
    await skillsAPI.delete(id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateSkill = useCallback(async (id, updates) => {
    const data = await skillsAPI.update(id, {
      name:     updates.name,
      level:    updates.level,
      category: updates.category,
    });
    const updated = _backendToFrontendSkill(data.skill);
    setSkills((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  }, []);


  const clearProjects = useCallback(async () => {
    await Promise.all(projects.map((p) => projectsAPI.delete(p.id)));
    setProjects([]);
  }, [projects]);

  const clearSkills = useCallback(async () => {
    await Promise.all(skills.map((s) => skillsAPI.delete(s.id)));
    setSkills([]);
  }, [skills]);

  const resetAllData = useCallback(async () => {
    await Promise.all([
      ...projects.map((p) => projectsAPI.delete(p.id)),
      ...skills.map((s) => skillsAPI.delete(s.id)),
    ]);
    setProjects([]);
    setSkills([]);
  }, [projects, skills]);
  const totalHours = projects.reduce((a, p) => a + (p.duration || 0), 0);
  const averageDifficulty =
    projects.length > 0
      ? (projects.reduce((a, p) => a + (p.difficulty || 0), 0) / projects.length).toFixed(1)
      : 0;
  const completedProjects = projects.filter((p) => p.status === "Completed").length;

  return (
    <DevContext.Provider
      value={{
        projects,
        skills,
        loadingData,
        addProject,
        deleteProject,
        updateProject,
        addSkill,
        deleteSkill,
        updateSkill,
        clearProjects,
        clearSkills,
        resetAllData,
        totalHours,
        averageDifficulty,
        completedProjects,
        theme,
        setTheme,
      }}
    >
      {children}
    </DevContext.Provider>
  );
}

export function useDev() {
  return useContext(DevContext);
}

function _backendToFrontendProject(p) {
  const statusMap = {
    pending:     "Pending",
    "in progress": "In Progress",
    completed:   "Completed",
  };
  return {
    id:         p._id,
    name:       p.title,
    tech:       Array.isArray(p.techStack) ? p.techStack.join(", ") : p.techStack || "",
    status:     statusMap[p.status] || "Pending",
    duration:   p.hoursSpent || 0,
    difficulty: p.progress ? Math.round(p.progress / 10) : 5,
    date:       p.createdAt || new Date().toISOString(),
    description: p.description || "",
    githubUrl:  p.githubUrl || "",
  };
}

function _backendToFrontendSkill(s) {
  return {
    id:       s._id,
    name:     s.name,
    level:    s.level,
    category: s.category || "Other",
  };
}
import { createContext, useContext, useState, useEffect } from "react";

const DevContext = createContext();

export function DevProvider({ children }) {

  // Charger depuis localStorage
  const [skills, setSkills] = useState(() => {
    const storedSkills = localStorage.getItem("skills");
    return storedSkills ? JSON.parse(storedSkills) : [];
  });

  const [projects, setProjects] = useState(() => {
    const storedProjects = localStorage.getItem("projects");
    return storedProjects ? JSON.parse(storedProjects) : [];
  });

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem("skills", JSON.stringify(skills));
  }, [skills]);
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);
  const addSkill = (skill) => {
    setSkills((prev) => [...prev, skill]);
  };
  const addProject = (project) => {
    setProjects((prev) => [...prev, project]);
  };
  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };


  const deleteSkill = (id) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <DevContext.Provider
      value={{
        skills,
        projects,
        addSkill,
        addProject,
        deleteProject,
        deleteSkill
      }}
    >
      {children}
    </DevContext.Provider>
  );
}

export function useDev() {
  return useContext(DevContext);
}
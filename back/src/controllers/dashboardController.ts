import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Project from "../models/Project";
import Skill from "../models/Skill";

export const getDashboard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const [projects, skills] = await Promise.all([
      Project.find({ user: req.userId }),
      Skill.find({ user: req.userId }),
    ]);


    const totalProjects = projects.length;
    const totalSkills = skills.length;

    const totalHours = projects.reduce(
      (sum, project) => sum + (project.hoursSpent || 0),
      0
    );

    const avgProgress =
      totalProjects > 0
        ? Math.round(
            projects.reduce((sum, p) => sum + (p.progress || 0), 0) /
              totalProjects
          )
        : 0;

    const avgSkillLevel =
      totalSkills > 0
        ? Math.round(
            skills.reduce((sum, s) => sum + s.level, 0) / totalSkills
          )
        : 0;
    const projectsByStatus = {
      "pending": projects.filter((p) => p.status === "pending").length,
      "completed": projects.filter((p) => p.status === "completed").length,
      "in progress": projects.filter((p) => p.status === "in progress").length,
    };

    // Répartition des skills par catégorie
    const skillsByCategory = skills.reduce(
      (acc: Record<string, number>, skill) => {
        acc[skill.category] = (acc[skill.category] || 0) + 1;
        return acc;
      },
      {}
    );

    res.status(200).json({
      stats: {
        totalProjects,
        totalSkills,
        totalHours,
        avgProgress,
        avgSkillLevel,
        projectsByStatus,
        skillsByCategory,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};
import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Project from "../models/Project";

// GET /api/projects

export const getProjects = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const projects = await Project.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};
// POST /api/projects
export const createProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, techStack, githubUrl, status, progress, hoursSpent } =
      req.body;

    if (!title) {
      res.status(400).json({ message: "title is required" });
      return;
    }

    const project = await Project.create({
      user: req.userId, 
      title,
      description,
      techStack,
      githubUrl,
      status,
      progress,
      hoursSpent,
    });

    res.status(201).json({
      message: "Projet créé !",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// PUT /api/projects/:id
export const updateProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ _id: id, user: req.userId });

    if (!project) {
      res
        .status(404)
        .json({ message: "Projet introuvable ou accès refusé." });
      return;
    }

    const updatedProject = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Projet mis à jour !",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};
// DELETE /api/projects/:id
export const deleteProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Project.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!project) {
      res
        .status(404)
        .json({ message: "Projet introuvable ou accès refusé." });
      return;
    }

    res.status(200).json({ message: "Projet supprimé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};
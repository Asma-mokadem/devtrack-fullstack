import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Skill from "../models/Skill";

// GET /api/skills
export const getSkills = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const skills = await Skill.find({ user: req.userId }).sort({ name: 1 });
    res.status(200).json({ skills });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// POST /api/skills
export const createSkill = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, level, category } = req.body;

    if (!name || !level) {
      res.status(400).json({ message: "Nom et niveau obligatoires." });
      return;
    }

    const skill = await Skill.create({
      user: req.userId,
      name,
      level,
      category,
    });

    res.status(201).json({ message: "Compétence ajoutée !", skill });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// PUT /api/skills/:id
export const updateSkill = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const skill = await Skill.findOne({ _id: id, user: req.userId });
    if (!skill) {
      res.status(404).json({ message: "Compétence introuvable ou accès refusé." });
      return;
    }

    const updatedSkill = await Skill.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "Compétence mise à jour !", skill: updatedSkill });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// DELETE /api/skills/:id
export const deleteSkill = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const skill = await Skill.findOneAndDelete({ _id: id, user: req.userId });
    if (!skill) {
      res.status(404).json({ message: "Compétence introuvable ou accès refusé." });
      return;
    }

    res.status(200).json({ message: "Compétence supprimée." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};
import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";

// GET /api/users/profile
export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable." });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// PUT /api/users/profile
export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, bio, github, linkedin } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, bio, github, linkedin },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ message: "Utilisateur introuvable." });
      return;
    }

    res.status(200).json({
      message: "Profil mis à jour !",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};
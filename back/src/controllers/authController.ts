import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/User";

//  générer  token 
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET as string;

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || "1d",
  };

  return jwt.sign({ userId }, secret, options);
};

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "Tous les champs sont obligatoires." });
      return;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Cet email est déjà utilisé." });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = generateToken(user._id.toString());
    res.status(201).json({
      message: "Compte créé avec succès !",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email et mot de passe requis." });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Email ou mot de passe incorrect." });
      return;
    } 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Email ou mot de passe incorrect." });
      return;
    }
    const token = generateToken(user._id.toString());

    res.status(200).json({
      message: "Connexion réussie !",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};
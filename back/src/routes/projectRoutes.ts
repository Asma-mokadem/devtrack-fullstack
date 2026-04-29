import { Router } from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";
import protect from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getProjects);       
router.post("/", protect, createProject);     
router.put("/:id", protect, updateProject);    
router.delete("/:id", protect, deleteProject);

export default router;
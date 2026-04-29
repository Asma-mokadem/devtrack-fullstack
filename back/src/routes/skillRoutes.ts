import { Router } from "express";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController";
import protect from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getSkills);          
router.post("/", protect, createSkill);     
router.put("/:id", protect, updateSkill);     
router.delete("/:id", protect, deleteSkill);  

export default router;
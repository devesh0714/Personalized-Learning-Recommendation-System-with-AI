import express from "express";
import {
  generateLearningPath,
  getLearningPathByDomain,
  getLearningPaths
} from "../controllers/learningPathController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getLearningPaths);
router.post("/", generateLearningPath);
router.get("/:domainId", getLearningPathByDomain);

export default router;

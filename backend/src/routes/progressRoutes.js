import express from "express";
import { getProgress, upsertProgress } from "../controllers/progressController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getProgress);
router.post("/", upsertProgress);

export default router;

import express from "express";
import { getInterests, saveInterests } from "../controllers/interestController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getInterests);
router.post("/", saveInterests);

export default router;

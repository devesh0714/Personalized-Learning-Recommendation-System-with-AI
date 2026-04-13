import express from "express";
import { getDomain, getDomains } from "../controllers/domainController.js";

const router = express.Router();

router.get("/", getDomains);
router.get("/:id", getDomain);

export default router;

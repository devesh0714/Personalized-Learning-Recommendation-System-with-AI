import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import domainRoutes from "./routes/domainRoutes.js";
import interestRoutes from "./routes/interestRoutes.js";
import learningPathRoutes from "./routes/learningPathRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/domains", domainRoutes);
app.use("/api/interests", interestRoutes);
app.use("/api/learning-paths", learningPathRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

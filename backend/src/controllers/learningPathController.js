import Domain from "../models/Domain.js";
import LearningPath from "../models/LearningPath.js";
import User from "../models/User.js";
import { upsertLearningPathForUser } from "../services/learningPathService.js";

const populatePath = (query) =>
  query
    .populate("domain")
    .populate("milestones.subdomain")
    .populate("milestones.topics.topic");

export const getLearningPaths = async (req, res, next) => {
  try {
    const paths = await populatePath(
      LearningPath.find({ user: req.user._id }).sort({ updatedAt: -1 })
    );

    res.json({ success: true, data: paths });
  } catch (error) {
    next(error);
  }
};

export const generateLearningPath = async (req, res, next) => {
  try {
    const { domainId, skillLevel = req.user.currentLevel || "Beginner", goal = "" } = req.body;

    if (!domainId) {
      const error = new Error("domainId is required");
      error.statusCode = 400;
      throw error;
    }

    const domain = await Domain.findById(domainId);
    if (!domain) {
      const error = new Error("Domain not found");
      error.statusCode = 404;
      throw error;
    }

    const path = await upsertLearningPathForUser({
      userId: req.user._id,
      domainId: domain._id,
      skillLevel,
      goal
    });

    const user = await User.findById(req.user._id);
    const nextSelected = user.selectedDomains.filter(
      (entry) => String(entry.domain) !== String(domain._id)
    );
    nextSelected.push({ domain: domain._id, skillLevel, goal });
    user.selectedDomains = nextSelected;
    user.currentLevel = skillLevel;
    await user.save();

    res.status(201).json({ success: true, data: path });
  } catch (error) {
    next(error);
  }
};

export const getLearningPathByDomain = async (req, res, next) => {
  try {
    const path = await populatePath(
      LearningPath.findOne({ user: req.user._id, domain: req.params.domainId })
    );

    if (!path) {
      const error = new Error("Learning path not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({ success: true, data: path });
  } catch (error) {
    next(error);
  }
};

import Progress from "../models/Progress.js";
import { collectLearningSummary } from "../services/recommendationService.js";

export const getProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ user: req.user._id }).sort({ updatedAt: -1 });
    const summary = await collectLearningSummary(req.user._id);

    res.json({
      success: true,
      data: {
        progress,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
};

export const upsertProgress = async (req, res, next) => {
  try {
    const { topic, category, completed, progressPercentage, timeSpentMinutes, difficulty, notes } = req.body;

    if (!topic || !category) {
      const error = new Error("Topic and category are required");
      error.statusCode = 400;
      throw error;
    }

    const progress = await Progress.findOneAndUpdate(
      { user: req.user._id, topic },
      {
        user: req.user._id,
        topic,
        category,
        completed: Boolean(completed),
        progressPercentage: progressPercentage ?? 0,
        timeSpentMinutes: timeSpentMinutes ?? 0,
        difficulty: difficulty || "Beginner",
        notes: notes || ""
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(201).json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

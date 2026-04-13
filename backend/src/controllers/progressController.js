import LearningPath from "../models/LearningPath.js";
import Progress from "../models/Progress.js";
import Topic from "../models/Topic.js";
import { collectLearningSummary } from "../services/recommendationService.js";

const updatePathTopicStatus = async ({ userId, topicId, completed }) => {
  if (!topicId) {
    return;
  }

  await LearningPath.updateOne(
    { user: userId, "milestones.topics.topic": topicId },
    {
      $set: {
        "milestones.$[milestone].topics.$[topic].status": completed ? "completed" : "in-progress",
        "milestones.$[milestone].topics.$[topic].completedAt": completed ? new Date() : null
      }
    },
    {
      arrayFilters: [
        { "milestone.topics.topic": topicId },
        { "topic.topic": topicId }
      ]
    }
  );
};

export const getProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ user: req.user._id })
      .populate("domain", "name slug category")
      .populate("subdomain", "name slug")
      .populate("topicRef", "title difficulty estimatedMinutes")
      .sort({ updatedAt: -1 });
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
    const {
      topicId,
      topic,
      category,
      completed,
      progressPercentage,
      timeSpentMinutes,
      accuracy,
      difficulty,
      notes,
      subtopic
    } = req.body;

    const catalogTopic = topicId ? await Topic.findById(topicId).populate("domain subdomain") : null;
    const topicName = catalogTopic?.title || topic;
    const categoryName = catalogTopic?.domain?.name || category;

    if (!topicName || !categoryName) {
      const error = new Error("topicId or topic/category is required");
      error.statusCode = 400;
      throw error;
    }

    const completion = completed ?? Number(progressPercentage || 0) >= 100;
    const filter = catalogTopic
      ? { user: req.user._id, topicRef: catalogTopic._id }
      : { user: req.user._id, topic: topicName };

    const progress = await Progress.findOneAndUpdate(
      filter,
      {
        user: req.user._id,
        domain: catalogTopic?.domain?._id,
        subdomain: catalogTopic?.subdomain?._id,
        topicRef: catalogTopic?._id,
        topic: topicName,
        subtopic: subtopic || "",
        category: categoryName,
        completed: Boolean(completion),
        progressPercentage: progressPercentage ?? (completion ? 100 : 0),
        timeSpentMinutes: timeSpentMinutes ?? 0,
        accuracy: accuracy ?? null,
        difficulty: catalogTopic?.difficulty || difficulty || "Beginner",
        notes: notes || ""
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    )
      .populate("domain", "name slug category")
      .populate("subdomain", "name slug")
      .populate("topicRef", "title difficulty estimatedMinutes");

    await updatePathTopicStatus({
      userId: req.user._id,
      topicId: catalogTopic?._id,
      completed: Boolean(completion)
    });

    res.status(201).json({
      success: true,
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

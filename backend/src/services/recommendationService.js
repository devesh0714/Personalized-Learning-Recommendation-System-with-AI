import Progress from "../models/Progress.js";
import Recommendation from "../models/Recommendation.js";
import { topicCatalog } from "../data/sampleCatalog.js";

const averageProgress = (items) => {
  if (!items.length) {
    return 0;
  }

  const total = items.reduce((sum, item) => sum + item.progressPercentage, 0);
  return Math.round(total / items.length);
};

export const buildRuleBasedRecommendations = async (userId, interests, progressEntries) => {
  const freshRecommendations = [];

  for (const interest of interests) {
    const catalog = topicCatalog[interest.name] || [];
    const categoryProgress = progressEntries.filter(
      (item) => item.category.toLowerCase() === interest.name.toLowerCase()
    );
    const completedTopics = new Set(
      categoryProgress.filter((item) => item.completed).map((item) => item.topic.toLowerCase())
    );

    const nextTopic = catalog.find((topic) => !completedTopics.has(topic.topic.toLowerCase()));

    if (nextTopic) {
      freshRecommendations.push({
        user: userId,
        source: "rule-based",
        title: `Learn ${nextTopic.topic} next`,
        description: `Continue your ${interest.name} journey with ${nextTopic.topic}.`,
        category: interest.name,
        reason:
          categoryProgress.length === 0
            ? `You selected ${interest.name} as an interest but have not started yet.`
            : `This is the next uncovered topic after your completed work in ${interest.name}.`,
        priority: interest.priority,
        actionUrl: nextTopic.actionUrl
      });
    }

    const categoryAverage = averageProgress(categoryProgress);

    if (categoryProgress.length > 0 && categoryAverage < 55) {
      freshRecommendations.push({
        user: userId,
        source: "rule-based",
        title: `Strengthen your ${interest.name} fundamentals`,
        description: `Your average progress in ${interest.name} is ${categoryAverage}%. Revisit weak areas before moving on.`,
        category: interest.name,
        reason: "Low average progress indicates that a review cycle will likely improve retention.",
        priority: Math.min(5, interest.priority + 1),
        actionUrl: nextTopic?.actionUrl || ""
      });
    }
  }

  await Recommendation.deleteMany({ user: userId, source: "rule-based" });

  if (freshRecommendations.length) {
    await Recommendation.insertMany(freshRecommendations);
  }

  return Recommendation.find({ user: userId, source: "rule-based" }).sort({ priority: -1, createdAt: -1 });
};

export const collectLearningSummary = async (userId) => {
  const progressEntries = await Progress.find({ user: userId }).sort({ updatedAt: -1 });
  const totalTopics = progressEntries.length;
  const completedTopics = progressEntries.filter((item) => item.completed).length;
  const totalTimeSpentMinutes = progressEntries.reduce((sum, item) => sum + item.timeSpentMinutes, 0);
  const averageCompletion = averageProgress(progressEntries);

  const weakAreas = progressEntries
    .filter((item) => item.progressPercentage < 60)
    .slice(0, 5)
    .map((item) => ({
      topic: item.topic,
      category: item.category,
      progressPercentage: item.progressPercentage
    }));

  return {
    totalTopics,
    completedTopics,
    totalTimeSpentMinutes,
    averageCompletion,
    weakAreas,
    recentTopics: progressEntries.slice(0, 5)
  };
};

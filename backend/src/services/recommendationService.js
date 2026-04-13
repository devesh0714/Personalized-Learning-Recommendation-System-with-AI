import LearningPath from "../models/LearningPath.js";
import Progress from "../models/Progress.js";
import Recommendation from "../models/Recommendation.js";

const difficultyWeight = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3
};

const averageProgress = (items) => {
  if (!items.length) {
    return 0;
  }

  const total = items.reduce((sum, item) => sum + item.progressPercentage, 0);
  return Math.round(total / items.length);
};

const getTopicResource = (topic) => topic?.resources?.[0]?.url || "";

const flattenPathTopics = (path) =>
  path.milestones.flatMap((milestone) =>
    milestone.topics.map((entry) => ({
      milestone,
      pathTopic: entry,
      topic: entry.topic
    }))
  );

export const buildRuleBasedRecommendations = async (userId) => {
  const [paths, progressEntries] = await Promise.all([
    LearningPath.find({ user: userId, status: "active" })
      .populate("domain")
      .populate("milestones.subdomain")
      .populate("milestones.topics.topic"),
    Progress.find({ user: userId })
  ]);

  const completedTopicIds = new Set(
    progressEntries
      .filter((item) => item.completed && item.topicRef)
      .map((item) => String(item.topicRef))
  );

  const progressByTopicId = new Map(
    progressEntries.filter((item) => item.topicRef).map((item) => [String(item.topicRef), item])
  );

  const freshRecommendations = [];

  for (const path of paths) {
    const orderedTopics = flattenPathTopics(path)
      .filter((entry) => entry.topic)
      .sort((a, b) => {
        const difficultyDelta =
          difficultyWeight[a.topic.difficulty] - difficultyWeight[b.topic.difficulty];
        if (difficultyDelta !== 0) {
          return difficultyDelta;
        }
        return a.milestone.order - b.milestone.order || a.pathTopic.order - b.pathTopic.order;
      });

    const nextEntry = orderedTopics.find((entry) => !completedTopicIds.has(String(entry.topic._id)));

    if (nextEntry) {
      freshRecommendations.push({
        user: userId,
        domain: path.domain._id,
        topic: nextEntry.topic._id,
        source: "rule-based",
        title: `Learn ${nextEntry.topic.title} next`,
        description: `Continue ${path.domain.name} with ${nextEntry.topic.title} in ${nextEntry.milestone.title}.`,
        category: path.domain.name,
        reason: `This is the next ${nextEntry.topic.difficulty.toLowerCase()} topic in your saved learning path.`,
        priority: Math.max(2, 6 - difficultyWeight[nextEntry.topic.difficulty]),
        nextTopic: {
          title: nextEntry.topic.title,
          difficulty: nextEntry.topic.difficulty,
          subdomain: nextEntry.milestone.title
        },
        actionUrl: getTopicResource(nextEntry.topic)
      });
    }

    const domainProgress = progressEntries.filter(
      (item) => item.domain && String(item.domain) === String(path.domain._id)
    );
    const weakProgress = domainProgress
      .filter((item) => item.progressPercentage < 60 || (item.accuracy !== null && item.accuracy < 65))
      .sort((a, b) => a.progressPercentage - b.progressPercentage)[0];

    if (weakProgress) {
      freshRecommendations.push({
        user: userId,
        domain: path.domain._id,
        topic: weakProgress.topicRef,
        source: "rule-based",
        title: `Review ${weakProgress.topic}`,
        description: `Your current score in ${weakProgress.topic} is ${weakProgress.progressPercentage}%. Review it before increasing difficulty.`,
        category: path.domain.name,
        reason: "Low completion or accuracy suggests this is a weak area.",
        priority: 5,
        nextTopic: {
          title: weakProgress.topic,
          difficulty: weakProgress.difficulty,
          subdomain: "Review"
        },
        actionUrl: ""
      });
    }

    if (!nextEntry && domainProgress.length) {
      const hardestCompleted = domainProgress
        .filter((item) => item.completed)
        .sort((a, b) => difficultyWeight[b.difficulty] - difficultyWeight[a.difficulty])[0];
      const referenceTopic = hardestCompleted?.topicRef
        ? progressByTopicId.get(String(hardestCompleted.topicRef))
        : null;

      freshRecommendations.push({
        user: userId,
        domain: path.domain._id,
        topic: hardestCompleted?.topicRef,
        source: "rule-based",
        title: `Consolidate ${path.domain.name}`,
        description: "You completed this roadmap. Revisit advanced questions or extend the domain catalog with a new subdomain.",
        category: path.domain.name,
        reason: "All saved path topics are completed.",
        priority: 3,
        nextTopic: {
          title: referenceTopic?.topic || "Advanced practice",
          difficulty: hardestCompleted?.difficulty || path.skillLevel,
          subdomain: "Extension"
        },
        actionUrl: ""
      });
    }
  }

  await Recommendation.deleteMany({ user: userId, source: "rule-based" });

  if (freshRecommendations.length) {
    await Recommendation.insertMany(freshRecommendations);
  }

  return Recommendation.find({ user: userId, source: "rule-based" })
    .populate("domain")
    .populate("topic")
    .sort({ priority: -1, createdAt: -1 });
};

export const collectLearningSummary = async (userId) => {
  const [progressEntries, paths] = await Promise.all([
    Progress.find({ user: userId })
      .populate("domain", "name slug category")
      .populate("subdomain", "name slug")
      .populate("topicRef", "title difficulty estimatedMinutes")
      .sort({ updatedAt: -1 }),
    LearningPath.find({ user: userId })
      .populate("domain", "name slug category")
      .populate("milestones.topics.topic", "title difficulty estimatedMinutes")
      .sort({ updatedAt: -1 })
  ]);

  const totalTopics = progressEntries.length;
  const completedTopics = progressEntries.filter((item) => item.completed).length;
  const totalTimeSpentMinutes = progressEntries.reduce(
    (sum, item) => sum + item.timeSpentMinutes,
    0
  );
  const averageCompletion = averageProgress(progressEntries);

  const weakAreas = progressEntries
    .filter((item) => item.progressPercentage < 60 || (item.accuracy !== null && item.accuracy < 65))
    .slice(0, 6)
    .map((item) => ({
      topic: item.topic,
      domain: item.domain?.name || item.category,
      subdomain: item.subdomain?.name || "General",
      progressPercentage: item.progressPercentage,
      accuracy: item.accuracy,
      difficulty: item.difficulty
    }));

  const progressByDomain = paths.map((path) => {
    const pathTopicIds = new Set(
      path.milestones.flatMap((milestone) =>
        milestone.topics.map((entry) => String(entry.topic?._id || entry.topic))
      )
    );
    const domainProgress = progressEntries.filter(
      (item) => item.topicRef && pathTopicIds.has(String(item.topicRef._id || item.topicRef))
    );

    return {
      domainId: path.domain?._id,
      domain: path.domain?.name || "Domain",
      category: path.domain?.category || "General",
      skillLevel: path.skillLevel,
      goal: path.goal,
      totalPathTopics: pathTopicIds.size,
      completedTopics: domainProgress.filter((item) => item.completed).length,
      averageCompletion: averageProgress(domainProgress)
    };
  });

  return {
    totalTopics,
    completedTopics,
    totalTimeSpentMinutes,
    averageCompletion,
    weakAreas,
    progressByDomain,
    activeLearningPaths: paths.length,
    recentTopics: progressEntries.slice(0, 5)
  };
};

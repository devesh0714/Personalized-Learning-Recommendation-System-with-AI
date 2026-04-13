import LearningPath from "../models/LearningPath.js";
import Subdomain from "../models/Subdomain.js";
import Topic from "../models/Topic.js";

export const buildMilestonesForDomain = async (domainId) => {
  const [subdomains, topics] = await Promise.all([
    Subdomain.find({ domain: domainId }).sort({ order: 1, name: 1 }),
    Topic.find({ domain: domainId }).sort({ order: 1, title: 1 })
  ]);

  return subdomains.map((subdomain) => ({
    subdomain: subdomain._id,
    title: subdomain.name,
    order: subdomain.order,
    topics: topics
      .filter((topic) => String(topic.subdomain) === String(subdomain._id))
      .map((topic) => ({
        topic: topic._id,
        title: topic.title,
        difficulty: topic.difficulty,
        order: topic.order,
        status: "not-started",
        completedAt: null
      }))
  }));
};

export const upsertLearningPathForUser = async ({ userId, domainId, skillLevel, goal }) => {
  const milestones = await buildMilestonesForDomain(domainId);

  return LearningPath.findOneAndUpdate(
    { user: userId, domain: domainId },
    {
      user: userId,
      domain: domainId,
      skillLevel,
      goal: goal || "Build strong fundamentals and progress step by step.",
      status: "active",
      milestones
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  )
    .populate("domain")
    .populate("milestones.subdomain")
    .populate("milestones.topics.topic");
};

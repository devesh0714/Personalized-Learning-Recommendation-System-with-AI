import dotenv from "dotenv";
import connectDb from "./config/db.js";
import Domain from "./models/Domain.js";
import Interest from "./models/Interest.js";
import LearningPath from "./models/LearningPath.js";
import Progress from "./models/Progress.js";
import Recommendation from "./models/Recommendation.js";
import Subdomain from "./models/Subdomain.js";
import Topic from "./models/Topic.js";
import User from "./models/User.js";
import { sampleDomains } from "./data/sampleCatalog.js";
import { upsertLearningPathForUser } from "./services/learningPathService.js";

dotenv.config();

const toSubtopic = (title, index, difficulty) => ({
  title,
  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  difficulty,
  estimatedMinutes: 30,
  order: index + 1
});

const seedCatalog = async () => {
  const createdDomains = new Map();

  for (const domainData of sampleDomains) {
    const domain = await Domain.create({
      name: domainData.name,
      slug: domainData.slug,
      category: domainData.category,
      description: domainData.description,
      goals: domainData.goals,
      order: domainData.order,
      isActive: true
    });
    createdDomains.set(domain.slug, domain);

    for (const subdomainData of domainData.subdomains) {
      const subdomain = await Subdomain.create({
        domain: domain._id,
        name: subdomainData.name,
        slug: subdomainData.slug,
        description: subdomainData.description,
        order: subdomainData.order
      });

      for (const topicData of subdomainData.topics) {
        await Topic.create({
          domain: domain._id,
          subdomain: subdomain._id,
          title: topicData.title,
          slug: topicData.slug,
          description: topicData.description,
          difficulty: topicData.difficulty,
          estimatedMinutes: topicData.estimatedMinutes,
          order: topicData.order,
          resources: topicData.resources,
          subtopics: topicData.subtopics.map((title, index) =>
            toSubtopic(title, index, topicData.difficulty)
          )
        });
      }
    }
  }

  return createdDomains;
};

const seed = async () => {
  await connectDb();

  await Promise.all([
    User.deleteMany({}),
    Interest.deleteMany({}),
    LearningPath.deleteMany({}),
    Progress.deleteMany({}),
    Recommendation.deleteMany({}),
    Topic.deleteMany({}),
    Subdomain.deleteMany({}),
    Domain.deleteMany({})
  ]);

  const domains = await seedCatalog();

  const user = await User.create({
    name: "Demo Learner",
    email: "demo@example.com",
    password: "password123",
    bio: "A sample user exploring AI-powered multi-domain recommendations.",
    currentLevel: "Intermediate"
  });

  const selected = [
    { slug: "dsa", skillLevel: "Intermediate", goal: "Crack coding interviews with strong DSA practice." },
    { slug: "artificial-intelligence", skillLevel: "Beginner", goal: "Build practical AI product skills." },
    { slug: "upsc-civil-services", skillLevel: "Beginner", goal: "Build a stable GS foundation." }
  ];

  for (const entry of selected) {
    const domain = domains.get(entry.slug);
    await upsertLearningPathForUser({
      userId: user._id,
      domainId: domain._id,
      skillLevel: entry.skillLevel,
      goal: entry.goal
    });
    user.selectedDomains.push({ domain: domain._id, skillLevel: entry.skillLevel, goal: entry.goal });
  }
  await user.save();

  const [arrays, supervised, polity] = await Promise.all([
    Topic.findOne({ slug: "arrays-and-strings" }).populate("domain subdomain"),
    Topic.findOne({ slug: "supervised-learning-fundamentals" }).populate("domain subdomain"),
    Topic.findOne({ slug: "constitutional-framework" }).populate("domain subdomain")
  ]);

  const progressEntries = [
    {
      user: user._id,
      domain: arrays.domain._id,
      subdomain: arrays.subdomain._id,
      topicRef: arrays._id,
      topic: arrays.title,
      category: arrays.domain.name,
      completed: true,
      progressPercentage: 100,
      timeSpentMinutes: 120,
      accuracy: 88,
      difficulty: arrays.difficulty,
      notes: "Comfortable solving easy array and string problems."
    },
    {
      user: user._id,
      domain: supervised.domain._id,
      subdomain: supervised.subdomain._id,
      topicRef: supervised._id,
      topic: supervised.title,
      category: supervised.domain.name,
      completed: false,
      progressPercentage: 42,
      timeSpentMinutes: 90,
      accuracy: 55,
      difficulty: supervised.difficulty,
      notes: "Needs more practice with evaluation metrics."
    },
    {
      user: user._id,
      domain: polity.domain._id,
      subdomain: polity.subdomain._id,
      topicRef: polity._id,
      topic: polity.title,
      category: polity.domain.name,
      completed: false,
      progressPercentage: 58,
      timeSpentMinutes: 75,
      accuracy: 63,
      difficulty: polity.difficulty,
      notes: "Review constitutional features before moving ahead."
    }
  ];

  await Progress.insertMany(progressEntries);

  console.log("Seed complete");
  console.log(`Demo login: ${user.email} / password123`);
  console.log(`Created ${sampleDomains.length} domains and ${progressEntries.length} progress records`);
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});

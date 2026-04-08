import dotenv from "dotenv";
import connectDb from "./config/db.js";
import Interest from "./models/Interest.js";
import Progress from "./models/Progress.js";
import Recommendation from "./models/Recommendation.js";
import User from "./models/User.js";
import { starterInterests, topicCatalog } from "./data/sampleCatalog.js";

dotenv.config();

const seed = async () => {
  await connectDb();

  await Promise.all([
    User.deleteMany({}),
    Interest.deleteMany({}),
    Progress.deleteMany({}),
    Recommendation.deleteMany({})
  ]);

  const user = await User.create({
    name: "Demo Learner",
    email: "demo@example.com",
    password: "password123",
    bio: "A sample user exploring AI-powered recommendations.",
    currentLevel: "Intermediate"
  });

  const interests = await Interest.insertMany(
    starterInterests.map((interest) => ({
      ...interest,
      user: user._id
    }))
  );

  const progressEntries = [
    {
      user: user._id,
      topic: topicCatalog.DSA[0].topic,
      category: "DSA",
      completed: true,
      progressPercentage: 100,
      timeSpentMinutes: 120,
      difficulty: "Beginner"
    },
    {
      user: user._id,
      topic: topicCatalog.AI[1].topic,
      category: "AI",
      completed: false,
      progressPercentage: 40,
      timeSpentMinutes: 90,
      difficulty: "Beginner"
    },
    {
      user: user._id,
      topic: topicCatalog["Web Development"][1].topic,
      category: "Web Development",
      completed: false,
      progressPercentage: 60,
      timeSpentMinutes: 75,
      difficulty: "Beginner"
    }
  ];

  await Progress.insertMany(progressEntries);

  console.log("Seed complete");
  console.log(`Demo login: ${user.email} / password123`);
  console.log(`Created ${interests.length} interests and ${progressEntries.length} progress records`);
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});

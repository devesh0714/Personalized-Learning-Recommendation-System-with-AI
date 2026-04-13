import OpenAI from "openai";

const fallbackInsight = ({ summary, recommendations }) => {
  const next = recommendations[0];
  const weak = summary.weakAreas?.[0];

  return {
    nextTopic: next?.nextTopic?.title || next?.title || "Pick the first topic in your active path",
    weakAreas: summary.weakAreas?.map((item) => item.topic) || [],
    strategy: weak
      ? `Review ${weak.topic} before moving to harder material.`
      : "Complete the next roadmap topic, then record time spent and accuracy.",
    headline: next ? `Next best step: ${next.nextTopic?.title || next.title}` : "Start with a saved learning path",
    insights: [
      next
        ? `Your next topic should be ${next.nextTopic?.title || next.title}.`
        : "Select at least one domain to generate a personalized roadmap.",
      weak
        ? `You are lagging in ${weak.topic}; spend a focused review session there.`
        : "No weak area is visible yet from your tracked progress.",
      "Keep updating completion, time spent, and accuracy so difficulty can adapt over time."
    ]
  };
};

const parseJson = (text, fallback) => {
  try {
    return JSON.parse(text);
  } catch (_error) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (_innerError) {
        return fallback;
      }
    }
    return fallback;
  }
};

export const buildRecommendationPrompt = ({ user, summary, recommendations }) => `
You are an expert AI learning recommendation engine for a multi-domain learning platform.

Student profile:
- Name: ${user.name}
- Current level: ${user.currentLevel}
- Selected domain goals: ${summary.progressByDomain
  ?.map((item) => `${item.domain} (${item.skillLevel}) goal: ${item.goal}`)
  .join("; ") || "No domains selected"}

Progress snapshot:
- Active learning paths: ${summary.activeLearningPaths}
- Topics tracked: ${summary.totalTopics}
- Topics completed: ${summary.completedTopics}
- Average completion: ${summary.averageCompletion}%
- Time spent: ${summary.totalTimeSpentMinutes} minutes
- Weak areas: ${summary.weakAreas?.map((item) => `${item.topic} in ${item.domain} at ${item.progressPercentage}%`).join("; ") || "None"}

Rule-based candidates:
${recommendations
  .map(
    (item, index) =>
      `${index + 1}. ${item.title} | Domain: ${item.category} | Difficulty: ${item.nextTopic?.difficulty || "NA"} | Reason: ${item.reason}`
  )
  .join("\n") || "No rule-based recommendations yet."}

Return JSON only with this exact shape:
{
  "nextTopic": "single next topic name",
  "weakAreas": ["weak area 1", "weak area 2"],
  "strategy": "short personalized strategy",
  "headline": "short coaching headline",
  "insights": [
    "progress insight",
    "next best step insight",
    "difficulty adjustment insight"
  ]
}
`;

export const buildInsightPrompt = buildRecommendationPrompt;

export const generateAiInsights = async ({ user, summary, recommendations }) => {
  const prompt = buildInsightPrompt({ user, summary, recommendations });
  const fallback = fallbackInsight({ summary, recommendations });

  if (!process.env.OPENAI_API_KEY) {
    return {
      provider: "mock",
      prompt,
      result: fallback
    };
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: prompt,
      temperature: 0.3
    });

    const outputText = response.output_text || "";
    const result = parseJson(outputText, fallback);

    return {
      provider: "openai",
      prompt,
      result
    };
  } catch (error) {
    console.error("OpenAI insight generation failed:", error.message);
    return {
      provider: "fallback",
      prompt,
      result: fallback
    };
  }
};

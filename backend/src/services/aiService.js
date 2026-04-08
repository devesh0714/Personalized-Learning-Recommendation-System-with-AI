import OpenAI from "openai";

const buildPrompt = ({ user, interests, summary, recommendations }) => `
You are an AI learning coach for a personalized learning recommendation system.

Student profile:
- Name: ${user.name}
- Level: ${user.currentLevel}
- Interests: ${interests.map((interest) => interest.name).join(", ") || "None"}

Learning summary:
- Topics tracked: ${summary.totalTopics}
- Topics completed: ${summary.completedTopics}
- Overall average completion: ${summary.averageCompletion}%
- Total time spent: ${summary.totalTimeSpentMinutes} minutes
- Weak areas: ${
  summary.weakAreas.length
    ? summary.weakAreas
        .map((area) => `${area.topic} (${area.category}, ${area.progressPercentage}%)`)
        .join("; ")
    : "No major weak areas identified"
}

Rule-based recommendations:
${recommendations.map((item, index) => `${index + 1}. ${item.title} - ${item.reason}`).join("\n") || "None"}

Return JSON only with this shape:
{
  "headline": "short summary",
  "insights": [
    "You should learn X next",
    "You are weak in Y",
    "Recommended next step is Z"
  ]
}
`;

const createMockInsights = ({ interests, summary, recommendations }) => {
  const firstInterest = interests[0]?.name || "your selected path";
  const firstWeakArea = summary.weakAreas[0]?.topic || `core ${firstInterest} fundamentals`;
  const topRecommendation = recommendations[0]?.title || `Continue with ${firstInterest}`;

  return {
    headline: `Focus on consistency in ${firstInterest}`,
    insights: [
      `You should learn ${topRecommendation.replace(/^Learn /, "").replace(/ next$/, "")} next.`,
      `You are currently weak in ${firstWeakArea}.`,
      `Recommended next step is to spend 30 focused minutes reviewing fundamentals and then complete one new topic.`
    ]
  };
};

export const generateAiInsights = async ({ user, interests, summary, recommendations }) => {
  const prompt = buildPrompt({ user, interests, summary, recommendations });

  if (!process.env.OPENAI_API_KEY) {
    return {
      provider: "mock",
      prompt,
      result: createMockInsights({ interests, summary, recommendations })
    };
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are a concise educational recommendation assistant."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.5
  });

  const content = completion.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(content);

  return {
    provider: "openai",
    prompt,
    result: parsed
  };
};

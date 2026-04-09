import fetch from "node-fetch";

export const generateAiInsights = async ({
  user,
  interests,
  summary,
  recommendations
}) => {
  try {
    // Extract interest names
    const interestNames = interests.map(i => i.name).join(", ");

    // Create prompt
    const prompt = `
You are an AI learning assistant.

User interests: ${interestNames}
Learning summary: ${summary}

Existing recommendations:
${recommendations.map(r => r.title).join(", ")}

Your task:
1. Give a short headline
2. Give 5 learning suggestions

Respond ONLY in JSON format like:
{
  "headline": "....",
  "insights": ["...", "...", "..."]
}
`;

    // Call Ollama API
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: false
      })
    });

    const data = await response.json();

    // Try parsing AI response
    let parsed;
    try {
      parsed = JSON.parse(data.response);
    } catch (err) {
      parsed = {
        headline: "Learning Recommendations",
        insights: [data.response]
      };
    }

    return {
      provider: "ollama",
      result: parsed
    };

  } catch (error) {
    console.error("Ollama error:", error.message);

    // Fallback (VERY IMPORTANT)
    return {
      provider: "fallback",
      result: {
        headline: "Basic Recommendations",
        insights: recommendations.map(r => r.title)
      }
    };
  }
};
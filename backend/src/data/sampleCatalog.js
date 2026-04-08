export const topicCatalog = {
  DSA: [
    { topic: "Arrays and Strings", difficulty: "Beginner", actionUrl: "https://neetcode.io" },
    { topic: "Hash Maps and Sets", difficulty: "Beginner", actionUrl: "https://leetcode.com" },
    { topic: "Binary Search Patterns", difficulty: "Intermediate", actionUrl: "https://www.geeksforgeeks.org" },
    { topic: "Dynamic Programming Basics", difficulty: "Intermediate", actionUrl: "https://cp-algorithms.com" }
  ],
  "Web Development": [
    { topic: "Semantic HTML and Accessibility", difficulty: "Beginner", actionUrl: "https://developer.mozilla.org" },
    { topic: "CSS Layouts with Flexbox and Grid", difficulty: "Beginner", actionUrl: "https://developer.mozilla.org" },
    { topic: "REST API Design", difficulty: "Intermediate", actionUrl: "https://expressjs.com" },
    { topic: "System Design for Frontend Apps", difficulty: "Advanced", actionUrl: "https://web.dev" }
  ],
  AI: [
    { topic: "Python for ML Workflows", difficulty: "Beginner", actionUrl: "https://scikit-learn.org" },
    { topic: "Supervised Learning Fundamentals", difficulty: "Beginner", actionUrl: "https://developers.google.com/machine-learning" },
    { topic: "Prompt Engineering Patterns", difficulty: "Intermediate", actionUrl: "https://platform.openai.com" },
    { topic: "Vector Search and Retrieval", difficulty: "Advanced", actionUrl: "https://platform.openai.com" }
  ],
  DevOps: [
    { topic: "Linux Command Line Basics", difficulty: "Beginner", actionUrl: "https://ubuntu.com/tutorials/command-line-for-beginners" },
    { topic: "CI/CD Pipelines", difficulty: "Intermediate", actionUrl: "https://docs.github.com/actions" },
    { topic: "Containerization with Docker", difficulty: "Intermediate", actionUrl: "https://docs.docker.com/get-started/" }
  ]
};

export const starterInterests = [
  { name: "DSA", category: "Problem Solving", priority: 5 },
  { name: "Web Development", category: "Engineering", priority: 4 },
  { name: "AI", category: "Data & Intelligence", priority: 5 },
  { name: "DevOps", category: "Platform", priority: 3 }
];

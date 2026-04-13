export const sampleDomains = [
  {
    name: "Data Structures and Algorithms",
    slug: "dsa",
    category: "Technology",
    description: "Problem-solving roadmap for coding interviews and computer science foundations.",
    goals: ["Crack coding interviews", "Improve problem solving", "Prepare for B.Tech CS exams"],
    order: 1,
    subdomains: [
      {
        name: "Core Data Structures",
        slug: "core-data-structures",
        description: "Arrays, strings, hashing, stacks, queues, and linked lists.",
        order: 1,
        topics: [
          {
            title: "Arrays and Strings",
            slug: "arrays-and-strings",
            difficulty: "Beginner",
            estimatedMinutes: 120,
            order: 1,
            description: "Learn traversal, two pointers, prefix sums, and string manipulation.",
            resources: [{ label: "NeetCode roadmap", url: "https://neetcode.io/roadmap" }],
            subtopics: ["Traversal patterns", "Two pointers", "Prefix sums"]
          },
          {
            title: "Hash Maps and Sets",
            slug: "hash-maps-and-sets",
            difficulty: "Beginner",
            estimatedMinutes: 100,
            order: 2,
            description: "Use hash-based lookup to solve frequency and grouping problems.",
            resources: [{ label: "LeetCode problems", url: "https://leetcode.com/problemset/" }],
            subtopics: ["Frequency maps", "Deduplication", "Grouping patterns"]
          }
        ]
      },
      {
        name: "Algorithms",
        slug: "algorithms",
        description: "Search, recursion, graph, and dynamic programming patterns.",
        order: 2,
        topics: [
          {
            title: "Binary Search Patterns",
            slug: "binary-search-patterns",
            difficulty: "Intermediate",
            estimatedMinutes: 110,
            order: 1,
            description: "Apply binary search to sorted arrays, answer spaces, and monotonic predicates.",
            resources: [{ label: "CP Algorithms", url: "https://cp-algorithms.com/" }],
            subtopics: ["Classic binary search", "Lower and upper bound", "Search on answer"]
          },
          {
            title: "Dynamic Programming Basics",
            slug: "dynamic-programming-basics",
            difficulty: "Advanced",
            estimatedMinutes: 180,
            order: 2,
            description: "Build intuition for overlapping subproblems and state transitions.",
            resources: [{ label: "DP patterns", url: "https://leetcode.com/discuss/study-guide/458695/Dynamic-Programming-Patterns" }],
            subtopics: ["Memoization", "Tabulation", "1D and 2D state"]
          }
        ]
      }
    ]
  },
  {
    name: "Web Development",
    slug: "web-development",
    category: "Technology",
    description: "Full-stack application development with accessible UI and production APIs.",
    goals: ["Build portfolio projects", "Become full-stack ready", "Prepare for internships"],
    order: 2,
    subdomains: [
      {
        name: "Frontend Engineering",
        slug: "frontend-engineering",
        description: "HTML, CSS, JavaScript, React, and frontend architecture.",
        order: 1,
        topics: [
          {
            title: "Semantic HTML and Accessibility",
            slug: "semantic-html-accessibility",
            difficulty: "Beginner",
            estimatedMinutes: 90,
            order: 1,
            description: "Write HTML that works for users, search engines, and assistive technology.",
            resources: [{ label: "MDN accessibility", url: "https://developer.mozilla.org/en-US/docs/Learn/Accessibility" }],
            subtopics: ["Semantic tags", "Forms", "Keyboard navigation"]
          },
          {
            title: "React Hooks and State",
            slug: "react-hooks-state",
            difficulty: "Intermediate",
            estimatedMinutes: 140,
            order: 2,
            description: "Build reusable React components with hooks and predictable state updates.",
            resources: [{ label: "React docs", url: "https://react.dev/learn" }],
            subtopics: ["useState", "useEffect", "Context"]
          }
        ]
      },
      {
        name: "Backend Engineering",
        slug: "backend-engineering",
        description: "REST APIs, data modeling, authentication, and deployment readiness.",
        order: 2,
        topics: [
          {
            title: "REST API Design",
            slug: "rest-api-design",
            difficulty: "Intermediate",
            estimatedMinutes: 120,
            order: 1,
            description: "Design predictable resources, status codes, validation, and error responses.",
            resources: [{ label: "Express guide", url: "https://expressjs.com/" }],
            subtopics: ["Resource routing", "Validation", "Error handling"]
          },
          {
            title: "JWT Authentication",
            slug: "jwt-authentication",
            difficulty: "Intermediate",
            estimatedMinutes: 100,
            order: 2,
            description: "Protect APIs with signed tokens and profile-aware middleware.",
            resources: [{ label: "JWT introduction", url: "https://jwt.io/introduction" }],
            subtopics: ["Token signing", "Middleware", "Protected routes"]
          }
        ]
      }
    ]
  },
  {
    name: "Artificial Intelligence",
    slug: "artificial-intelligence",
    category: "Technology",
    description: "Machine learning, prompt engineering, and applied AI product systems.",
    goals: ["Learn ML fundamentals", "Build AI products", "Understand LLM applications"],
    order: 3,
    subdomains: [
      {
        name: "Machine Learning",
        slug: "machine-learning",
        description: "Supervised learning, evaluation, and modeling workflow.",
        order: 1,
        topics: [
          {
            title: "Python for ML Workflows",
            slug: "python-ml-workflows",
            difficulty: "Beginner",
            estimatedMinutes: 100,
            order: 1,
            description: "Use Python, notebooks, and core data libraries for ML experiments.",
            resources: [{ label: "scikit-learn", url: "https://scikit-learn.org/stable/" }],
            subtopics: ["NumPy", "Pandas", "Notebook workflow"]
          },
          {
            title: "Supervised Learning Fundamentals",
            slug: "supervised-learning-fundamentals",
            difficulty: "Intermediate",
            estimatedMinutes: 150,
            order: 2,
            description: "Understand features, labels, train-test splits, and evaluation metrics.",
            resources: [{ label: "ML crash course", url: "https://developers.google.com/machine-learning/crash-course" }],
            subtopics: ["Regression", "Classification", "Evaluation metrics"]
          }
        ]
      },
      {
        name: "LLM Systems",
        slug: "llm-systems",
        description: "Prompting, retrieval, and AI application design.",
        order: 2,
        topics: [
          {
            title: "Prompt Engineering Patterns",
            slug: "prompt-engineering-patterns",
            difficulty: "Intermediate",
            estimatedMinutes: 100,
            order: 1,
            description: "Design prompts that produce structured, reliable, task-specific output.",
            resources: [{ label: "OpenAI platform", url: "https://platform.openai.com/docs" }],
            subtopics: ["Role framing", "JSON outputs", "Evaluation loops"]
          },
          {
            title: "Vector Search and Retrieval",
            slug: "vector-search-retrieval",
            difficulty: "Advanced",
            estimatedMinutes: 160,
            order: 2,
            description: "Use embeddings and retrieval to ground AI answers in domain content.",
            resources: [{ label: "OpenAI embeddings", url: "https://platform.openai.com/docs/guides/embeddings" }],
            subtopics: ["Embeddings", "Chunking", "Retrieval augmented generation"]
          }
        ]
      }
    ]
  },
  {
    name: "UPSC Civil Services",
    slug: "upsc-civil-services",
    category: "Government Exams",
    description: "Structured preparation for GS foundations, current affairs, and answer writing.",
    goals: ["Prepare for UPSC prelims", "Build GS foundation", "Improve answer writing"],
    order: 4,
    subdomains: [
      {
        name: "Polity",
        slug: "polity",
        description: "Indian Constitution, governance, and institutions.",
        order: 1,
        topics: [
          {
            title: "Constitutional Framework",
            slug: "constitutional-framework",
            difficulty: "Beginner",
            estimatedMinutes: 150,
            order: 1,
            description: "Cover the making, features, and philosophy of the Indian Constitution.",
            resources: [{ label: "PRS India", url: "https://prsindia.org/" }],
            subtopics: ["Preamble", "Federalism", "Basic structure"]
          },
          {
            title: "Fundamental Rights",
            slug: "fundamental-rights",
            difficulty: "Intermediate",
            estimatedMinutes: 130,
            order: 2,
            description: "Study rights, reasonable restrictions, and landmark judgments.",
            resources: [{ label: "India Code", url: "https://www.indiacode.nic.in/" }],
            subtopics: ["Article 14", "Article 19", "Article 21"]
          }
        ]
      },
      {
        name: "History",
        slug: "history",
        description: "Ancient, medieval, modern, and post-independence history.",
        order: 2,
        topics: [
          {
            title: "Modern India Overview",
            slug: "modern-india-overview",
            difficulty: "Beginner",
            estimatedMinutes: 160,
            order: 1,
            description: "Trace major events from Company rule to independence.",
            resources: [{ label: "NCERT", url: "https://ncert.nic.in/textbook.php" }],
            subtopics: ["Company rule", "1857 revolt", "National movement"]
          },
          {
            title: "Freedom Struggle Phases",
            slug: "freedom-struggle-phases",
            difficulty: "Intermediate",
            estimatedMinutes: 150,
            order: 2,
            description: "Compare moderate, extremist, Gandhian, and revolutionary phases.",
            resources: [{ label: "National Archives", url: "https://nationalarchives.nic.in/" }],
            subtopics: ["Moderates", "Extremists", "Gandhian movements"]
          }
        ]
      }
    ]
  },
  {
    name: "MBA Fundamentals",
    slug: "mba-fundamentals",
    category: "Professional Fields",
    description: "Management foundations across strategy, marketing, finance, and operations.",
    goals: ["Prepare for MBA coursework", "Build management basics", "Improve business thinking"],
    order: 5,
    subdomains: [
      {
        name: "Marketing",
        slug: "marketing",
        description: "Customers, segmentation, positioning, and go-to-market thinking.",
        order: 1,
        topics: [
          {
            title: "Segmentation Targeting Positioning",
            slug: "segmentation-targeting-positioning",
            difficulty: "Beginner",
            estimatedMinutes: 100,
            order: 1,
            description: "Understand how companies choose markets and position products.",
            resources: [{ label: "HBR", url: "https://hbr.org/" }],
            subtopics: ["Segmentation", "Targeting", "Positioning"]
          },
          {
            title: "Marketing Metrics",
            slug: "marketing-metrics",
            difficulty: "Intermediate",
            estimatedMinutes: 120,
            order: 2,
            description: "Measure acquisition, retention, conversion, and campaign effectiveness.",
            resources: [{ label: "Google Analytics", url: "https://analytics.google.com/" }],
            subtopics: ["CAC", "LTV", "Conversion rate"]
          }
        ]
      },
      {
        name: "Finance",
        slug: "finance",
        description: "Accounting, valuation, and financial decision making.",
        order: 2,
        topics: [
          {
            title: "Financial Statements",
            slug: "financial-statements",
            difficulty: "Beginner",
            estimatedMinutes: 120,
            order: 1,
            description: "Read income statements, balance sheets, and cash-flow statements.",
            resources: [{ label: "Investopedia", url: "https://www.investopedia.com/" }],
            subtopics: ["Income statement", "Balance sheet", "Cash flow"]
          },
          {
            title: "Time Value of Money",
            slug: "time-value-money",
            difficulty: "Intermediate",
            estimatedMinutes: 120,
            order: 2,
            description: "Use compounding and discounting to compare financial choices.",
            resources: [{ label: "Khan Academy finance", url: "https://www.khanacademy.org/economics-finance-domain" }],
            subtopics: ["Present value", "Future value", "Discount rate"]
          }
        ]
      }
    ]
  },
  {
    name: "Medical Entrance Foundations",
    slug: "medical-entrance-foundations",
    category: "Professional Fields",
    description: "Foundational biology and chemistry preparation for medical learners.",
    goals: ["Prepare for medical entrance basics", "Strengthen biology", "Improve concept retention"],
    order: 6,
    subdomains: [
      {
        name: "Biology",
        slug: "biology",
        description: "Cell biology, human physiology, and genetics.",
        order: 1,
        topics: [
          {
            title: "Cell Structure and Function",
            slug: "cell-structure-function",
            difficulty: "Beginner",
            estimatedMinutes: 120,
            order: 1,
            description: "Understand organelles, membranes, and cellular transport.",
            resources: [{ label: "NCERT", url: "https://ncert.nic.in/textbook.php" }],
            subtopics: ["Organelles", "Membrane transport", "Cell cycle"]
          },
          {
            title: "Human Physiology Basics",
            slug: "human-physiology-basics",
            difficulty: "Intermediate",
            estimatedMinutes: 150,
            order: 2,
            description: "Study core systems and how they maintain homeostasis.",
            resources: [{ label: "Khan Academy biology", url: "https://www.khanacademy.org/science/biology" }],
            subtopics: ["Digestion", "Respiration", "Circulation"]
          }
        ]
      },
      {
        name: "Chemistry",
        slug: "chemistry",
        description: "Physical, organic, and inorganic chemistry foundations.",
        order: 2,
        topics: [
          {
            title: "Chemical Bonding",
            slug: "chemical-bonding",
            difficulty: "Beginner",
            estimatedMinutes: 120,
            order: 1,
            description: "Learn ionic, covalent, and coordinate bonding patterns.",
            resources: [{ label: "Chem LibreTexts", url: "https://chem.libretexts.org/" }],
            subtopics: ["Ionic bonds", "Covalent bonds", "VSEPR"]
          }
        ]
      }
    ]
  }
];

export const starterInterests = sampleDomains.slice(0, 4).map((domain, index) => ({
  name: domain.name,
  category: domain.category,
  priority: 5 - Math.min(index, 2)
}));

export const topicCatalog = Object.fromEntries(
  sampleDomains.map((domain) => [
    domain.name,
    domain.subdomains.flatMap((subdomain) =>
      subdomain.topics.map((topic) => ({
        topic: topic.title,
        difficulty: topic.difficulty,
        actionUrl: topic.resources[0]?.url || ""
      }))
    )
  ])
);

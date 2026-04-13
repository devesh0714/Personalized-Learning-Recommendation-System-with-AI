# Personalized Learning Recommendation System with AI

A full-stack multi-domain learning platform built with React, Node.js, Express, MongoDB, Mongoose, JWT auth, and OpenAI-compatible AI insights.

The app supports flexible learning domains such as DSA, Web Development, AI, UPSC, MBA, medical foundations, finance, law-style catalog entries, government exams, and general skills. Domains are data-driven, so new fields can be added through the catalog seed or the MongoDB collections without changing frontend selection code.

## Features

- JWT authentication with user profiles, selected domains, skill levels, and goals
- Domain-based catalog architecture: `Domain -> Subdomain -> Topic -> Subtopic`
- Multi-select domain onboarding with Beginner, Intermediate, and Advanced levels
- Learning path generation per user and per domain
- Progress tracking for completed topics, time spent, progress percentage, optional accuracy, and notes
- Rule-based recommendation engine using path order, completion state, difficulty, and weak areas
- AI insight engine using OpenAI when `OPENAI_API_KEY` is present, with deterministic mock fallback when it is not
- Dashboard with progress analytics, AI insights, recommendations, and learning path preview
- Learning Path Viewer page with topic completion actions
- Seed data across technology, government exam, MBA, and medical foundation domains
- Non-destructive sample catalog initializer when the `Domain` collection is empty

## Project Structure

```text
.
├── backend
│   ├── package.json
│   └── src
│       ├── app.js
│       ├── server.js
│       ├── seed.js
│       ├── config/db.js
│       ├── controllers
│       │   ├── authController.js
│       │   ├── domainController.js
│       │   ├── interestController.js
│       │   ├── learningPathController.js
│       │   ├── progressController.js
│       │   └── recommendationController.js
│       ├── data/sampleCatalog.js
│       ├── middleware
│       │   ├── auth.js
│       │   └── errorHandler.js
│       ├── models
│       │   ├── Domain.js
│       │   ├── Subdomain.js
│       │   ├── Topic.js
│       │   ├── LearningPath.js
│       │   ├── Progress.js
│       │   ├── Recommendation.js
│       │   ├── User.js
│       │   └── Interest.js
│       ├── routes
│       ├── services
│       │   ├── aiService.js
│       │   ├── learningPathService.js
│       │   └── recommendationService.js
│       └── utils/generateToken.js
├── frontend
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src
│       ├── api/client.js
│       ├── components
│       │   ├── AIInsightPanel.jsx
│       │   ├── LearningPathViewer.jsx
│       │   ├── ProgressTracker.jsx
│       │   ├── RecommendationPanel.jsx
│       │   └── RecommendationCard.jsx
│       ├── context/AuthContext.jsx
│       ├── pages
│       │   ├── DashboardPage.jsx
│       │   ├── InterestsPage.jsx
│       │   ├── LearningPathPage.jsx
│       │   ├── LoginPage.jsx
│       │   └── RegisterPage.jsx
│       └── styles/index.css
└── README.md
```

## Database Design And Relationships

- `User`: stores profile, hashed password, `currentLevel`, and `selectedDomains`. Each selected domain stores a `Domain` reference, `skillLevel`, and goal.
- `Domain`: top-level learning field such as `UPSC Civil Services`, `Artificial Intelligence`, or `MBA Fundamentals`.
- `Subdomain`: child of one `Domain`, such as `Polity`, `Machine Learning`, or `Finance`.
- `Topic`: child of one `Subdomain` and one `Domain`. It stores difficulty, estimated time, resources, and embedded `subtopics`.
- `LearningPath`: belongs to one `User` and one `Domain`. It snapshots milestones from subdomains and ordered topic references for that user's roadmap.
- `Progress`: belongs to one `User` and optionally references `Domain`, `Subdomain`, and `Topic`. It tracks completion, percentage, time spent, accuracy, and notes.
- `Recommendation`: belongs to one `User`, optionally references a `Domain` and `Topic`, and stores rule-based or AI-generated guidance.

## Backend Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/domains`
- `GET /api/domains/:idOrSlug`
- `GET /api/learning-paths`
- `POST /api/learning-paths`
- `GET /api/learning-paths/:domainId`
- `GET /api/progress`
- `POST /api/progress`
- `GET /api/recommendations`
- `GET /api/interests` and `POST /api/interests` remain for backward compatibility with the older tag-based flow.

## AI Integration

AI logic lives in `backend/src/services/aiService.js`.

Set these variables in `backend/.env`:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

If `OPENAI_API_KEY` is not set, the backend returns a mock insight so the app still works locally.

Recommendation and insight prompt shape:

```text
You are an expert AI learning recommendation engine for a multi-domain learning platform.

Student profile:
- Name: ...
- Current level: ...
- Selected domain goals: ...

Progress snapshot:
- Active learning paths: ...
- Topics tracked: ...
- Topics completed: ...
- Average completion: ...
- Time spent: ...
- Weak areas: ...

Rule-based candidates:
1. Learn X next | Domain: ... | Difficulty: ... | Reason: ...

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
```

## Local Setup

### 1. Start MongoDB

Run MongoDB locally on:

```text
mongodb://127.0.0.1:27017
```

### 2. Configure backend

```bash
cd "/Users/deveshkumar/Documents/Projects/Personalized Learning Recommendation System with AI/backend"
cp .env.example .env
```

Required or recommended backend env values:

```bash
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/personalized-learning-ai
JWT_SECRET=replace_this_with_a_long_secret
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

### 3. Configure frontend

```bash
cd "/Users/deveshkumar/Documents/Projects/Personalized Learning Recommendation System with AI/frontend"
cp .env.example .env
```

Frontend env:

```bash
VITE_API_URL=http://localhost:5001/api
```

### 4. Install dependencies

```bash
cd "/Users/deveshkumar/Documents/Projects/Personalized Learning Recommendation System with AI/backend"
npm install

cd "/Users/deveshkumar/Documents/Projects/Personalized Learning Recommendation System with AI/frontend"
npm install
```

### 5. Seed sample data

The app can auto-load the sample domain catalog when the `Domain` collection is empty. Use the seed script only when you also want the demo user, demo learning paths, and demo progress records. Warning: the seed script clears the app collections before inserting fresh demo data.

```bash
cd "/Users/deveshkumar/Documents/Projects/Personalized Learning Recommendation System with AI/backend"
npm run seed
```

Demo credentials after seeding:

```text
Email: demo@example.com
Password: password123
```

### 6. Run the app

Backend:

```bash
cd "/Users/deveshkumar/Documents/Projects/Personalized Learning Recommendation System with AI/backend"
npm run dev
```

Frontend:

```bash
cd "/Users/deveshkumar/Documents/Projects/Personalized Learning Recommendation System with AI/frontend"
npm run dev
```

Open `http://localhost:5173`.

## How It Works End To End

1. A learner registers or logs in and receives a JWT.
2. The frontend loads available domains from `/api/domains`.
3. The learner selects multiple domains, skill levels, and goals.
4. The backend creates one `LearningPath` per selected domain using catalog subdomains and ordered topics.
5. The learner records progress from the dashboard or Learning Path Viewer.
6. Rule-based recommendations pick the next incomplete topic and flag weak areas from low progress or accuracy.
7. AI insights summarize the next best topic, weak areas, and strategy using the exact prompt returned to the frontend.

## Extending With New Domains

Add a new object in `backend/src/data/sampleCatalog.js` with this shape:

```js
{
  name: "Law Fundamentals",
  slug: "law-fundamentals",
  category: "Professional Fields",
  description: "Core legal concepts and exam-oriented preparation.",
  goals: ["Build legal basics"],
  order: 7,
  subdomains: [
    {
      name: "Constitutional Law",
      slug: "constitutional-law",
      description: "Rights, structure, and judicial review.",
      order: 1,
      topics: [
        {
          title: "Judicial Review",
          slug: "judicial-review",
          difficulty: "Intermediate",
          estimatedMinutes: 120,
          order: 1,
          description: "Understand judicial review and constitutional remedies.",
          resources: [{ label: "Reference", url: "" }],
          subtopics: ["Writs", "Review powers", "Landmark cases"]
        }
      ]
    }
  ]
}
```

Run `npm run seed` to reload demo data, or insert equivalent `Domain`, `Subdomain`, and `Topic` documents directly in MongoDB.

## Verification

- Backend JavaScript syntax check: `find backend/src -name '*.js' -exec node --check {} +`
- Frontend production build: `npm run build` from `frontend`

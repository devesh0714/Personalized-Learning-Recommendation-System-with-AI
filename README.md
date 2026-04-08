# Personalized Learning Recommendation System with AI

A production-style full-stack learning platform built with React, Node.js, Express, MongoDB, and OpenAI-compatible AI insights.

## Features

- JWT authentication with user profile storage
- Interest selection and persistence
- Learning tracking for completed topics, progress percentage, and time spent
- Rule-based recommendation engine
- AI-generated personalized insights with OpenAI support and mock fallback
- Dashboard with progress analytics, recommendations, and AI coaching
- Seed data for quick local demos

## Project Structure

```text
.
├── backend
│   ├── package.json
│   └── src
│       ├── app.js
│       ├── server.js
│       ├── seed.js
│       ├── config
│       │   └── db.js
│       ├── controllers
│       ├── data
│       ├── middleware
│       ├── models
│       ├── routes
│       ├── services
│       └── utils
├── frontend
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src
│       ├── api
│       ├── components
│       ├── context
│       ├── pages
│       └── styles
└── README.md
```

## Backend

### Core routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/interests`
- `POST /api/interests`
- `GET /api/progress`
- `POST /api/progress`
- `GET /api/recommendations`

### MongoDB models

- `User`: profile and credentials
- `Interest`: selected learning interests with priority
- `Progress`: topic progress, completion, time spent
- `Recommendation`: stored rule-based and AI-generated recommendations

### AI integration

AI insights are generated in [`backend/src/services/aiService.js`](/Users/deveshkumar/Documents/New project/backend/src/services/aiService.js).

Prompt template:

```text
You are an AI learning coach for a personalized learning recommendation system.

Student profile:
- Name: ...
- Level: ...
- Interests: ...

Learning summary:
- Topics tracked: ...
- Topics completed: ...
- Overall average completion: ...
- Total time spent: ...
- Weak areas: ...

Rule-based recommendations:
1. ...

Return JSON only with this shape:
{
  "headline": "short summary",
  "insights": [
    "You should learn X next",
    "You are weak in Y",
    "Recommended next step is Z"
  ]
}
```

If `OPENAI_API_KEY` is missing, the backend returns a deterministic mock response so the app still works locally.

## Frontend

### Pages

- `LoginPage`
- `RegisterPage`
- `InterestsPage`
- `DashboardPage`

### Reusable components

- `RecommendationCard`
- `ProgressTracker`
- `Layout`
- `ProtectedRoute`

## Local Setup

### 1. Start MongoDB

Run a local MongoDB instance on `mongodb://127.0.0.1:27017`.

### 2. Configure backend

```bash
cd backend
cp .env.example .env
```

Optional:

- Set `OPENAI_API_KEY` for live AI insights
- Adjust `JWT_SECRET`

### 3. Configure frontend

```bash
cd ../frontend
cp .env.example .env
```

### 4. Install dependencies

```bash
cd /Users/deveshkumar/Documents/New\ project/backend
npm install

cd /Users/deveshkumar/Documents/New\ project/frontend
npm install
```

### 5. Seed sample data

```bash
cd /Users/deveshkumar/Documents/New\ project/backend
npm run seed
```

Demo credentials after seeding:

- Email: `demo@example.com`
- Password: `password123`

### 6. Run the app

Backend:

```bash
cd /Users/deveshkumar/Documents/New\ project/backend
npm run dev
```

Frontend:

```bash
cd /Users/deveshkumar/Documents/New\ project/frontend
npm run dev
```

Open `http://localhost:5173`.

## How It Works End-to-End

1. User registers or logs in and receives a JWT.
2. User selects interests, which are stored in MongoDB.
3. User progress is added and aggregated into a learning summary.
4. Rule-based recommendations are generated from interest tags and missing topics.
5. AI insights use the summary plus recommendations to suggest what to learn next.
6. Dashboard renders progress, recommendations, and AI guidance in one place.

## Sample Extension Ideas

- Add refresh tokens and password reset flows
- Create an admin content catalog for courses and modules
- Add charts with Recharts or Nivo
- Store AI insight history for trend analysis
- Add spaced repetition and streak-based nudges

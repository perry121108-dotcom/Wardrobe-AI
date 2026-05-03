# WARDROBE AI

[![CI](https://github.com/perry121108-dotcom/Wardrobe-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/perry121108-dotcom/Wardrobe-AI/actions/workflows/ci.yml)

WARDROBE AI is an AI wardrobe recommendation PWA that combines a Node.js / Express backend, PostgreSQL on Supabase, JWT auth, and a rule-based styling engine for color season, occasion, silhouette, material, and seasonal outfit guidance.

## Live Demo

- PWA Demo: [https://wardrobe-ai-pwa-v2.onrender.com](https://wardrobe-ai-pwa-v2.onrender.com)
- API Test: [https://wardrobe-ai-pwa-v2.onrender.com/api/test](https://wardrobe-ai-pwa-v2.onrender.com/api/test)
- Database Health: [https://wardrobe-ai-pwa-v2.onrender.com/api/health/db](https://wardrobe-ai-pwa-v2.onrender.com/api/health/db)
- Mobile Demo Checklist: [docs/MOBILE_DEMO_CHECKLIST.md](docs/MOBILE_DEMO_CHECKLIST.md)

Render Free services may cold start after inactivity. For interviews, open the demo 5-10 minutes before presenting.

The project was repositioned from an APK-only mobile demo into a phone-friendly PWA, so it can be opened directly from iPhone Safari, Android Chrome, or a desktop browser during interviews and portfolio reviews.

## Current Status

- Production PWA is deployed on Render.
- Production database is deployed on Supabase.
- Render health checks and database-backed endpoints are verified.
- Mobile API base URL points to the new production service.
- GitHub README, release notes, mobile demo checklist, and infrastructure notes are updated for portfolio use.

Verified endpoints:

```text
/                         200
/api/test                 200
/api/health/config        200
/api/health/db            200
/api/meta/seasons         200
/api/meta/occasions       200
/api/meta/materials       200
```

## Core Features

- AI outfit recommendation flow for occasion and season.
- 12 color-season reference system.
- Wardrobe item attributes for category, color, material, silhouette, pattern, drape, style tags, and season tags.
- Personalized profile inputs for color season, skin tone, and body type.
- Outfit history and feedback loop for future recommendation tuning.
- PWA deployment for phone-based live demonstration.

## Screenshots

### Outfit Recommendation

![Outfit recommendation](assets/github/screenshots/01-recommend-select-full.png)

### Cold Start Color Guide

![Cold start color guide](assets/github/screenshots/02-cold-start-guide-full.png)

### Personal Settings

![Personal settings](assets/github/screenshots/03-personal-settings-full.png)

### Wardrobe State

![Wardrobe state](assets/github/screenshots/04-wardrobe-empty-full.png)

## Tech Stack

- Frontend: Expo, React Native, TypeScript, Expo Web / PWA
- Backend: Node.js, Express
- Database: PostgreSQL / Supabase
- Auth: JWT access token and refresh token
- Deployment: Render
- Container: Docker / docker-compose
- Testing: Node-based backend verification and production endpoint checks

## API Example

Create an account and get a token:

```bash
curl -X POST https://wardrobe-ai-pwa-v2.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo-password-123"}'
```

Recommendation request:

```http
POST /api/recommend
Authorization: Bearer <access_token>
Content-Type: application/json
```

```json
{
  "occasion": "work_daily",
  "season": "summer",
  "top_n": 3
}
```

Example response shape:

```json
{
  "recommendations": [
    {
      "score": 8.7,
      "outfit": {
        "layers": [],
        "bottom": null,
        "accessories": {}
      },
      "analysis": ["color harmony", "occasion fit", "season fit"]
    }
  ]
}
```

## Local Development

```bash
npm install
npm start
```

Create a local environment file from the example:

```bash
cp .env.example .env
```

PWA build:

```bash
cd mobile
npm install
npm run build:web
```

The server serves both the API and the generated PWA static files.

## Docker

Build and run the app container:

```bash
docker build -t wardrobe-ai .
docker run --env-file .env -p 3000:3000 wardrobe-ai
```

Run app + local PostgreSQL:

```bash
docker compose up --build
```

The compose file starts PostgreSQL for local development. Apply the database schema from `db/` before testing database-backed endpoints locally.

## Production Verification

```bash
npm run verify:production
```

Manual production checks:

```text
https://wardrobe-ai-pwa-v2.onrender.com/
https://wardrobe-ai-pwa-v2.onrender.com/api/test
https://wardrobe-ai-pwa-v2.onrender.com/api/health/config
https://wardrobe-ai-pwa-v2.onrender.com/api/health/db
https://wardrobe-ai-pwa-v2.onrender.com/api/meta/seasons
https://wardrobe-ai-pwa-v2.onrender.com/api/meta/occasions
https://wardrobe-ai-pwa-v2.onrender.com/api/meta/materials
```

## Portfolio Notes

WARDROBE AI is the main full-stack AI product in the 30-day GitHub portfolio plan. The project now satisfies the interview demo requirement: it can be opened from a phone as a live, hosted, database-backed PWA.

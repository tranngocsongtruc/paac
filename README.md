# `README.md`

# PAAC
**Policy-Aware Agent Console**  
A frontend + backend prototype for runtime governance of AI agents.
- 🔗 Live demo: https://paac-five.vercel.app 
- 🔗 Backend: https://paac.onrender.com/
(for health check) https://paac.onrender.com/health 
- 🔗 Repo: https://github.com/tranngocsongtruc/paac

## What PAAC demonstrates

PAAC is built around one idea:

> The enterprise problem is no longer only “what did the model say?” but “what is the agent doing, what is it allowed to do, and why was that decision made?”

The current prototype demonstrates:
- runtime action evaluation
- agent inventory/visibility
- policy library
- audit trail/decision provenance
- multi-persona views for Engineering, Security, Compliance, and Operations

## Project structure

```text
paac/
  backend/
    app.py
    requirements.txt
    README.md

  src/
    app/
      App.tsx
      components/
        RuntimeScreen.tsx
        AgentsScreen.tsx
        PoliciesScreen.tsx
        AuditScreen.tsx
        AccessibilityPage.tsx
        PrivacyPolicy.tsx
    lib/
      api.ts
      types.ts
```

## Tech stack

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

### Backend
- FastAPI
- Pydantic
- Uvicorn

## Run locally

### 1. Start backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
set -a
source ../.env
set +a
uvicorn app:app --reload --port 8000
```

### 2. Start frontend

From the repo root:

```bash
npm install
npm run dev
```

Frontend:

`http://127.0.0.1:5173`

Backend:

`http://127.0.0.1:8000`

## How to know the demo is working

The demo is successful if:

1. backend health works:

`http://127.0.0.1:8000/health`

2. frontend loads:
- Runtime
- Agents
- Policies
- Audit

3. you can:
- sign in on Runtime using the `.env` demo credentials
- run a scenario
- see a runtime decision
- then go to Audit and see the new latest trace

## Current scope

This is a prototype, not a production platform.

Implemented:

- seeded backend data
- runtime decision endpoint
- basic auth flow for demo
- rate limiting
- input validation
- prompt-injection signal detection
- policy matching
- audit records in memory

Not yet implemented:

- persistent database
- robust threat detection
- multi-step execution engine
- real-time updates
- full policy editing
- production identity/access control

## Main feature flow

### Runtime

Action-level evaluation of a scenario.

### Agents

Inventory of active agents and their tool boundaries.

### Policies

Policy library showing allow / block / require approval logic.

### Audit

Decision provenance showing what happened and why.

Together, they form one story:

- Runtime creates a decision
- Policies explain the rule
- Agents explain who acted
- Audit preserves the record

## Deployment

Recommended:

- backend on Render
- frontend on Vercel

proxy or rewrite API routes from frontend to backend

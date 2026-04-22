# PAAC System Documentation

**Policy-Aware Agent Console (PAAC)**

## System overview

PAAC is a frontend + backend prototype for runtime governance of AI agents.

The project is designed to demonstrate:
- action-level policy evaluation
- agent visibility
- decision provenance
- persona-specific trust UX

## Current architecture

```text
paac/
  backend/
    app.py
    requirements.txt

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

## Frontend stack
- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

## Backend stack
- FastAPI
- Pydantic
- Uvicorn

## Frontend responsibilities

The frontend is responsible for:

- rendering the trust interface
- handling theme and view mode state
- loading backend data
- allowing the user to sign in and run seeded scenarios
- showing runtime, agents, policies, and audit information together

## Backend responsibilities

The backend is responsible for:

- serving seeded agents
- serving seeded policies
- serving seeded audit history
- authenticating demo sign-in
- evaluating action requests
- enforcing basic policy logic
- returning decision reasons, risk flags, and latency

## Current data flow
1. frontend loads seeded backend data from:
`/agents`
`/policies`
`/decisions`
`/scenarios`
2. user signs in through:
`/auth/demo-login`
3. user runs a scenario through:
`/evaluate-action`
4. backend returns:
decision
reason
matched policies
risk flags
latency
5. frontend refreshes Audit from:
`/decisions`

## Security posture of current prototype

Implemented:

- backend-only env secrets
- basic session auth
- rate limiting
- request size limits
- input validation
- rejection of extra fields
- prompt-injection signal checks
- tool allowlist enforcement
- in-memory audit logging

Limitations:

- no persistent DB
- no SSO/OIDC
- no distributed rate limiting
- no full CSRF strategy
- no robust adversarial detection pipeline
- no multi-step execution memory model
- no production observability stack

## Accessibility

Current status:

- accessibility-aware design
- keyboard-friendly layout
- high-contrast theme
- readable spacing and font sizes

## Development

### Run backend
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

### Run frontend
```bash
npm install
npm run dev
```

## Deployment recommendation

Recommended setup:

- backend on Render
- frontend on Vercel

Use either:

- frontend rewrites to backend
- or explicit frontend API base configuration

## Deployment steps

### Backend on Render
Render’s official FastAPI guide supports deploying a Python web service with a build command and start command. :contentReference[oaicite:3]{index=3}

In Render:
- New Web Service
- connect your repo
- Root Directory: `backend`
- Build Command:
  ```bash
  pip install -r requirements.txt
  ```
- Start Command:
  ```bash
  uvicorn app:app --host 0.0.0.0 --port $PORT
  ```

Set env vars there from your `.env`, but do not upload the actual `.env` file.

### Frontend on Vercel

Vercel officially supports Vite projects.

In Vercel:

- import repo
- Framework Preset: `Vite`
- Root Directory: `.`
- Build Command:
  ```bash
  npm run build
  ```
- Output Directory:
  ```bash
  dist
  ```
### Use rewrites

Vercel rewrites can proxy requests to an external origin without changing the browser URL.

So create `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/health", "destination": "https://your-backend.onrender.com/health" },
    { "source": "/security-info", "destination": "https://your-backend.onrender.com/security-info" },
    { "source": "/agents", "destination": "https://your-backend.onrender.com/agents" },
    { "source": "/policies", "destination": "https://your-backend.onrender.com/policies" },
    { "source": "/decisions", "destination": "https://your-backend.onrender.com/decisions" },
    { "source": "/scenarios", "destination": "https://your-backend.onrender.com/scenarios" },
    { "source": "/evaluate-action", "destination": "https://your-backend.onrender.com/evaluate-action" },
    { "source": "/auth/demo-login", "destination": "https://your-backend.onrender.com/auth/demo-login" },
    { "source": "/auth/logout", "destination": "https://your-backend.onrender.com/auth/logout" }
  ]
}
```

With this approach, you do not need to change `src/lib/api.ts`.

## Future work
- persistent audit database
- stronger threat detection
- trajectory-based evaluation
- richer policy editor
- approval routing
- live updates
- production authentication
- deployment hardening
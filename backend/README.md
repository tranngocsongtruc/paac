# PAAC Backend

Lightweight FastAPI backend for the Policy-Aware Agent Console (PAAC).

## What it does

The backend provides:
- seeded agent inventory
- seeded policy library
- seeded audit history
- runtime action evaluation
- demo authentication
- basic security controls for the demo

## Current security controls

This backend currently includes:
- environment-variable based secret handling
- input validation with constrained schemas
- rejection of extra JSON fields
- simple per-route rate limiting
- basic request size limits
- demo session authentication
- prompt-injection signal checks
- tool allowlist enforcement
- audit-style decision logging in memory

## Current limitations

This is a prototype backend, not a production control plane. It does **not** yet include:
- persistent database storage
- SSO/OIDC
- distributed rate limiting
- robust prompt-injection detection
- multi-step trajectory evaluation
- background workers
- production observability stack

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
set -a
source ../.env
set +a
uvicorn app:app --reload --port 8000
```

## Test locally

Open:

`/health`
`/agents`
`/policies`
`/decisions`
`/scenarios`

Example:

`http://127.0.0.1:8000/health`

## Endpoints

### Read endpoints
`GET /health`
`GET /agents`
`GET /policies`
`GET /decisions`
`GET /scenarios`
`GET /security-info`

### Protected mutation endpoints
`POST /auth/demo-login`
`POST /auth/logout`
`POST /evaluate-action`

## Demo login

The login credentials come from `.env`:

`DEMO_USERNAME`
`DEMO_PASSWORD`

## Deploy notes

Recommended:

backend on Render
frontend on Vercel

In production, secrets should stay only in the backend environment and never be committed to Git.
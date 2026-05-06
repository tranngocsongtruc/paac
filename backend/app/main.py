import hashlib
import hmac
import re
import time
import uuid
from collections import defaultdict, deque
from datetime import datetime, timezone
from typing import Any, Deque, Dict, List, Literal

from fastapi import FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import (
    ALLOWED_ORIGINS,
    APP_ENV,
    DEMO_API_TOKEN,
    DEMO_PASSWORD,
    DEMO_USERNAME,
    MAX_DECISION_LOG,
    MAX_REQUEST_BODY_BYTES,
    RATE_LIMIT_PER_MINUTE,
    SESSION_COOKIE_NAME,
)

from app.data_seed import AGENTS, DECISIONS, POLICIES, AGENT_INDEX, get_seed_scenarios
from app.schemas import ActionRequest, DecisionRecord, InvariantCheck, LoginRequest
from app.services.auth_service import create_session_token, is_valid_session
from app.services.explanation_service import build_human_explanation, build_next_step
from app.services.invariant_checker import check_invariants
from app.services.policy_engine import evaluate_policy
from app.services.risk_service import evaluate_injection_risk

SAFE_TEXT_RE = re.compile(r"^[A-Za-z0-9_\- .,:/@()#+]{1,120}$")
PURPOSE_RE = re.compile(r"^[A-Za-z0-9_\- .,:/@()#+]{1,180}$")

TRACE_BUCKET: Dict[str, Deque[float]] = defaultdict(deque)

Decision = Literal["allow", "block", "require_approval"]

app = FastAPI(title="PAAC Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
)


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def client_identifier(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@app.middleware("http")
async def limit_body_and_add_security_headers(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > MAX_REQUEST_BODY_BYTES:
        return JSONResponse(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            content={"detail": "Request too large"},
        )

    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Cache-Control"] = "no-store"
    return response


@app.middleware("http")
async def simple_rate_limiter(request: Request, call_next):
    bucket_key = f"{client_identifier(request)}:{request.url.path}"
    bucket = TRACE_BUCKET[bucket_key]
    now = time.time()

    while bucket and now - bucket[0] > 60:
        bucket.popleft()

    if len(bucket) >= RATE_LIMIT_PER_MINUTE:
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={"detail": "Rate limit exceeded. Slow down and retry shortly."},
            headers={"Retry-After": "60"},
        )

    bucket.append(now)
    return await call_next(request)


@app.middleware("http")
async def require_auth_for_mutations(request: Request, call_next):
    if request.method == "POST" and request.url.path not in {"/auth/demo-login"}:
        session_token = request.cookies.get(SESSION_COOKIE_NAME)
        auth_header = request.headers.get("authorization", "")
        header_ok = auth_header.startswith("Bearer ") and hmac.compare_digest(
            auth_header.removeprefix("Bearer ").strip(),
            DEMO_API_TOKEN,
        )
        cookie_ok = is_valid_session(session_token)

        if not (header_ok or cookie_ok):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Authentication required"},
            )

    return await call_next(request)


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok", "env": APP_ENV}


@app.get("/security-info")
def security_info() -> Dict[str, Any]:
    return {
        "app_env": APP_ENV,
        "allowed_origins": ALLOWED_ORIGINS,
        "rate_limit_per_minute": RATE_LIMIT_PER_MINUTE,
        "notes": [
            "Secrets stay on the server via environment variables.",
            "Mutation routes require either a server-issued HttpOnly session cookie or a bearer token.",
            "Inputs are schema-validated and constrained.",
            "Prompt injection patterns are screened before action execution.",
            "This prototype uses in-memory demo data; real deployments should isolate DBs and use least privilege.",
        ],
    }


@app.post("/auth/demo-login")
def demo_login(request: LoginRequest, response: Response) -> Dict[str, str]:
    if not (
        hmac.compare_digest(request.username, DEMO_USERNAME)
        and hmac.compare_digest(request.password, DEMO_PASSWORD)
    ):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_session_token(request.username)
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False if APP_ENV == "dev" else True,
        samesite="lax",
        max_age=8 * 60 * 60,
    )
    return {"status": "ok"}


@app.post("/auth/logout")
def logout(response: Response) -> Dict[str, str]:
    response.delete_cookie(SESSION_COOKIE_NAME)
    return {"status": "logged_out"}


@app.get("/agents")
def get_agents() -> List[Dict[str, Any]]:
    return [agent.model_dump() for agent in AGENTS]


@app.get("/policies")
def get_policies() -> List[Dict[str, Any]]:
    return POLICIES


@app.get("/decisions")
def get_decisions() -> List[Dict[str, Any]]:
    return [decision.model_dump() for decision in DECISIONS[:MAX_DECISION_LOG]]


@app.get("/scenarios")
def get_scenarios() -> List[Dict[str, Any]]:
    return get_seed_scenarios()

@app.post("/evaluate-action")
def evaluate_action(request: ActionRequest) -> Dict[str, Any]:
    start = time.perf_counter()
    risk_flags = evaluate_injection_risk(request)
    try:
        decision, reason, matched_policies, approver = evaluate_policy(request, risk_flags)
    except ValueError:
        raise HTTPException(status_code=404, detail="Unknown agent_id")

    invariant_checks = check_invariants(request)

    if any(check["status"] == "failed" for check in invariant_checks):
        if decision == "allow":
            decision = "require_approval"
            reason = "One or more invariant checks failed before commit."
            matched_policies = matched_policies or ["INV-CHECK"]

    decision_title, human_explanation, safe_alternatives, confidence = build_human_explanation(
        decision=decision,
        matched_policies=matched_policies,
        risk_flags=risk_flags,
        action=request,
    )

    next_step = build_next_step(decision, approver)

    latency_ms = max(1, round((time.perf_counter() - start) * 1000))
    trace_id = f"tr_{uuid.uuid4().hex[:10]}"

    record = DecisionRecord(
        trace_id=trace_id,
        timestamp=utc_now_iso(),
        agent_id=request.agent_id,
        tool=request.tool,
        decision=decision,
        reason=reason,
        matched_policies=matched_policies,
        required_approver=approver,
        latency_ms=latency_ms,
        risk_flags=risk_flags,
        decision_title=decision_title,
        human_explanation=human_explanation,
        next_step=next_step,
        safe_alternatives=safe_alternatives,
        confidence=confidence,
        invariant_checks=[InvariantCheck(**check) for check in invariant_checks],
        ledger_status="recorded",
    )

    DECISIONS.insert(0, record)
    del DECISIONS[MAX_DECISION_LOG:]

    return {
        "trace_id": trace_id,
        "decision": decision,
        "reason": reason,
        "matched_policies": matched_policies,
        "required_approver": approver,
        "risk_flags": risk_flags,
        "latency_ms": latency_ms,
        "request_digest": hashlib.sha256(str(request.model_dump()).encode("utf-8")).hexdigest()[:16],
        "request": request.model_dump(),
        "decision_title": decision_title,
        "human_explanation": human_explanation,
        "next_step": next_step,
        "safe_alternatives": safe_alternatives,
        "confidence": confidence,
        "invariant_checks": invariant_checks,
        "ledger_status": "recorded",
    }
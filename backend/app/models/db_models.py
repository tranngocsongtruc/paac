from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, Boolean, Float
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class UserDB(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    role: Mapped[str] = mapped_column(String(80), index=True)
    org_id: Mapped[str] = mapped_column(String(80), default="demo_org")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class AgentDB(Base):
    __tablename__ = "agents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    agent_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    owner_team: Mapped[str] = mapped_column(String(120), index=True)
    description: Mapped[str] = mapped_column(Text)
    tools: Mapped[list[str]] = mapped_column(JSONB)
    risk_tier: Mapped[str] = mapped_column(String(40), index=True)
    status: Mapped[str] = mapped_column(String(40), index=True)
    last_violation: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class PolicyDB(Base):
    __tablename__ = "policies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    policy_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(160))
    description: Mapped[str] = mapped_column(Text)
    effect: Mapped[str] = mapped_column(String(40), index=True)
    conditions: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class ActionRequestDB(Base):
    __tablename__ = "action_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    trace_id: Mapped[str] = mapped_column(String(64), index=True, unique=True)

    requester_id: Mapped[str] = mapped_column(String(80), index=True)
    requester_role: Mapped[str] = mapped_column(String(80), index=True)
    agent_id: Mapped[str] = mapped_column(String(80), index=True)
    tool: Mapped[str] = mapped_column(String(80), index=True)
    target_resource: Mapped[str] = mapped_column(String(160))
    data_classification: Mapped[str] = mapped_column(String(40), index=True)
    purpose: Mapped[str] = mapped_column(Text)
    environment: Mapped[str] = mapped_column(String(40), index=True)
    recipient_domain: Mapped[str | None] = mapped_column(String(40), nullable=True)
    baseline_ok: Mapped[bool] = mapped_column()
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    request_digest: Mapped[str] = mapped_column(String(64), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    decision: Mapped["DecisionDB"] = relationship(
        back_populates="action_request",
        cascade="all, delete-orphan",
        uselist=False,
    )


class DecisionDB(Base):
    __tablename__ = "decisions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    trace_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("action_requests.trace_id"),
        index=True,
        unique=True,
    )

    agent_id: Mapped[str] = mapped_column(String(80), index=True)
    tool: Mapped[str] = mapped_column(String(80), index=True)

    decision: Mapped[str] = mapped_column(String(40), index=True)
    decision_title: Mapped[str] = mapped_column(String(160))
    reason: Mapped[str] = mapped_column(Text)
    human_explanation: Mapped[str] = mapped_column(Text)
    next_step: Mapped[str] = mapped_column(Text)
    safe_alternatives: Mapped[list[str]] = mapped_column(JSONB)

    confidence: Mapped[float] = mapped_column(Float)
    matched_policies: Mapped[list[str]] = mapped_column(JSONB)
    required_approver: Mapped[str | None] = mapped_column(String(120), nullable=True)
    latency_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    risk_flags: Mapped[list[str]] = mapped_column(JSONB)
    invariant_checks: Mapped[list[dict]] = mapped_column(JSONB)
    ledger_status: Mapped[str] = mapped_column(String(40), default="recorded")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    action_request: Mapped[ActionRequestDB] = relationship(back_populates="decision")


class InvariantCheckDB(Base):
    __tablename__ = "invariant_checks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    trace_id: Mapped[str] = mapped_column(String(64), ForeignKey("decisions.trace_id"), index=True)
    check_id: Mapped[str] = mapped_column(String(80), index=True)
    name: Mapped[str] = mapped_column(String(160))
    status: Mapped[str] = mapped_column(String(40), index=True)
    source: Mapped[str] = mapped_column(String(120), index=True)
    detail: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class AIRiskAnalysisDB(Base):
    __tablename__ = "ai_risk_analyses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    trace_id: Mapped[str] = mapped_column(String(64), index=True)
    request_digest: Mapped[str] = mapped_column(String(64), index=True)
    prompt_injection_likelihood: Mapped[float | None] = mapped_column(Float, nullable=True)
    data_exfiltration_likelihood: Mapped[float | None] = mapped_column(Float, nullable=True)
    suspicious_intent_likelihood: Mapped[float | None] = mapped_column(Float, nullable=True)
    model_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    raw_summary: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class ConversationalCapitalScoreDB(Base):
    __tablename__ = "conversational_capital_scores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    trace_id: Mapped[str] = mapped_column(String(64), index=True)
    verdict: Mapped[str] = mapped_column(String(40), index=True)
    score: Mapped[int] = mapped_column(Integer)
    checks: Mapped[list[str]] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
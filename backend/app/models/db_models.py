from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


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

    confidence: Mapped[float] = mapped_column()
    matched_policies: Mapped[list[str]] = mapped_column(JSONB)
    required_approver: Mapped[str | None] = mapped_column(String(120), nullable=True)
    latency_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    risk_flags: Mapped[list[str]] = mapped_column(JSONB)
    invariant_checks: Mapped[list[dict]] = mapped_column(JSONB)
    ledger_status: Mapped[str] = mapped_column(String(40), default="recorded")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    action_request: Mapped[ActionRequestDB] = relationship(back_populates="decision")
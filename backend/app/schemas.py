from __future__ import annotations

from typing import List, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.services.sanitizer import sanitize_text, validate_safe_text

Decision = Literal["allow", "block", "require_approval"]


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class Agent(StrictModel):
    id: str = Field(..., min_length=3, max_length=64)
    name: str = Field(..., min_length=2, max_length=80)
    owner_team: str = Field(..., min_length=2, max_length=80)
    description: str = Field(..., min_length=2, max_length=240)
    tools: List[str] = Field(default_factory=list, max_length=20)
    risk_tier: Literal["low", "medium", "high"]
    status: Literal["active", "paused"]
    last_violation: str = Field(..., max_length=180)

    @field_validator("id", "name", "owner_team")
    @classmethod
    def safe_short_text(cls, value: str) -> str:
        return validate_safe_text(value, max_length=80)

    @field_validator("description", "last_violation")
    @classmethod
    def safe_long_text(cls, value: str) -> str:
        return sanitize_text(value, max_length=240)

    @field_validator("tools")
    @classmethod
    def safe_tools(cls, values: List[str]) -> List[str]:
        return [validate_safe_text(value, max_length=64) for value in values]


class ActionRequest(StrictModel):
    requester_id: str = Field(..., min_length=3, max_length=64)
    requester_role: str = Field(..., min_length=3, max_length=64)
    agent_id: str = Field(..., min_length=3, max_length=64)
    tool: str = Field(..., min_length=2, max_length=64)
    target_resource: str = Field(..., min_length=2, max_length=120)
    data_classification: Literal["public", "internal", "confidential", "regulated"]
    purpose: str = Field(..., min_length=3, max_length=180)
    environment: Literal["dev", "staging", "prod"]
    recipient_domain: Literal["internal", "external"] | None = None
    baseline_ok: bool = True
    notes: str | None = Field(default=None, max_length=240)

    @field_validator("requester_id", "requester_role", "agent_id", "tool", "target_resource")
    @classmethod
    def safe_fields(cls, value: str) -> str:
        return validate_safe_text(value, max_length=120)

    @field_validator("purpose")
    @classmethod
    def safe_purpose(cls, value: str) -> str:
        return validate_safe_text(value, max_length=180)

    @field_validator("notes")
    @classmethod
    def safe_notes(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return sanitize_text(value, max_length=240)


class InvariantCheck(StrictModel):
    id: str = Field(..., min_length=2, max_length=80)
    name: str = Field(..., min_length=2, max_length=120)
    status: Literal["passed", "failed", "skipped"]
    source: str = Field(..., min_length=2, max_length=80)
    detail: str = Field(..., min_length=2, max_length=240)

    @field_validator("id", "name", "source")
    @classmethod
    def safe_short_text(cls, value: str) -> str:
        return validate_safe_text(value, max_length=120)

    @field_validator("detail")
    @classmethod
    def safe_detail(cls, value: str) -> str:
        return sanitize_text(value, max_length=240)


class DecisionRecord(StrictModel):
    trace_id: str = Field(..., min_length=3, max_length=64)
    timestamp: str = Field(..., min_length=10, max_length=40)
    agent_id: str = Field(..., min_length=3, max_length=64)
    tool: str = Field(..., min_length=2, max_length=64)
    decision: Decision
    decision_title: str = Field(..., min_length=2, max_length=160)
    reason: str = Field(..., min_length=2, max_length=300)
    human_explanation: str = Field(..., min_length=2, max_length=600)
    next_step: str = Field(..., min_length=2, max_length=300)
    safe_alternatives: List[str] = Field(default_factory=list, max_length=8)
    confidence: float = Field(..., ge=0.0, le=1.0)
    matched_policies: List[str] = Field(default_factory=list, max_length=20)
    required_approver: str | None = Field(default=None, max_length=120)
    latency_ms: int | None = Field(default=None, ge=0)
    risk_flags: List[str] = Field(default_factory=list, max_length=20)
    invariant_checks: List[InvariantCheck] = Field(default_factory=list)
    ledger_status: Literal["recorded"] = "recorded"


class LoginRequest(StrictModel):
    username: str = Field(..., min_length=1, max_length=80)
    password: str = Field(..., min_length=1, max_length=120)
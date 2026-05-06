from __future__ import annotations

import html
import re
from typing import List, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

SAFE_TEXT_RE = re.compile(r"^[A-Za-z0-9_\- .,:/@()#+]{1,120}$")
PURPOSE_RE = re.compile(r"^[A-Za-z0-9_\- .,:/@()#+]{1,180}$")

Decision = Literal["allow", "block", "require_approval"]


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class Agent(StrictModel):
    id: str
    name: str
    owner_team: str
    description: str
    tools: List[str]
    risk_tier: Literal["low", "medium", "high"]
    status: Literal["active", "paused"]
    last_violation: str


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
    def validate_safe_text(cls, value: str) -> str:
        if not SAFE_TEXT_RE.fullmatch(value):
            raise ValueError("contains unsupported characters")
        return value

    @field_validator("purpose")
    @classmethod
    def validate_purpose(cls, value: str) -> str:
        if not PURPOSE_RE.fullmatch(value):
            raise ValueError("contains unsupported characters")
        return value

    @field_validator("notes")
    @classmethod
    def sanitize_notes(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = html.escape(value, quote=True)
        return cleaned[:240]


class InvariantCheck(StrictModel):
    id: str
    name: str
    status: Literal["passed", "failed", "skipped"]
    source: str
    detail: str


class DecisionRecord(StrictModel):
    trace_id: str
    timestamp: str
    agent_id: str
    tool: str
    decision: Decision
    decision_title: str
    reason: str
    human_explanation: str
    next_step: str
    safe_alternatives: List[str]
    confidence: float
    matched_policies: List[str]
    required_approver: str | None = None
    latency_ms: int | None = None
    risk_flags: List[str] = []
    invariant_checks: List[InvariantCheck] = []
    ledger_status: Literal["recorded"] = "recorded"


class LoginRequest(StrictModel):
    username: str = Field(..., min_length=1, max_length=80)
    password: str = Field(..., min_length=1, max_length=120)
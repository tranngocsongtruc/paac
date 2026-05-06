from __future__ import annotations

from typing import Any, Dict, List

from app.database import get_db_session
from app.models.db_models import ActionRequestDB, DecisionDB, InvariantCheckDB
from app.schemas import ActionRequest, DecisionRecord


def persist_decision(
    *,
    trace_id: str,
    request_digest: str,
    action: ActionRequest,
    record: DecisionRecord,
) -> None:
    db = get_db_session()
    if db is None:
        return

    try:
        action_row = ActionRequestDB(
            trace_id=trace_id,
            requester_id=action.requester_id,
            requester_role=action.requester_role,
            agent_id=action.agent_id,
            tool=action.tool,
            target_resource=action.target_resource,
            data_classification=action.data_classification,
            purpose=action.purpose,
            environment=action.environment,
            recipient_domain=action.recipient_domain,
            baseline_ok=action.baseline_ok,
            notes=action.notes,
            request_digest=request_digest,
        )

        decision_row = DecisionDB(
            trace_id=trace_id,
            agent_id=record.agent_id,
            tool=record.tool,
            decision=record.decision,
            decision_title=record.decision_title,
            reason=record.reason,
            human_explanation=record.human_explanation,
            next_step=record.next_step,
            safe_alternatives=record.safe_alternatives,
            confidence=record.confidence,
            matched_policies=record.matched_policies,
            required_approver=record.required_approver,
            latency_ms=record.latency_ms,
            risk_flags=record.risk_flags,
            invariant_checks=[check.model_dump() for check in record.invariant_checks],
            ledger_status=record.ledger_status,
        )

        invariant_rows = [
            InvariantCheckDB(
                trace_id=trace_id,
                check_id=check.id,
                name=check.name,
                status=check.status,
                source=check.source,
                detail=check.detail,
            )
            for check in record.invariant_checks
        ]

        db.add(action_row)
        db.add(decision_row)

        # Ensure action_requests and decisions exist before inserting child invariant rows.
        db.flush()

        db.add_all(invariant_rows)
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def list_decisions_from_db(limit: int) -> List[Dict[str, Any]]:
    db = get_db_session()
    if db is None:
        return []

    try:
        rows = (
            db.query(DecisionDB)
            .order_by(DecisionDB.created_at.desc())
            .limit(limit)
            .all()
        )

        return [
            {
                "trace_id": row.trace_id,
                "timestamp": row.created_at.isoformat().replace("+00:00", "Z"),
                "agent_id": row.agent_id,
                "tool": row.tool,
                "decision": row.decision,
                "decision_title": row.decision_title,
                "reason": row.reason,
                "human_explanation": row.human_explanation,
                "next_step": row.next_step,
                "safe_alternatives": row.safe_alternatives,
                "confidence": row.confidence,
                "matched_policies": row.matched_policies,
                "required_approver": row.required_approver,
                "latency_ms": row.latency_ms,
                "risk_flags": row.risk_flags,
                "invariant_checks": row.invariant_checks,
                "ledger_status": row.ledger_status,
            }
            for row in rows
        ]
    finally:
        db.close()
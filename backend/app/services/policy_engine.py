from typing import List

from app.data_seed import AGENT_INDEX
from app.schemas import ActionRequest, Decision


def evaluate_policy(action: ActionRequest, risk_flags: List[str]) -> tuple[Decision, str, List[str], str | None]:
    agent = AGENT_INDEX.get(action.agent_id)
    if not agent:
        raise ValueError("Unknown agent_id")

    decision: Decision = "allow"
    reason = "Action allowed under current policy."
    matched_policies: List[str] = []
    approver: str | None = None

    if action.tool not in set(agent.tools):
        decision = "block"
        reason = "Requested tool is not in the agent allowlist."
        matched_policies = ["POL-060"]
    elif "prompt_injection_signal" in risk_flags:
        decision = "block"
        reason = "Potential prompt injection or secret-exfiltration pattern detected in request context."
        matched_policies = ["POL-051"]
    elif (
        action.tool in {"delete_record", "delete_customer", "delete_db_entry"}
        and action.environment == "prod"
        and action.requester_role != "admin"
    ):
        decision = "block"
        reason = "Production delete actions are restricted to admin-approved workflows."
        matched_policies = ["POL-030"]
    elif action.data_classification in {"confidential", "regulated"} and action.recipient_domain == "external":
        decision = "require_approval"
        reason = "Sensitive data cannot be sent externally without explicit review."
        matched_policies = ["POL-017", "POL-022"]
        approver = "hr_manager" if "payroll" in action.target_resource.lower() else "security_manager"
    elif not action.baseline_ok:
        decision = "require_approval"
        reason = "This tool call deviates from the agent's baseline behavior and needs review."
        matched_policies = ["POL-044"]
        approver = "agent_owner"
    elif action.agent_id == "agt_fin_001" and action.tool == "query_payroll_db":
        decision = "allow"
        reason = "Finance reporting workflow is permitted for internal analysis."
        matched_policies = ["POL-001"]

    return decision, reason, matched_policies, approver
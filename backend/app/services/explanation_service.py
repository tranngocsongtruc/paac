from typing import List

from app.schemas import ActionRequest, Decision


def build_human_explanation(
    decision: Decision,
    matched_policies: List[str],
    risk_flags: List[str],
    action: ActionRequest,
) -> tuple[str, str, List[str], float]:
    policy_title = (
        f"Policy {matched_policies[0]} triggered"
        if matched_policies
        else "Default policy decision"
    )

    if "prompt_injection_signal" in risk_flags:
        return (
            "Policy POL-051 triggered",
            "This request contains language that appears to override instructions or reveal protected information. To avoid unsafe tool use, the action is blocked before execution.",
            [
                "Remove instruction-override language.",
                "Submit a clean business request.",
                "Escalate to security if this came from external content.",
            ],
            0.88,
        )

    if action.data_classification in {"confidential", "regulated"} and action.recipient_domain == "external":
        return (
            policy_title,
            "This request involves sensitive data being sent externally. To protect against accidental data exposure, approval is required before the action can proceed.",
            [
                "Send only to internal recipients.",
                "Redact sensitive fields before sharing.",
                "Request approval from the required approver.",
            ],
            0.91,
        )

    if not action.baseline_ok:
        return (
            "Policy POL-044 triggered",
            "This tool call differs from the agent's normal behavior. Because unexpected tool use can indicate drift or misuse, the action needs review before execution.",
            [
                "Confirm the agent should have this capability.",
                "Route to the agent owner for review.",
                "Use an approved tool for this workflow.",
            ],
            0.82,
        )

    if decision == "allow":
        return (
            policy_title,
            "This action matches the agent's allowed tools and current policy context. It can proceed without additional approval.",
            [
                "Continue with the action.",
                "Review the audit trace if needed.",
            ],
            0.96,
        )

    return (
        policy_title,
        "The system could not confidently determine that this action is safe. It has been paused for review instead of being executed automatically.",
        [
            "Route to a human reviewer.",
            "Provide additional verified context.",
            "Retry with a narrower action.",
        ],
        0.65,
    )


def build_next_step(decision: Decision, approver: str | None) -> str:
    if decision == "allow":
        return "Proceed with the action and record the decision in the audit trail."

    if decision == "require_approval":
        if approver:
            return f"Route this request to {approver} for approval before execution."
        return "Route this request to the appropriate reviewer before execution."

    return "Do not execute this action. Revise the request or escalate for review."
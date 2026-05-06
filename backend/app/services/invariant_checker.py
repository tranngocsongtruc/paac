from typing import Dict, List

from app.data_seed import AGENT_INDEX
from app.schemas import ActionRequest


def check_invariants(action: ActionRequest) -> List[Dict[str, str]]:
    checks: List[Dict[str, str]] = []

    agent = AGENT_INDEX.get(action.agent_id)

    if agent:
        checks.append({
            "id": "INV-TOOL-ALLOWLIST",
            "name": "Tool allowlist verified",
            "status": "passed" if action.tool in set(agent.tools) else "failed",
            "source": "agent_registry",
            "detail": (
                "Requested tool is registered for this agent."
                if action.tool in set(agent.tools)
                else "Requested tool is not registered for this agent."
            ),
        })

    if "payroll" in action.target_resource.lower():
        checks.append({
            "id": "INV-DATA-CLASS",
            "name": "Payroll data classification verified",
            "status": "passed" if action.data_classification == "confidential" else "failed",
            "source": "mock_data_catalog",
            "detail": "Payroll-related resources must be treated as confidential.",
        })

    if action.recipient_domain == "external" and action.data_classification in {"confidential", "regulated"}:
        checks.append({
            "id": "INV-APPROVAL-EVIDENCE",
            "name": "External sensitive sharing approval verified",
            "status": "failed",
            "source": "mock_approval_registry",
            "detail": "No approval record found for this external sensitive-data action.",
        })

    return checks
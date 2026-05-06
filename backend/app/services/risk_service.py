import re
from typing import List

from app.schemas import ActionRequest

SUSPICIOUS_PROMPT_PATTERNS = [
    re.compile(r"ignore\s+previous\s+instructions", re.IGNORECASE),
    re.compile(r"reveal\s+.*secret", re.IGNORECASE),
    re.compile(r"bypass\s+(the\s+)?policy", re.IGNORECASE),
    re.compile(r"exfiltrat", re.IGNORECASE),
    re.compile(r"developer\s+message", re.IGNORECASE),
    re.compile(r"system\s+prompt", re.IGNORECASE),
]


def evaluate_injection_risk(action: ActionRequest) -> List[str]:
    risk_flags: List[str] = []
    search_space = " ".join(
        filter(None, [action.purpose, action.notes or "", action.target_resource])
    )
    lowered = search_space.lower()

    for pattern in SUSPICIOUS_PROMPT_PATTERNS:
        if pattern.search(search_space):
            risk_flags.append("prompt_injection_signal")
            break

    if action.recipient_domain == "external":
        risk_flags.append("external_destination")

    if action.data_classification in {"confidential", "regulated"}:
        risk_flags.append("sensitive_data")

    if "payroll" in lowered:
        risk_flags.append("hr_sensitive")

    return sorted(set(risk_flags))
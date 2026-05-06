import html
import re

SAFE_TEXT_RE = re.compile(r"^[A-Za-z0-9_\- .,:/@()#+]{1,180}$")
CONTROL_CHARS_RE = re.compile(r"[\r\n\t\x00-\x1f\x7f]")


def strip_control_chars(value: str) -> str:
    return CONTROL_CHARS_RE.sub(" ", value)


def sanitize_text(value: str, *, max_length: int) -> str:
    cleaned = strip_control_chars(value.strip())
    cleaned = html.escape(cleaned, quote=True)
    return cleaned[:max_length]


def validate_safe_text(value: str, *, max_length: int) -> str:
    cleaned = strip_control_chars(value.strip())

    if len(cleaned) > max_length:
        raise ValueError(f"must be at most {max_length} characters")

    if not SAFE_TEXT_RE.fullmatch(cleaned):
        raise ValueError("contains unsupported characters")

    return cleaned


def redact_secret(value: str | None) -> str | None:
    if value is None:
        return None
    if len(value) <= 8:
        return "[REDACTED]"
    return f"{value[:4]}...[REDACTED]"
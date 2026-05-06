import hashlib
import hmac
import time

from app.config import DEMO_USERNAME, SESSION_SIGNING_SECRET


def create_session_token(username: str) -> str:
    payload = f"{username}:{int(time.time())}"
    signature = hmac.new(
        SESSION_SIGNING_SECRET.encode("utf-8"),
        payload.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return f"{payload}:{signature}"


def is_valid_session(token: str | None) -> bool:
    if not token:
        return False

    parts = token.split(":")
    if len(parts) != 3:
        return False

    username, issued_at, signature = parts
    if username != DEMO_USERNAME or not issued_at.isdigit():
        return False

    expected = hmac.new(
        SESSION_SIGNING_SECRET.encode("utf-8"),
        f"{username}:{issued_at}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(signature, expected):
        return False

    return (time.time() - int(issued_at)) <= 8 * 60 * 60
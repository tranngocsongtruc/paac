import os
from pathlib import Path

from dotenv import load_dotenv

ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ENV_PATH)


APP_ENV = os.getenv("APP_ENV", "dev")

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://127.0.0.1:5173,http://localhost:5173",
    ).split(",")
    if origin.strip()
]

DEMO_API_TOKEN = os.getenv("DEMO_API_TOKEN", "change-me-demo-token")
DEMO_USERNAME = os.getenv("DEMO_USERNAME", "demo")
DEMO_PASSWORD = os.getenv("DEMO_PASSWORD", "change-me-password")

SESSION_COOKIE_NAME = os.getenv("SESSION_COOKIE_NAME", "agent_trust_session")
SESSION_SIGNING_SECRET = os.getenv("SESSION_SIGNING_SECRET", "change-me-signing-secret")

RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "30"))
MAX_REQUEST_BODY_BYTES = int(os.getenv("MAX_REQUEST_BODY_BYTES", "8192"))
MAX_DECISION_LOG = int(os.getenv("MAX_DECISION_LOG", "200"))
DATABASE_URL = os.getenv("DATABASE_URL", "")
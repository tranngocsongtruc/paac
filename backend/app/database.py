from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import APP_ENV, DATABASE_URL


class Base(DeclarativeBase):
    pass


def is_remote_database_url(url: str) -> bool:
    hostname = urlsplit(url).hostname or ""
    return hostname not in {"localhost", "127.0.0.1", ""}


def ensure_tls_for_remote_db(url: str) -> str:
    if not url or not is_remote_database_url(url):
        return url

    parsed = urlsplit(url)
    query = dict(parse_qsl(parsed.query))

    if query.get("sslmode") not in {"require", "verify-full"}:
        query["sslmode"] = "require"

    return urlunsplit(
        (
            parsed.scheme,
            parsed.netloc,
            parsed.path,
            parsed.query and urlencode(query) or urlencode(query),
            parsed.fragment,
        )
    )


SAFE_DATABASE_URL = ensure_tls_for_remote_db(DATABASE_URL)

if not SAFE_DATABASE_URL:
    engine = None
    SessionLocal = None
else:
    engine = create_engine(
        SAFE_DATABASE_URL,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=5,
    )

    SessionLocal = sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False,
    )


def get_db_session():
    if SessionLocal is None:
        return None
    return SessionLocal()


def init_db() -> None:
    if engine is None:
        return

    from app.models import db_models  # noqa: F401

    if APP_ENV == "prod":
        # In production, schema changes should go through Alembic migrations.
        return

    Base.metadata.create_all(bind=engine)
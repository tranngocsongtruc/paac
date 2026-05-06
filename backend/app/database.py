from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import DATABASE_URL


class Base(DeclarativeBase):
    pass


if not DATABASE_URL:
    engine = None
    SessionLocal = None
else:
    engine = create_engine(
        DATABASE_URL,
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

    # Import models here so SQLAlchemy registers tables before create_all.
    from app.models import db_models  # noqa: F401

    Base.metadata.create_all(bind=engine)
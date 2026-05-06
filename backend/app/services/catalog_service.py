from __future__ import annotations

from typing import Any, Dict, List

from app.data_seed import AGENTS, POLICIES
from app.database import get_db_session
from app.models.db_models import AgentDB, PolicyDB, UserDB


def seed_catalog_data() -> None:
    db = get_db_session()
    if db is None:
        return

    try:
        if db.query(UserDB).count() == 0:
            db.add_all(
                [
                    UserDB(user_id="u_101", role="finance_manager", org_id="demo_org"),
                    UserDB(user_id="u_102", role="finance_manager", org_id="demo_org"),
                    UserDB(user_id="u_103", role="support_manager", org_id="demo_org"),
                    UserDB(user_id="u_104", role="ops_manager", org_id="demo_org"),
                ]
            )

        if db.query(AgentDB).count() == 0:
            for agent in AGENTS:
                db.add(
                    AgentDB(
                        agent_id=agent.id,
                        name=agent.name,
                        owner_team=agent.owner_team,
                        description=agent.description,
                        tools=agent.tools,
                        risk_tier=agent.risk_tier,
                        status=agent.status,
                        last_violation=agent.last_violation,
                    )
                )

        if db.query(PolicyDB).count() == 0:
            for policy in POLICIES:
                db.add(
                    PolicyDB(
                        policy_id=policy["id"],
                        name=policy["name"],
                        description=policy["description"],
                        effect=policy["effect"],
                        conditions=policy.get("conditions"),
                        enabled=True,
                    )
                )

        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def list_agents_from_db() -> List[Dict[str, Any]]:
    db = get_db_session()
    if db is None:
        return []

    try:
        rows = db.query(AgentDB).order_by(AgentDB.agent_id.asc()).all()
        return [
            {
                "id": row.agent_id,
                "name": row.name,
                "owner_team": row.owner_team,
                "description": row.description,
                "tools": row.tools,
                "risk_tier": row.risk_tier,
                "status": row.status,
                "last_violation": row.last_violation,
            }
            for row in rows
        ]
    finally:
        db.close()


def list_policies_from_db() -> List[Dict[str, Any]]:
    db = get_db_session()
    if db is None:
        return []

    try:
        rows = db.query(PolicyDB).filter(PolicyDB.enabled == True).order_by(PolicyDB.policy_id.asc()).all()
        return [
            {
                "id": row.policy_id,
                "name": row.name,
                "description": row.description,
                "effect": row.effect,
                "conditions": row.conditions,
            }
            for row in rows
        ]
    finally:
        db.close()
from typing import Dict, Any, Tuple
from sqlalchemy.orm import Session

from .models import User, CountryState
from .openai_client import ai_client


def apply_natural_language_command(db: Session, user: User, command: str) -> Tuple[str, Dict[str, Any]]:
    country_state: CountryState | None = user.country_state
    if country_state is None:
        country_state = CountryState(user_id=user.id, state_json={})
        db.add(country_state)
        db.flush()

    assistant_message, updated_state = ai_client.generate_update(
        current_state=country_state.state_json or {},
        leader_role=user.leader_role,
        user_command=command,
    )

    country_state.state_json = updated_state
    db.add(country_state)
    db.commit()
    db.refresh(country_state)

    return assistant_message, country_state.state_json
from typing import Any, Dict, Tuple
import os

from .config import settings

try:
    from openai import OpenAI
except Exception:  # pragma: no cover - optional at runtime
    OpenAI = None  # type: ignore


class AIClient:
    def __init__(self) -> None:
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_MODEL
        self.client = None
        if self.api_key and OpenAI is not None:
            self.client = OpenAI(api_key=self.api_key)

    def generate_update(self, current_state: Dict[str, Any], leader_role: str, user_command: str) -> Tuple[str, Dict[str, Any]]:
        if not self.client:
            # Mock behavior when no API key is configured
            updated_state = dict(current_state)
            log = list(updated_state.get("log", []))
            log.append(f"[MOCK AI] Executed: {user_command}")
            updated_state["log"] = log
            # Simple deterministic mock changes
            economy = dict(updated_state.get("economy", {}))
            economy["treasury"] = round(float(economy.get("treasury", 0)) - 10.0, 2)
            updated_state["economy"] = economy
            return ("Acknowledged command (mock mode). Treasury -10.", updated_state)

        system_prompt = (
            "You are the central AI advisor for a simulated country. "
            "Given the current country state JSON and a leader's natural language command, "
            "produce a concise assistant message and an updated JSON state. Ensure changes are realistic and consistent."
        )

        user_prompt = (
            "Current state JSON:\n" +
            f"{current_state}\n\n" +
            f"Leader role: {leader_role}\n" +
            f"Command: {user_command}\n\n" +
            "Respond ONLY as JSON with keys 'assistant_message' (string) and 'updated_state' (object)."
        )

        completion = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
        )
        content = completion.choices[0].message.content or "{}"

        import json
        try:
            data = json.loads(content)
            assistant_message = data.get("assistant_message", "")
            updated_state = data.get("updated_state", current_state)
            return assistant_message, updated_state
        except Exception:
            # Fallback if parsing fails
            return ("Command processed, but response format was unexpected.", current_state)


ai_client = AIClient()
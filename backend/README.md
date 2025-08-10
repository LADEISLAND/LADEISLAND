# AGI Cosmic - Backend

## Setup

- Ensure Python 3.13+ is available
- Install dependencies:

```bash
python3 -m pip install --break-system-packages -r /workspace/backend/requirements.txt
```

- Create `.env` (optional):

```
SECRET_KEY=change_me
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
DATABASE_URL=sqlite:///./agi_cosmic.db
```

## Run

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Auth endpoints:
- POST /auth/register
- POST /auth/login -> returns bearer token

Protected endpoints require `Authorization: Bearer <token>`:
- GET /me
- GET /country/state
- POST /country/command
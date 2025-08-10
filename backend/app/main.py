from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .config import settings
from .database import Base, engine
from .deps import get_current_user, get_db
from . import models, schemas
from .auth import router as auth_router
from .simulation import apply_natural_language_command

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


app.include_router(auth_router)


@app.get("/me", response_model=schemas.UserRead)
async def read_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.get("/country/state", response_model=schemas.CountryStateRead)
async def get_country_state(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    state = current_user.country_state.state_json if current_user.country_state else {}
    updated_at = current_user.country_state.updated_at if current_user.country_state else None
    return schemas.CountryStateRead(state=state, updated_at=updated_at)


@app.post("/country/command")
async def post_country_command(
    payload: schemas.CommandRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    assistant_message, updated_state = apply_natural_language_command(db, current_user, payload.command)
    return {"assistant_message": assistant_message, "state": updated_state}
from pydantic import BaseModel, Field
from typing import Optional, Any, Dict
from datetime import datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=64)
    password: str = Field(min_length=6, max_length=128)
    leader_role: str = Field(default="president", max_length=64)


class UserRead(BaseModel):
    id: int
    username: str
    leader_role: str
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    username: str
    password: str


class CountryStateRead(BaseModel):
    state: Dict[str, Any]
    updated_at: Optional[datetime] = None


class CommandRequest(BaseModel):
    command: str = Field(min_length=1, max_length=2000)
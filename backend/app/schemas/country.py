from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from datetime import datetime

class CountryBase(BaseModel):
    name: str
    leader_title: str

class CountryCreate(CountryBase):
    pass

class CountryUpdate(BaseModel):
    name: Optional[str] = None
    leader_title: Optional[str] = None
    population: Optional[int] = None
    military_strength: Optional[int] = None
    economy_score: Optional[float] = None
    technology_level: Optional[int] = None
    resources: Optional[Dict[str, Any]] = None
    alliances: Optional[List[str]] = None
    military_system: Optional[Dict[str, Any]] = None
    trade_system: Optional[Dict[str, Any]] = None
    citizen_system: Optional[Dict[str, Any]] = None
    government_system: Optional[Dict[str, Any]] = None
    history: Optional[List[Dict[str, Any]]] = None
    current_events: Optional[List[Dict[str, Any]]] = None

class Country(CountryBase):
    id: int
    user_id: int
    population: int
    military_strength: int
    economy_score: float
    technology_level: int
    resources: Dict[str, Any]
    alliances: List[str]
    military_system: Dict[str, Any]
    trade_system: Dict[str, Any]
    citizen_system: Dict[str, Any]
    government_system: Dict[str, Any]
    history: List[Dict[str, Any]]
    current_events: List[Dict[str, Any]]
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CommandRequest(BaseModel):
    command: str

class CommandResponse(BaseModel):
    response: str
    country_state: Country
    events: List[Dict[str, Any]] = []
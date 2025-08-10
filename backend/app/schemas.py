from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List, Any
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Country Schemas
class CountryBase(BaseModel):
    name: str
    leader_title: str = "President"

class CountryCreate(CountryBase):
    pass

class CountryUpdate(BaseModel):
    name: Optional[str] = None
    leader_title: Optional[str] = None
    population: Optional[int] = None
    gdp: Optional[float] = None
    territory_size: Optional[float] = None
    happiness_index: Optional[float] = None
    natural_resources: Optional[Dict[str, Any]] = None
    military_strength: Optional[float] = None
    military_budget: Optional[float] = None
    unemployment_rate: Optional[float] = None
    inflation_rate: Optional[float] = None
    trade_balance: Optional[float] = None
    tech_level: Optional[float] = None
    education_index: Optional[float] = None
    research_budget: Optional[float] = None
    infrastructure_quality: Optional[float] = None
    healthcare_quality: Optional[float] = None
    diplomatic_relations: Optional[Dict[str, Any]] = None
    government_type: Optional[str] = None
    stability: Optional[float] = None
    corruption_index: Optional[float] = None

class CountryResponse(CountryBase):
    id: int
    population: int
    gdp: float
    territory_size: float
    happiness_index: float
    natural_resources: Dict[str, Any]
    military_strength: float
    military_budget: float
    unemployment_rate: float
    inflation_rate: float
    trade_balance: float
    tech_level: float
    education_index: float
    research_budget: float
    infrastructure_quality: float
    healthcare_quality: float
    diplomatic_relations: Dict[str, Any]
    government_type: str
    stability: float
    corruption_index: float
    historical_events: List[Dict[str, Any]]
    recent_decisions: List[Dict[str, Any]]
    created_at: datetime
    last_updated: datetime

    class Config:
        from_attributes = True

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

# AI Command Schemas
class AICommand(BaseModel):
    command: str
    context: Optional[str] = None

class AIResponse(BaseModel):
    response: str
    country_updates: Optional[Dict[str, Any]] = None
    success: bool = True
    error: Optional[str] = None
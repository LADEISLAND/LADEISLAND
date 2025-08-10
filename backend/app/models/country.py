from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.database.database import Base
from datetime import datetime

class Country(Base):
    __tablename__ = "countries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    leader_title = Column(String, default="President")  # President, Scientist, King, etc.
    leader_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Basic Country Stats
    population = Column(Integer, default=1000000)
    gdp = Column(Float, default=100000000.0)  # In billions
    territory_size = Column(Float, default=100000.0)  # In square kilometers
    happiness_index = Column(Float, default=7.0)  # 1-10 scale
    
    # Resources
    natural_resources = Column(JSON, default=lambda: {
        "oil": 50, "minerals": 30, "water": 80, "forests": 40, "farmland": 60
    })
    
    # Military
    military_strength = Column(Float, default=50.0)  # 1-100 scale
    military_budget = Column(Float, default=1000000.0)
    
    # Economy
    unemployment_rate = Column(Float, default=5.0)  # Percentage
    inflation_rate = Column(Float, default=2.0)  # Percentage
    trade_balance = Column(Float, default=0.0)  # Positive = surplus
    
    # Technology & Education
    tech_level = Column(Float, default=50.0)  # 1-100 scale
    education_index = Column(Float, default=70.0)  # 1-100 scale
    research_budget = Column(Float, default=500000.0)
    
    # Infrastructure
    infrastructure_quality = Column(Float, default=60.0)  # 1-100 scale
    healthcare_quality = Column(Float, default=70.0)  # 1-100 scale
    
    # Diplomacy
    diplomatic_relations = Column(JSON, default=dict)  # {country_id: relationship_score}
    
    # Government
    government_type = Column(String, default="Democracy")
    stability = Column(Float, default=80.0)  # 1-100 scale
    corruption_index = Column(Float, default=30.0)  # 1-100 scale (lower is better)
    
    # History and Events
    historical_events = Column(JSON, default=list)  # List of major events
    recent_decisions = Column(JSON, default=list)  # Recent leader decisions
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    leader = relationship("User", back_populates="country")
    
    def to_dict(self):
        """Convert country to dictionary for API responses"""
        return {
            "id": self.id,
            "name": self.name,
            "leader_title": self.leader_title,
            "population": self.population,
            "gdp": self.gdp,
            "territory_size": self.territory_size,
            "happiness_index": self.happiness_index,
            "natural_resources": self.natural_resources,
            "military_strength": self.military_strength,
            "military_budget": self.military_budget,
            "unemployment_rate": self.unemployment_rate,
            "inflation_rate": self.inflation_rate,
            "trade_balance": self.trade_balance,
            "tech_level": self.tech_level,
            "education_index": self.education_index,
            "research_budget": self.research_budget,
            "infrastructure_quality": self.infrastructure_quality,
            "healthcare_quality": self.healthcare_quality,
            "diplomatic_relations": self.diplomatic_relations,
            "government_type": self.government_type,
            "stability": self.stability,
            "corruption_index": self.corruption_index,
            "historical_events": self.historical_events,
            "recent_decisions": self.recent_decisions,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "last_updated": self.last_updated.isoformat() if self.last_updated else None
        }
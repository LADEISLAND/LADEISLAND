export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface Country {
  id: number;
  name: string;
  leader_title: string;
  population: number;
  gdp: number;
  territory_size: number;
  happiness_index: number;
  natural_resources: Record<string, any>;
  military_strength: number;
  military_budget: number;
  unemployment_rate: number;
  inflation_rate: number;
  trade_balance: number;
  tech_level: number;
  education_index: number;
  research_budget: number;
  infrastructure_quality: number;
  healthcare_quality: number;
  diplomatic_relations: Record<string, any>;
  government_type: string;
  stability: number;
  corruption_index: number;
  historical_events: Array<Record<string, any>>;
  recent_decisions: Array<Record<string, any>>;
  created_at: string;
  last_updated: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface AIResponse {
  response: string;
  country_updates?: Record<string, any>;
  success: boolean;
  error?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}
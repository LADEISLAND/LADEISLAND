export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

export interface Country {
  id: number;
  user_id: number;
  name: string;
  leader_title: string;
  population: number;
  military_strength: number;
  economy_score: number;
  technology_level: number;
  resources: Record<string, any>;
  alliances: string[];
  military_system: Record<string, any>;
  trade_system: Record<string, any>;
  citizen_system: Record<string, any>;
  government_system: Record<string, any>;
  history: any[];
  current_events: any[];
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface CommandRequest {
  command: string;
}

export interface CommandResponse {
  response: string;
  country_state: Country;
  events: any[];
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export interface CountryCreateForm {
  name?: string;
  leader_title: string;
}
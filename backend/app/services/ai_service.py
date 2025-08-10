import openai
import json
from typing import Dict, List, Any, Tuple
from ..models.country import Country
from ..schemas.country import CountryUpdate

from ..config import settings

# Initialize OpenAI client
client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

class AIService:
    def __init__(self):
        self.system_prompt = """You are an AI assistant for AGI Cosmic, a virtual country management simulation. 
        You help users manage their virtual countries by interpreting natural language commands and updating the country state.
        
        The country has the following systems:
        - Military: army size, weapons, defense systems
        - Economy: GDP, trade, resources, infrastructure
        - Citizens: population, happiness, education, health
        - Government: policies, laws, international relations
        - Technology: research, development, innovation
        
        When a user gives a command, you should:
        1. Understand the intent of the command
        2. Determine which systems need to be updated
        3. Calculate the effects on the country
        4. Return a JSON response with the updated country state
        5. Provide a natural language response explaining what happened
        
        Always maintain game balance and make realistic changes based on the command."""
    
    def process_command(self, command: str, country: Country) -> Tuple[str, CountryUpdate, List[Dict[str, Any]]]:
        """Process a natural language command and return the AI response and country updates."""
        
        # Create context about the current country state
        country_context = f"""
        Current Country State:
        - Name: {country.name}
        - Leader: {country.leader_title}
        - Population: {country.population}
        - Military Strength: {country.military_strength}
        - Economy Score: {country.economy_score}
        - Technology Level: {country.technology_level}
        - Resources: {country.resources}
        - Alliances: {country.alliances}
        """
        
        # Create the prompt for the AI
        prompt = f"""
        {self.system_prompt}
        
        {country_context}
        
        User Command: "{command}"
        
        Please respond with a JSON object containing:
        1. "response": A natural language explanation of what happened
        2. "updates": An object with the fields to update in the country
        3. "events": A list of events that occurred (optional)
        
        Example response format:
        {{
            "response": "You successfully increased military spending, which improved your army's capabilities.",
            "updates": {{
                "military_strength": 120,
                "economy_score": 48.0
            }},
            "events": [
                {{
                    "type": "military_upgrade",
                    "description": "Military strength increased by 20 points",
                    "timestamp": "2024-01-01T12:00:00Z"
                }}
            ]
        }}
        """
        
        try:
            # Call OpenAI API
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            # Parse the response
            ai_response = response.choices[0].message.content
            
            # Try to extract JSON from the response
            try:
                # Find JSON in the response
                start_idx = ai_response.find('{')
                end_idx = ai_response.rfind('}') + 1
                json_str = ai_response[start_idx:end_idx]
                parsed_response = json.loads(json_str)
                
                response_text = parsed_response.get("response", ai_response)
                updates = parsed_response.get("updates", {})
                events = parsed_response.get("events", [])
                
                # Convert updates to CountryUpdate object
                country_updates = CountryUpdate(**updates)
                
                return response_text, country_updates, events
                
            except (json.JSONDecodeError, KeyError):
                # Fallback if JSON parsing fails
                return ai_response, CountryUpdate(), []
                
        except Exception as e:
            # Fallback response if API call fails
            return f"I encountered an error processing your command: {str(e)}. Please try again.", CountryUpdate(), []
    
    def generate_country_name(self, leader_title: str) -> str:
        """Generate a creative country name based on the leader title."""
        prompt = f"Generate a creative and unique name for a virtual country led by a {leader_title}. Return only the country name, nothing else."
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=50
            )
            
            return response.choices[0].message.content.strip()
        except:
            return f"New {leader_title.title()}dom"
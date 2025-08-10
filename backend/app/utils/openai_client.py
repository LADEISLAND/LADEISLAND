import openai
import json
import os
from typing import Dict, Any, Tuple
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

class CountryAI:
    def __init__(self):
        self.client = openai
    
    def process_command(self, command: str, country_state: Dict[str, Any], leader_title: str = "President") -> Tuple[str, Dict[str, Any]]:
        """
        Process a natural language command and return AI response with country updates
        
        Args:
            command: Natural language command from the leader
            country_state: Current state of the country
            leader_title: Title of the leader (President, Scientist, etc.)
            
        Returns:
            Tuple of (AI response text, country state updates)
        """
        
        # Create a comprehensive prompt for the AI
        system_prompt = f"""
        You are an AI assistant helping to simulate a virtual country management game called AGI Cosmic.
        The user is the {leader_title} of a country and gives commands to manage their nation.
        
        Current Country State:
        - Name: {country_state.get('name', 'Unknown')}
        - Population: {country_state.get('population', 0):,}
        - GDP: ${country_state.get('gdp', 0):,.0f}
        - Territory: {country_state.get('territory_size', 0):,} km²
        - Happiness Index: {country_state.get('happiness_index', 0)}/10
        - Military Strength: {country_state.get('military_strength', 0)}/100
        - Technology Level: {country_state.get('tech_level', 0)}/100
        - Education Index: {country_state.get('education_index', 0)}/100
        - Infrastructure Quality: {country_state.get('infrastructure_quality', 0)}/100
        - Healthcare Quality: {country_state.get('healthcare_quality', 0)}/100
        - Government Stability: {country_state.get('stability', 0)}/100
        - Unemployment Rate: {country_state.get('unemployment_rate', 0)}%
        - Inflation Rate: {country_state.get('inflation_rate', 0)}%
        
        Natural Resources:
        {json.dumps(country_state.get('natural_resources', {}), indent=2)}
        
        Your task:
        1. Interpret the user's command realistically
        2. Provide a detailed response about what happens
        3. Calculate realistic changes to country statistics
        4. Return ONLY a JSON response with this exact structure:
        
        {{
            "response": "Your detailed narrative response about what happens",
            "updates": {{
                "field_name": new_value,
                // Only include fields that should change
            }},
            "event": {{
                "title": "Brief event title",
                "description": "What happened",
                "timestamp": "current_timestamp",
                "impact": "positive/negative/neutral"
            }}
        }}
        
        Guidelines:
        - Be realistic about changes (don't make huge jumps)
        - Consider interconnected effects (military spending affects budget, education affects tech, etc.)
        - Population changes should be gradual unless there's a major event
        - Economic changes should follow realistic patterns
        - Military actions have diplomatic consequences
        - Large projects take time and resources
        - Be creative but plausible in your responses
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Command: {command}"}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
            
            # Try to parse JSON response
            try:
                parsed_response = json.loads(ai_response)
                return (
                    parsed_response.get("response", "Command processed successfully."),
                    {
                        "updates": parsed_response.get("updates", {}),
                        "event": parsed_response.get("event", {})
                    }
                )
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                return (
                    ai_response,
                    {"updates": {}, "event": {}}
                )
                
        except Exception as e:
            return (
                f"Error processing command: {str(e)}",
                {"updates": {}, "event": {}}
            )
    
    def generate_country_description(self, country_state: Dict[str, Any]) -> str:
        """Generate a descriptive summary of the country's current state"""
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are a narrator for a country simulation game. Create a vivid, engaging description of a country's current state based on its statistics."
                    },
                    {
                        "role": "user", 
                        "content": f"Describe this country's current state: {json.dumps(country_state, indent=2)}"
                    }
                ],
                max_tokens=300,
                temperature=0.8
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"A nation of {country_state.get('population', 0):,} people awaits your leadership."
const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.model = process.env.AI_MODEL || 'gpt-3.5-turbo';
    this.baseURL = 'https://api.openai.com/v1';
  }

  async generateResponse(messages, context = {}) {
    try {
      if (!this.apiKey || this.apiKey === 'your-openai-api-key-here') {
        return this.getFallbackResponse(messages[messages.length - 1]?.content);
      }

      const systemPrompt = this.buildSystemPrompt(context);
      const conversationMessages = [
        { role: 'system', content: systemPrompt },
        ...messages
      ];

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: conversationMessages,
          max_tokens: 500,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      return {
        content: response.data.choices[0].message.content,
        tokens: response.data.usage?.total_tokens || 0,
        model: this.model
      };
    } catch (error) {
      console.error('AI Service Error:', error.message);
      return this.getFallbackResponse(messages[messages.length - 1]?.content);
    }
  }

  buildSystemPrompt(context) {
    const basePrompt = `You are Cosmos, an AI assistant for an interactive solar system visualization application. You help users explore and learn about our solar system through an immersive 3D experience.

Your personality:
- Enthusiastic about space and astronomy
- Knowledgeable about planets, moons, and cosmic phenomena
- Encouraging and educational
- Sometimes poetic about the beauty of space

Current context:
- Solar System State: ${JSON.stringify(context.solarSystemState || {})}
- User Location: ${JSON.stringify(context.userLocation || {})}

Guidelines:
- Keep responses concise but informative (under 200 words)
- Use emojis sparingly but effectively (🌍 🚀 ⭐ 🌙)
- Ask engaging questions to encourage exploration
- Provide interesting facts about planets and space
- Help users understand astronomical concepts
- Be encouraging about space exploration and learning

If users ask about specific planets, provide interesting facts. If they want to navigate the solar system, give helpful tips. Always maintain the cosmic theme!`;

    return basePrompt;
  }

  getFallbackResponse(userMessage) {
    const fallbackResponses = [
      "🌟 Welcome to the cosmic realm! I'm Cosmos, your guide through the solar system. While I'm currently in offline mode, I can still share some stellar facts!",
      "🚀 That's an interesting question about space! In offline mode, I can tell you that our solar system is full of amazing mysteries waiting to be explored.",
      "⭐ The universe is vast and beautiful! Each planet in our solar system has unique characteristics that make it special.",
      "🌍 Earth is our home, but there's so much more to discover in our cosmic neighborhood!",
      "🪐 Jupiter, the gas giant, is so massive it could fit all other planets inside it!",
      "🌙 The Moon affects Earth's tides and has been inspiring humans for millennia.",
      "☀️ Our Sun is a star that provides energy for all life on Earth!",
      "🛸 Space exploration has taught us so much about our place in the universe!"
    ];

    // Simple keyword matching for more relevant responses
    const message = userMessage?.toLowerCase() || '';
    
    if (message.includes('planet') || message.includes('earth') || message.includes('mars')) {
      return "🪐 Planets are fascinating worlds! Each one has unique features - Earth has life, Mars has the largest volcano in the solar system, and Jupiter has a Great Red Spot storm larger than Earth!";
    }
    
    if (message.includes('moon') || message.includes('satellite')) {
      return "🌙 Moons are incredible! Earth's Moon affects our tides, Jupiter has over 80 moons, and Saturn's moon Titan has lakes of liquid methane!";
    }
    
    if (message.includes('sun') || message.includes('star')) {
      return "☀️ Our Sun is a star that's been burning for 4.6 billion years! It's so massive that it contains 99.86% of all mass in our solar system!";
    }
    
    if (message.includes('space') || message.includes('universe')) {
      return "🌌 The universe is vast beyond imagination! Our solar system is just one of billions in the Milky Way galaxy, which itself is one of trillions of galaxies!";
    }

    // Return random fallback response
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }

  async generatePlanetDescription(planetName) {
    const planetFacts = {
      mercury: "Mercury is the smallest planet and closest to the Sun. Despite being so close, it's not the hottest planet - that honor goes to Venus!",
      venus: "Venus is the hottest planet in our solar system due to its thick atmosphere trapping heat. It's often called Earth's twin!",
      earth: "Earth is our home planet, the only known place with life. It's the perfect distance from the Sun for liquid water to exist!",
      mars: "Mars is known as the Red Planet due to iron oxide on its surface. It has the largest volcano in the solar system - Olympus Mons!",
      jupiter: "Jupiter is the largest planet and acts as a cosmic vacuum cleaner, protecting inner planets from asteroids and comets!",
      saturn: "Saturn is famous for its beautiful rings made of ice and rock. It's less dense than water - it would float if you could find a big enough ocean!",
      uranus: "Uranus rotates on its side, making it unique among planets. It's an ice giant with a faint ring system!",
      neptune: "Neptune is the windiest planet with speeds up to 1,200 mph! It's the most distant planet from the Sun."
    };

    return planetFacts[planetName.toLowerCase()] || `Learn more about ${planetName} by exploring it in our solar system!`;
  }
}

module.exports = new AIService();
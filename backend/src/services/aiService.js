const axios = require('axios');
const logger = require('../config/logger');

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'huggingface';
    this.initializeProvider();
  }

  initializeProvider() {
    switch (this.provider) {
      case 'huggingface':
        this.apiKey = process.env.HUGGINGFACE_API_KEY;
        this.baseURL = 'https://api-inference.huggingface.co/models';
        this.model = process.env.HUGGINGFACE_MODEL || 'microsoft/DialoGPT-large';
        break;
      case 'anthropic':
        this.apiKey = process.env.ANTHROPIC_API_KEY;
        this.baseURL = 'https://api.anthropic.com/v1';
        this.model = process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307';
        break;
      case 'google':
        this.apiKey = process.env.GOOGLE_AI_KEY;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
        this.model = process.env.GOOGLE_MODEL || 'gemini-pro';
        break;
      case 'cohere':
        this.apiKey = process.env.COHERE_API_KEY;
        this.baseURL = 'https://api.cohere.ai/v1';
        this.model = process.env.COHERE_MODEL || 'command';
        break;
      case 'local':
        this.baseURL = process.env.LOCAL_AI_URL || 'http://localhost:11434';
        this.model = process.env.LOCAL_MODEL || 'llama2';
        break;
      case 'openai':
        this.apiKey = process.env.OPENAI_API_KEY;
        this.baseURL = 'https://api.openai.com/v1';
        this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
        break;
      default:
        logger.warn(`Unknown AI provider: ${this.provider}, falling back to local responses`);
        this.provider = 'fallback';
    }
  }

  async generateResponse(messages, context = 'cosmic') {
    try {
      switch (this.provider) {
        case 'huggingface':
          return await this.huggingFaceRequest(messages, context);
        case 'anthropic':
          return await this.anthropicRequest(messages, context);
        case 'google':
          return await this.googleAIRequest(messages, context);
        case 'cohere':
          return await this.cohereRequest(messages, context);
        case 'local':
          return await this.localAIRequest(messages, context);
        case 'openai':
          return await this.openAIRequest(messages, context);
        default:
          return this.generateFallbackResponse(messages[messages.length - 1]?.content || '', context);
      }
    } catch (error) {
      logger.error(`AI Service Error (${this.provider}):`, error);
      return this.generateFallbackResponse(messages[messages.length - 1]?.content || '', context);
    }
  }

  async huggingFaceRequest(messages, context) {
    if (!this.apiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    const systemPrompt = this.getSystemPrompt(context);
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    // Hugging Face format for conversational models
    const response = await axios.post(
      `${this.baseURL}/${this.model}`,
      {
        inputs: {
          past_user_inputs: messages.filter(m => m.role === 'user').map(m => m.content),
          generated_responses: messages.filter(m => m.role === 'assistant').map(m => m.content),
          text: `${systemPrompt}\n\nUser: ${lastMessage}`
        },
        parameters: {
          temperature: 0.7,
          max_length: 1000,
          repetition_penalty: 1.1,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.generated_text || response.data[0]?.generated_text || 'I apologize, but I encountered an issue generating a response.';
  }

  async anthropicRequest(messages, context) {
    if (!this.apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const systemPrompt = this.getSystemPrompt(context);
    
    const response = await axios.post(
      `${this.baseURL}/messages`,
      {
        model: this.model,
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        }))
      },
      {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      }
    );

    return response.data.content[0]?.text || 'I apologize, but I encountered an issue generating a response.';
  }

  async googleAIRequest(messages, context) {
    if (!this.apiKey) {
      throw new Error('Google AI API key not configured');
    }

    const systemPrompt = this.getSystemPrompt(context);
    const conversation = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    
    const response = await axios.post(
      `${this.baseURL}/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nConversation:\n${conversation}\n\nPlease respond as the assistant:`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          topP: 0.8,
          topK: 10
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.candidates[0]?.content?.parts[0]?.text || 'I apologize, but I encountered an issue generating a response.';
  }

  async cohereRequest(messages, context) {
    if (!this.apiKey) {
      throw new Error('Cohere API key not configured');
    }

    const systemPrompt = this.getSystemPrompt(context);
    const conversation = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    
    const response = await axios.post(
      `${this.baseURL}/generate`,
      {
        model: this.model,
        prompt: `${systemPrompt}\n\nConversation:\n${conversation}\n\nAssistant:`,
        max_tokens: 1000,
        temperature: 0.7,
        k: 0,
        stop_sequences: ['User:', 'Human:'],
        return_likelihoods: 'NONE'
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.generations[0]?.text?.trim() || 'I apologize, but I encountered an issue generating a response.';
  }

  async localAIRequest(messages, context) {
    const systemPrompt = this.getSystemPrompt(context);
    const conversation = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    
    // Ollama API format
    const response = await axios.post(
      `${this.baseURL}/api/generate`,
      {
        model: this.model,
        prompt: `${systemPrompt}\n\nConversation:\n${conversation}\n\nAssistant:`,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 1000
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return response.data.response || 'I apologize, but I encountered an issue generating a response.';
  }

  async openAIRequest(messages, context) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = this.getSystemPrompt(context);
    
    const response = await axios.post(
      `${this.baseURL}/chat/completions`,
      {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0]?.message?.content || 'I apologize, but I encountered an issue generating a response.';
  }

  getSystemPrompt(context) {
    const prompts = {
      cosmic: 'You are an AI assistant for the AGI Cosmic platform, specializing in aerospace technology, space exploration, and cosmic phenomena. Provide helpful, accurate, and engaging responses about space, astronomy, rockets, satellites, and space missions. Keep responses concise but informative.',
      aerospace: 'You are an aerospace engineering expert. Provide technical guidance on aircraft design, propulsion systems, aerodynamics, space technology, and aviation. Focus on practical engineering solutions and current industry practices.',
      ai: 'You are an AI and machine learning expert. Help with AI concepts, implementation, algorithms, and best practices in artificial intelligence, machine learning, and data science.',
      technical: 'You are a technical expert in engineering and technology. Provide detailed technical explanations and solutions for engineering problems across various disciplines.',
      general: 'You are a helpful AI assistant. Provide accurate, helpful, and friendly responses to user questions across a wide range of topics.'
    };

    return prompts[context] || prompts.cosmic;
  }

  generateFallbackResponse(message, context) {
    const responses = {
      cosmic: [
        "The universe is vast and full of mysteries! While I'm currently operating in offline mode, I can tell you that space exploration continues to reveal amazing discoveries about our cosmos.",
        "That's a fascinating question about space! Even without live AI processing, I can share that the field of aerospace technology is constantly advancing with new innovations.",
        "Space and cosmic phenomena are incredibly complex topics. The study of our universe involves everything from quantum mechanics to massive galactic structures!",
        "Your curiosity about the cosmos is wonderful! Aerospace engineering and space exploration combine cutting-edge technology with our desire to understand the universe.",
        "The intersection of artificial intelligence and space exploration is particularly exciting, as AI helps us process vast amounts of astronomical data."
      ],
      aerospace: [
        "Aerospace engineering involves incredible complexity in design and manufacturing. Modern aircraft and spacecraft require advanced materials and precision engineering.",
        "The principles of flight and space travel involve fundamental physics concepts like aerodynamics, propulsion, and orbital mechanics.",
        "Current aerospace technology continues to push boundaries with innovations in electric propulsion, composite materials, and autonomous systems.",
        "From commercial aviation to space exploration, aerospace engineers solve some of the most challenging technical problems in engineering."
      ],
      ai: [
        "Artificial intelligence encompasses many fascinating areas including machine learning, neural networks, and computer vision.",
        "AI systems are becoming increasingly sophisticated, with applications ranging from natural language processing to robotics.",
        "The development of AI involves understanding both the theoretical foundations and practical implementation challenges.",
        "Modern AI research focuses on creating systems that can learn, adapt, and make intelligent decisions."
      ],
      technical: [
        "Engineering solutions often require balancing multiple constraints including performance, cost, safety, and reliability.",
        "Technical problem-solving involves systematic analysis, creative thinking, and rigorous testing of proposed solutions.",
        "Modern engineering increasingly relies on simulation, modeling, and data-driven approaches to optimize designs."
      ],
      general: [
        "That's an interesting question! I'm currently operating with limited connectivity but I'm here to help as best I can.",
        "Thank you for your question. While I may not have access to real-time information, I'll do my best to provide helpful insights.",
        "I appreciate your curiosity! Even in offline mode, I can share knowledge on a wide range of topics."
      ]
    };

    const contextResponses = responses[context] || responses.general;
    return contextResponses[Math.floor(Math.random() * contextResponses.length)];
  }

  // Health check for AI service
  async healthCheck() {
    try {
      const testMessages = [{ role: 'user', content: 'Hello' }];
      await this.generateResponse(testMessages, 'general');
      return { status: 'healthy', provider: this.provider };
    } catch (error) {
      logger.error('AI Service health check failed:', error);
      return { status: 'unhealthy', provider: this.provider, error: error.message };
    }
  }

  // Get available providers
  static getAvailableProviders() {
    return [
      {
        name: 'huggingface',
        displayName: 'Hugging Face',
        description: 'Open-source AI models via Hugging Face Inference API',
        requiresKey: true,
        website: 'https://huggingface.co/inference-api'
      },
      {
        name: 'anthropic',
        displayName: 'Anthropic Claude',
        description: 'Claude AI models by Anthropic',
        requiresKey: true,
        website: 'https://console.anthropic.com/'
      },
      {
        name: 'google',
        displayName: 'Google AI (Gemini)',
        description: 'Google\'s Gemini AI models',
        requiresKey: true,
        website: 'https://makersuite.google.com/app/apikey'
      },
      {
        name: 'cohere',
        displayName: 'Cohere',
        description: 'Cohere\'s command models for text generation',
        requiresKey: true,
        website: 'https://dashboard.cohere.com/api-keys'
      },
      {
        name: 'local',
        displayName: 'Local AI (Ollama)',
        description: 'Self-hosted local AI models using Ollama',
        requiresKey: false,
        website: 'https://ollama.ai/'
      },
      {
        name: 'openai',
        displayName: 'OpenAI',
        description: 'OpenAI GPT models (ChatGPT API)',
        requiresKey: true,
        website: 'https://platform.openai.com/api-keys'
      }
    ];
  }
}

module.exports = new AIService();
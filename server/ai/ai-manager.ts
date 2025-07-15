import { OpenAIProvider } from './openai-provider';
import { AnthropicProvider } from './anthropic-provider';
import { XAIProvider } from './xai-provider';
import { DeepSeekProvider } from './deepseek-provider';
import { BaseAIProvider } from './base-provider';
import { AIProvider, AIMessage, AIResponse, VoiceMessage, ChatSession } from '../../shared/ai-providers';

export class AIManager {
  private providers: Map<AIProvider, BaseAIProvider> = new Map();
  private defaultProvider: AIProvider = 'openai';
  private isInitialized = false;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize providers based on available API keys
    if (process.env.OPENAI_API_KEY) {
      this.providers.set('openai', new OpenAIProvider(process.env.OPENAI_API_KEY));
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.set('anthropic', new AnthropicProvider(process.env.ANTHROPIC_API_KEY));
    }

    if (process.env.XAI_API_KEY) {
      this.providers.set('xai', new XAIProvider(process.env.XAI_API_KEY));
    }

    if (process.env.DEEPSEEK_API_KEY) {
      this.providers.set('deepseek', new DeepSeekProvider(process.env.DEEPSEEK_API_KEY));
    }

    // Set default provider to first available
    const availableProviders = Array.from(this.providers.keys());
    if (availableProviders.length > 0) {
      this.defaultProvider = availableProviders[0];
    }

    this.isInitialized = true;
    console.log(`AI Manager initialized with providers: ${availableProviders.join(', ')}`);
  }

  // Get provider instance
  private getProvider(provider: AIProvider): BaseAIProvider {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not available. Check API key configuration.`);
    }
    return providerInstance;
  }

  // Chat with any provider
  async chat(messages: AIMessage[], provider: AIProvider = this.defaultProvider, model?: string): Promise<AIResponse> {
    const providerInstance = this.getProvider(provider);
    return await providerInstance.chat(messages, model);
  }

  // Stream chat with any provider
  async *streamChat(messages: AIMessage[], provider: AIProvider = this.defaultProvider, model?: string): AsyncGenerator<string, void, unknown> {
    const providerInstance = this.getProvider(provider);
    yield* providerInstance.streamChat(messages, model);
  }

  // Multi-provider chat comparison
  async compareProviders(messages: AIMessage[], providers: AIProvider[] = Array.from(this.providers.keys())): Promise<{
    responses: Array<{
      provider: AIProvider;
      response: AIResponse;
      error?: string;
    }>;
    fastest: AIProvider;
    consensus?: string;
  }> {
    const startTime = Date.now();
    const results = await Promise.allSettled(
      providers.map(async (provider) => {
        const providerInstance = this.getProvider(provider);
        const response = await providerInstance.chat(messages);
        return { provider, response };
      })
    );

    const responses = results.map((result, index) => {
      const provider = providers[index];
      if (result.status === 'fulfilled') {
        return {
          provider,
          response: result.value.response
        };
      } else {
        return {
          provider,
          response: {
            content: '',
            provider,
            model: 'unknown',
            timestamp: new Date()
          } as AIResponse,
          error: result.reason?.message || 'Unknown error'
        };
      }
    });

    // Find fastest response
    const fastest = responses.find(r => !r.error)?.provider || providers[0];

    // Simple consensus detection (if responses are similar)
    const validResponses = responses.filter(r => !r.error && r.response.content.length > 0);
    const consensus = validResponses.length > 1 ? 
      this.findConsensus(validResponses.map(r => r.response.content)) : 
      undefined;

    return {
      responses,
      fastest,
      consensus
    };
  }

  // Image analysis
  async analyzeImage(imageData: string, prompt: string, provider: AIProvider = 'openai', model?: string): Promise<AIResponse> {
    const providerInstance = this.getProvider(provider);
    return await providerInstance.analyzeImage(imageData, prompt, model);
  }

  // Voice transcription
  async transcribeAudio(audioData: ArrayBuffer, provider: AIProvider = 'openai', format: string = 'wav'): Promise<VoiceMessage> {
    const providerInstance = this.getProvider(provider);
    return await providerInstance.transcribeAudio(audioData, format);
  }

  // Text-to-speech
  async generateSpeech(text: string, provider: AIProvider = 'openai', voice?: string): Promise<ArrayBuffer> {
    const providerInstance = this.getProvider(provider);
    return await providerInstance.generateSpeech(text, voice);
  }

  // Provider health checks
  async checkProviderHealth(): Promise<Record<AIProvider, boolean>> {
    const healthResults: Record<AIProvider, boolean> = {} as any;
    
    const checks = Array.from(this.providers.entries()).map(async ([provider, instance]) => {
      try {
        const isHealthy = await instance.healthCheck();
        healthResults[provider] = isHealthy;
      } catch (error) {
        console.error(`Health check failed for ${provider}:`, error);
        healthResults[provider] = false;
      }
    });

    await Promise.all(checks);
    return healthResults;
  }

  // Get available providers
  getAvailableProviders(): AIProvider[] {
    return Array.from(this.providers.keys());
  }

  // Get provider capabilities
  getProviderCapabilities(provider: AIProvider): string[] {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) return [];

    const capabilities = ['chat'];
    
    try {
      // Test if provider supports image analysis
      if (provider === 'openai' || provider === 'anthropic' || provider === 'xai') {
        capabilities.push('image');
      }
      
      // Test if provider supports voice
      if (provider === 'openai') {
        capabilities.push('voice', 'transcription', 'tts');
      }
      
      // Test if provider supports specific features
      if (provider === 'deepseek') {
        capabilities.push('reasoning', 'math', 'code-review');
      }
      
      if (provider === 'xai') {
        capabilities.push('realtime', 'code-generation', 'witty');
      }
      
      if (provider === 'anthropic') {
        capabilities.push('sentiment', 'summarization');
      }
      
    } catch (error) {
      console.error(`Error checking capabilities for ${provider}:`, error);
    }

    return capabilities;
  }

  // Advanced AI workflows
  async enhancedWorkflow(prompt: string, workflow: 'research' | 'creative' | 'analytical' | 'technical'): Promise<{
    primary: AIResponse;
    secondary?: AIResponse;
    synthesis: AIResponse;
  }> {
    const workflowConfigs = {
      research: {
        primary: 'xai' as AIProvider,
        secondary: 'deepseek' as AIProvider,
        synthesizer: 'anthropic' as AIProvider
      },
      creative: {
        primary: 'xai' as AIProvider,
        secondary: 'openai' as AIProvider,
        synthesizer: 'anthropic' as AIProvider
      },
      analytical: {
        primary: 'anthropic' as AIProvider,
        secondary: 'deepseek' as AIProvider,
        synthesizer: 'openai' as AIProvider
      },
      technical: {
        primary: 'deepseek' as AIProvider,
        secondary: 'openai' as AIProvider,
        synthesizer: 'anthropic' as AIProvider
      }
    };

    const config = workflowConfigs[workflow];
    const messages: AIMessage[] = [{ role: 'user', content: prompt }];

    // Get primary response
    const primary = await this.chat(messages, config.primary);

    // Get secondary perspective if available
    let secondary: AIResponse | undefined;
    if (this.providers.has(config.secondary)) {
      try {
        secondary = await this.chat(messages, config.secondary);
      } catch (error) {
        console.error(`Secondary provider ${config.secondary} failed:`, error);
      }
    }

    // Synthesize responses
    const synthesisPrompt = secondary ? 
      `Synthesize these two AI responses to the prompt "${prompt}":\n\nResponse 1: ${primary.content}\n\nResponse 2: ${secondary.content}\n\nProvide a comprehensive synthesis that combines the best insights from both responses.` :
      `Enhance and expand on this AI response to the prompt "${prompt}":\n\n${primary.content}\n\nProvide additional insights and improvements.`;

    const synthesis = await this.chat([{ role: 'user', content: synthesisPrompt }], config.synthesizer);

    return {
      primary,
      secondary,
      synthesis
    };
  }

  // Find consensus among multiple responses
  private findConsensus(responses: string[]): string | undefined {
    if (responses.length < 2) return undefined;

    // Simple word overlap analysis
    const words = responses.map(r => r.toLowerCase().split(/\s+/));
    const commonWords = words[0].filter(word => 
      words.every(wordList => wordList.includes(word)) && 
      word.length > 3
    );

    if (commonWords.length > 5) {
      return `Consensus detected: ${commonWords.slice(0, 5).join(', ')}...`;
    }

    return undefined;
  }

  // Clean shutdown
  async shutdown() {
    console.log('AI Manager shutting down...');
    this.providers.clear();
    this.isInitialized = false;
  }
}

// Singleton instance
export const aiManager = new AIManager();

import { AIProvider, AIMessage, AIResponse, VoiceMessage } from '../../shared/ai-providers';

export abstract class BaseAIProvider {
  protected provider: AIProvider;
  protected apiKey: string;
  protected baseUrl?: string;

  constructor(provider: AIProvider, apiKey: string, baseUrl?: string) {
    this.provider = provider;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  // Abstract methods that must be implemented by subclasses
  abstract chat(messages: AIMessage[], model?: string): Promise<AIResponse>;
  abstract streamChat(messages: AIMessage[], model?: string): AsyncGenerator<string, void, unknown>;
  abstract analyzeImage(imageData: string, prompt: string, model?: string): Promise<AIResponse>;
  abstract transcribeAudio(audioData: ArrayBuffer, format?: string): Promise<VoiceMessage>;
  abstract generateSpeech(text: string, voice?: string): Promise<ArrayBuffer>;

  // Helper methods
  protected formatMessages(messages: AIMessage[]): any[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  protected calculateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  protected createResponse(content: string, model: string, inputTokens: number, outputTokens: number): AIResponse {
    return {
      content,
      provider: this.provider,
      model,
      timestamp: new Date(),
      tokens: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens
      }
    };
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const testMessage: AIMessage = {
        role: 'user',
        content: 'Hello'
      };
      const response = await this.chat([testMessage]);
      return response.content.length > 0;
    } catch (error) {
      console.error(`Health check failed for ${this.provider}:`, error);
      return false;
    }
  }

  // Get provider info
  getProviderInfo() {
    return {
      provider: this.provider,
      baseUrl: this.baseUrl,
      isHealthy: false // Will be updated by health check
    };
  }
}

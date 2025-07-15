import Anthropic from '@anthropic-ai/sdk';
import { BaseAIProvider } from './base-provider';
import { AIMessage, AIResponse, VoiceMessage } from '../../shared/ai-providers';

export class AnthropicProvider extends BaseAIProvider {
  private client: Anthropic;

  constructor(apiKey: string) {
    super('anthropic', apiKey);
    this.client = new Anthropic({
      apiKey: this.apiKey
    });
  }

  async chat(messages: AIMessage[], model: string = 'claude-sonnet-4-20250514'): Promise<AIResponse> {
    try {
      // Extract system message if present
      const systemMessage = messages.find(m => m.role === 'system');
      const userMessages = messages.filter(m => m.role !== 'system');

      const response = await this.client.messages.create({
        model,
        max_tokens: 2000,
        temperature: 0.7,
        system: systemMessage?.content || undefined,
        messages: this.formatMessages(userMessages)
      });

      const inputTokens = this.calculateTokens(messages.map(m => m.content).join(' '));
      const outputTokens = response.usage?.output_tokens || 0;

      return this.createResponse(
        response.content[0].type === 'text' ? response.content[0].text : '',
        model,
        inputTokens,
        outputTokens
      );
    } catch (error) {
      console.error('Anthropic chat error:', error);
      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }

  async *streamChat(messages: AIMessage[], model: string = 'claude-sonnet-4-20250514'): AsyncGenerator<string, void, unknown> {
    try {
      const systemMessage = messages.find(m => m.role === 'system');
      const userMessages = messages.filter(m => m.role !== 'system');

      const stream = await this.client.messages.create({
        model,
        max_tokens: 2000,
        temperature: 0.7,
        system: systemMessage?.content || undefined,
        messages: this.formatMessages(userMessages),
        stream: true
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          yield chunk.delta.text;
        }
      }
    } catch (error) {
      console.error('Anthropic stream error:', error);
      throw new Error(`Anthropic stream error: ${error.message}`);
    }
  }

  async analyzeImage(imageData: string, prompt: string, model: string = 'claude-sonnet-4-20250514'): Promise<AIResponse> {
    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: imageData
                }
              }
            ]
          }
        ]
      });

      const inputTokens = this.calculateTokens(prompt);
      const outputTokens = response.usage?.output_tokens || 0;

      return this.createResponse(
        response.content[0].type === 'text' ? response.content[0].text : '',
        model,
        inputTokens,
        outputTokens
      );
    } catch (error) {
      console.error('Anthropic image analysis error:', error);
      throw new Error(`Anthropic image analysis error: ${error.message}`);
    }
  }

  async transcribeAudio(audioData: ArrayBuffer, format: string = 'wav'): Promise<VoiceMessage> {
    // Anthropic doesn't support audio transcription directly
    // This would need to be implemented with a third-party service
    throw new Error('Audio transcription not supported by Anthropic. Use OpenAI Whisper or similar service.');
  }

  async generateSpeech(text: string, voice?: string): Promise<ArrayBuffer> {
    // Anthropic doesn't support text-to-speech directly
    // This would need to be implemented with a third-party service
    throw new Error('Text-to-speech not supported by Anthropic. Use OpenAI TTS or similar service.');
  }

  // Anthropic-specific methods
  async analyzeSentiment(text: string, model: string = 'claude-sonnet-4-20250514'): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    reasoning: string;
  }> {
    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: 500,
        system: 'You are a sentiment analysis expert. Analyze the sentiment of the given text and respond with JSON containing: sentiment (positive/negative/neutral), confidence (0-1), and reasoning.',
        messages: [
          {
            role: 'user',
            content: text
          }
        ]
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      
      try {
        const result = JSON.parse(content);
        return {
          sentiment: result.sentiment || 'neutral',
          confidence: Math.max(0, Math.min(1, result.confidence || 0)),
          reasoning: result.reasoning || 'No reasoning provided'
        };
      } catch (parseError) {
        console.error('Failed to parse sentiment response:', parseError);
        return {
          sentiment: 'neutral',
          confidence: 0,
          reasoning: 'Failed to parse response'
        };
      }
    } catch (error) {
      console.error('Anthropic sentiment analysis error:', error);
      throw new Error(`Anthropic sentiment analysis error: ${error.message}`);
    }
  }

  async summarizeText(text: string, maxLength: number = 200, model: string = 'claude-sonnet-4-20250514'): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: maxLength * 2,
        system: `Summarize the following text in approximately ${maxLength} words or less. Focus on key points and main ideas.`,
        messages: [
          {
            role: 'user',
            content: text
          }
        ]
      });

      return response.content[0].type === 'text' ? response.content[0].text : '';
    } catch (error) {
      console.error('Anthropic summarization error:', error);
      throw new Error(`Anthropic summarization error: ${error.message}`);
    }
  }
}
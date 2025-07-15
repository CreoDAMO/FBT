import OpenAI from 'openai';
import { BaseAIProvider } from './base-provider';
import { AIMessage, AIResponse, VoiceMessage } from '../../shared/ai-providers';

export class XAIProvider extends BaseAIProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    super('xai', apiKey, 'https://api.x.ai/v1');
    this.client = new OpenAI({
      baseURL: 'https://api.x.ai/v1',
      apiKey: this.apiKey
    });
  }

  async chat(messages: AIMessage[], model: string = 'grok-2-1212'): Promise<AIResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: this.formatMessages(messages),
        temperature: 0.7,
        max_tokens: 2000
      });

      const inputTokens = this.calculateTokens(messages.map(m => m.content).join(' '));
      const outputTokens = response.usage?.completion_tokens || 0;

      return this.createResponse(
        response.choices[0].message.content || '',
        model,
        inputTokens,
        outputTokens
      );
    } catch (error) {
      console.error('xAI chat error:', error);
      throw new Error(`xAI API error: ${error.message}`);
    }
  }

  async *streamChat(messages: AIMessage[], model: string = 'grok-2-1212'): AsyncGenerator<string, void, unknown> {
    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: this.formatMessages(messages),
        temperature: 0.7,
        max_tokens: 2000,
        stream: true
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('xAI stream error:', error);
      throw new Error(`xAI stream error: ${error.message}`);
    }
  }

  async analyzeImage(imageData: string, prompt: string, model: string = 'grok-2-vision-1212'): Promise<AIResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageData}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      });

      const inputTokens = this.calculateTokens(prompt);
      const outputTokens = response.usage?.completion_tokens || 0;

      return this.createResponse(
        response.choices[0].message.content || '',
        model,
        inputTokens,
        outputTokens
      );
    } catch (error) {
      console.error('xAI image analysis error:', error);
      throw new Error(`xAI image analysis error: ${error.message}`);
    }
  }

  async transcribeAudio(audioData: ArrayBuffer, format: string = 'wav'): Promise<VoiceMessage> {
    // xAI doesn't support audio transcription directly
    // This would need to be implemented with a third-party service
    throw new Error('Audio transcription not supported by xAI. Use OpenAI Whisper or similar service.');
  }

  async generateSpeech(text: string, voice?: string): Promise<ArrayBuffer> {
    // xAI doesn't support text-to-speech directly
    // This would need to be implemented with a third-party service
    throw new Error('Text-to-speech not supported by xAI. Use OpenAI TTS or similar service.');
  }

  // xAI-specific methods
  async analyzeWithRealtime(messages: AIMessage[], model: string = 'grok-2-1212'): Promise<{
    response: AIResponse;
    realTimeData?: any;
  }> {
    try {
      // Add current timestamp and real-time context
      const enhancedMessages = [
        {
          role: 'system' as const,
          content: `You are Grok, xAI's AI assistant. Current timestamp: ${new Date().toISOString()}. You have access to real-time information and can provide current, up-to-date responses.`
        },
        ...messages
      ];

      const response = await this.chat(enhancedMessages, model);
      
      return {
        response,
        realTimeData: {
          timestamp: new Date().toISOString(),
          hasRealTimeAccess: true
        }
      };
    } catch (error) {
      console.error('xAI real-time analysis error:', error);
      throw new Error(`xAI real-time analysis error: ${error.message}`);
    }
  }

  async generateCode(prompt: string, language: string = 'javascript', model: string = 'grok-2-1212'): Promise<{
    code: string;
    explanation: string;
    suggestions: string[];
  }> {
    try {
      const systemPrompt = `You are a code generation expert. Generate ${language} code based on the user's request. Respond with JSON containing:
      - code: the generated code
      - explanation: explanation of how the code works
      - suggestions: array of improvement suggestions`;

      const response = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2000
      });

      const content = response.choices[0].message.content || '{}';
      
      try {
        const result = JSON.parse(content);
        return {
          code: result.code || '',
          explanation: result.explanation || '',
          suggestions: result.suggestions || []
        };
      } catch (parseError) {
        console.error('Failed to parse code generation response:', parseError);
        return {
          code: content,
          explanation: 'Failed to parse structured response',
          suggestions: []
        };
      }
    } catch (error) {
      console.error('xAI code generation error:', error);
      throw new Error(`xAI code generation error: ${error.message}`);
    }
  }

  async wittyResponse(prompt: string, model: string = 'grok-2-1212'): Promise<AIResponse> {
    try {
      const systemPrompt = `You are Grok, xAI's witty and humorous AI assistant. Respond with clever humor, wit, and personality while still being helpful. Feel free to be playful and entertaining in your responses.`;

      const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ];

      return await this.chat(messages, model);
    } catch (error) {
      console.error('xAI witty response error:', error);
      throw new Error(`xAI witty response error: ${error.message}`);
    }
  }
}
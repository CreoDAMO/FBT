import OpenAI from 'openai';
import { BaseAIProvider } from './base-provider';
import { AIMessage, AIResponse, VoiceMessage } from '../../shared/ai-providers';

export class OpenAIProvider extends BaseAIProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    super('openai', apiKey);
    this.client = new OpenAI({
      apiKey: this.apiKey
    });
  }

  async chat(messages: AIMessage[], model: string = 'gpt-4o'): Promise<AIResponse> {
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
      console.error('OpenAI chat error:', error);
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  async *streamChat(messages: AIMessage[], model: string = 'gpt-4o'): AsyncGenerator<string, void, unknown> {
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
      console.error('OpenAI stream error:', error);
      throw new Error(`OpenAI stream error: ${error.message}`);
    }
  }

  async analyzeImage(imageData: string, prompt: string, model: string = 'gpt-4o'): Promise<AIResponse> {
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
      console.error('OpenAI image analysis error:', error);
      throw new Error(`OpenAI image analysis error: ${error.message}`);
    }
  }

  async transcribeAudio(audioData: ArrayBuffer, format: string = 'wav'): Promise<VoiceMessage> {
    try {
      const audioFile = new File([audioData], `audio.${format}`, { type: `audio/${format}` });
      
      const response = await this.client.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en'
      });

      return {
        id: `openai-${Date.now()}`,
        text: response.text,
        provider: 'openai',
        timestamp: new Date(),
        duration: 0 // OpenAI doesn't provide duration
      };
    } catch (error) {
      console.error('OpenAI transcription error:', error);
      throw new Error(`OpenAI transcription error: ${error.message}`);
    }
  }

  async generateSpeech(text: string, voice: string = 'alloy'): Promise<ArrayBuffer> {
    try {
      const response = await this.client.audio.speech.create({
        model: 'tts-1',
        voice: voice as any,
        input: text,
        response_format: 'mp3'
      });

      return await response.arrayBuffer();
    } catch (error) {
      console.error('OpenAI TTS error:', error);
      throw new Error(`OpenAI TTS error: ${error.message}`);
    }
  }

  // OpenAI-specific methods
  async generateImage(prompt: string, size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024'): Promise<string> {
    try {
      const response = await this.client.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size,
        quality: 'standard'
      });

      return response.data[0].url || '';
    } catch (error) {
      console.error('OpenAI image generation error:', error);
      throw new Error(`OpenAI image generation error: ${error.message}`);
    }
  }

  async createAssistant(name: string, instructions: string, model: string = 'gpt-4o') {
    try {
      const assistant = await this.client.beta.assistants.create({
        name,
        instructions,
        model,
        tools: [{ type: 'code_interpreter' }, { type: 'file_search' }]
      });

      return assistant;
    } catch (error) {
      console.error('OpenAI assistant creation error:', error);
      throw new Error(`OpenAI assistant creation error: ${error.message}`);
    }
  }
}
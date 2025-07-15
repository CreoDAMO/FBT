import OpenAI from 'openai';
import { BaseAIProvider } from './base-provider';
import { AIMessage, AIResponse, VoiceMessage } from '../../shared/ai-providers';

export class DeepSeekProvider extends BaseAIProvider {
  private client: OpenAI;

  constructor(apiKey: string) {
    super('deepseek', apiKey, 'https://api.deepseek.com');
    this.client = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: this.apiKey
    });
  }

  async chat(messages: AIMessage[], model: string = 'deepseek-chat'): Promise<AIResponse> {
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
      console.error('DeepSeek chat error:', error);
      throw new Error(`DeepSeek API error: ${error.message}`);
    }
  }

  async *streamChat(messages: AIMessage[], model: string = 'deepseek-chat'): AsyncGenerator<string, void, unknown> {
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
      console.error('DeepSeek stream error:', error);
      throw new Error(`DeepSeek stream error: ${error.message}`);
    }
  }

  async analyzeImage(imageData: string, prompt: string, model: string = 'deepseek-chat'): Promise<AIResponse> {
    // DeepSeek doesn't support image analysis directly
    // This would need to be implemented with a third-party service or vision model
    throw new Error('Image analysis not supported by DeepSeek. Use OpenAI GPT-4V or similar service.');
  }

  async transcribeAudio(audioData: ArrayBuffer, format: string = 'wav'): Promise<VoiceMessage> {
    // DeepSeek doesn't support audio transcription directly
    // This would need to be implemented with a third-party service
    throw new Error('Audio transcription not supported by DeepSeek. Use OpenAI Whisper or similar service.');
  }

  async generateSpeech(text: string, voice?: string): Promise<ArrayBuffer> {
    // DeepSeek doesn't support text-to-speech directly
    // This would need to be implemented with a third-party service
    throw new Error('Text-to-speech not supported by DeepSeek. Use OpenAI TTS or similar service.');
  }

  // DeepSeek-specific methods
  async reasoning(prompt: string, model: string = 'deepseek-reasoner'): Promise<{
    response: AIResponse;
    reasoning: string;
    confidence: number;
  }> {
    try {
      const systemPrompt = `You are DeepSeek's reasoning model. Provide detailed step-by-step reasoning for complex problems. Break down your thought process and show your work.`;

      const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ];

      const response = await this.chat(messages, model);
      
      // Extract reasoning from response (DeepSeek-R1 includes reasoning tokens)
      const reasoning = response.content.includes('**Reasoning:**') 
        ? response.content.split('**Reasoning:**')[1]?.split('**Answer:**')[0]?.trim() || ''
        : '';

      return {
        response,
        reasoning,
        confidence: 0.8 // DeepSeek reasoning is generally high confidence
      };
    } catch (error) {
      console.error('DeepSeek reasoning error:', error);
      throw new Error(`DeepSeek reasoning error: ${error.message}`);
    }
  }

  async solveMathProblem(problem: string, model: string = 'deepseek-reasoner'): Promise<{
    solution: string;
    steps: string[];
    verification: string;
  }> {
    try {
      const systemPrompt = `You are a mathematical reasoning expert. Solve the given problem step by step. Show all work and verify your answer. Format your response as JSON with:
      - solution: the final answer
      - steps: array of solution steps
      - verification: verification of the answer`;

      const response = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: problem
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2000
      });

      const content = response.choices[0].message.content || '{}';
      
      try {
        const result = JSON.parse(content);
        return {
          solution: result.solution || '',
          steps: result.steps || [],
          verification: result.verification || ''
        };
      } catch (parseError) {
        console.error('Failed to parse math solution response:', parseError);
        return {
          solution: content,
          steps: [],
          verification: 'Failed to parse structured response'
        };
      }
    } catch (error) {
      console.error('DeepSeek math problem error:', error);
      throw new Error(`DeepSeek math problem error: ${error.message}`);
    }
  }

  async codeReview(code: string, language: string = 'javascript', model: string = 'deepseek-chat'): Promise<{
    summary: string;
    issues: Array<{
      type: 'error' | 'warning' | 'suggestion';
      message: string;
      line?: number;
    }>;
    suggestions: string[];
    score: number;
  }> {
    try {
      const systemPrompt = `You are a code review expert. Review the provided ${language} code and provide:
      - summary: overall assessment
      - issues: array of issues found (type, message, line)
      - suggestions: improvement suggestions
      - score: code quality score 0-100
      Respond in JSON format.`;

      const response = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Review this ${language} code:\n\n${code}`
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2000
      });

      const content = response.choices[0].message.content || '{}';
      
      try {
        const result = JSON.parse(content);
        return {
          summary: result.summary || '',
          issues: result.issues || [],
          suggestions: result.suggestions || [],
          score: Math.max(0, Math.min(100, result.score || 0))
        };
      } catch (parseError) {
        console.error('Failed to parse code review response:', parseError);
        return {
          summary: content,
          issues: [],
          suggestions: [],
          score: 0
        };
      }
    } catch (error) {
      console.error('DeepSeek code review error:', error);
      throw new Error(`DeepSeek code review error: ${error.message}`);
    }
  }
}
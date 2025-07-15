import { z } from 'zod';

// AI Provider Types
export type AIProvider = 'openai' | 'anthropic' | 'xai' | 'deepseek';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
  tokens?: {
    input: number;
    output: number;
  };
  cost?: number;
  timestamp: Date;
}

export interface VoiceMessage {
  id: string;
  text: string;
  audioUrl?: string;
  provider: AIProvider;
  timestamp: Date;
  duration?: number;
}

// AI Provider Configurations
export const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o',
    features: ['chat', 'voice', 'image', 'code'],
    color: '#10A37F',
    icon: '🤖'
  },
  anthropic: {
    name: 'Anthropic',
    models: ['claude-sonnet-4-20250514', 'claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-20241022'],
    defaultModel: 'claude-sonnet-4-20250514',
    features: ['chat', 'image', 'code', 'analysis'],
    color: '#D97706',
    icon: '🧠'
  },
  xai: {
    name: 'xAI Grok',
    models: ['grok-2-vision-1212', 'grok-2-1212', 'grok-vision-beta', 'grok-beta'],
    defaultModel: 'grok-2-1212',
    features: ['chat', 'image', 'realtime'],
    color: '#6B46C1',
    icon: '⚡'
  },
  deepseek: {
    name: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    defaultModel: 'deepseek-chat',
    features: ['chat', 'reasoning', 'code'],
    color: '#EF4444',
    icon: '🔍'
  }
} as const;

// Zod schemas for validation
export const aiMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
  timestamp: z.date().optional()
});

export const aiResponseSchema = z.object({
  content: z.string(),
  provider: z.enum(['openai', 'anthropic', 'xai', 'deepseek']),
  model: z.string(),
  tokens: z.object({
    input: z.number(),
    output: z.number()
  }).optional(),
  cost: z.number().optional(),
  timestamp: z.date()
});

export const voiceMessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  audioUrl: z.string().optional(),
  provider: z.enum(['openai', 'anthropic', 'xai', 'deepseek']),
  timestamp: z.date(),
  duration: z.number().optional()
});

// Chat session types
export interface ChatSession {
  id: string;
  userId: number;
  title: string;
  provider: AIProvider;
  model: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
  isVoiceEnabled: boolean;
  metadata?: Record<string, any>;
}

export const chatSessionSchema = z.object({
  id: z.string(),
  userId: z.number(),
  title: z.string(),
  provider: z.enum(['openai', 'anthropic', 'xai', 'deepseek']),
  model: z.string(),
  messages: z.array(aiMessageSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  isVoiceEnabled: z.boolean().default(false),
  metadata: z.record(z.any()).optional()
});

// Insert types
export type InsertChatSession = Omit<ChatSession, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertAIMessage = Omit<AIMessage, 'timestamp'>;
export type InsertVoiceMessage = Omit<VoiceMessage, 'timestamp'>;

// API request/response types
export interface ChatRequest {
  message: string;
  provider: AIProvider;
  model?: string;
  sessionId?: string;
  isVoiceEnabled?: boolean;
  context?: Record<string, any>;
}

export interface VoiceRequest {
  audioData: ArrayBuffer;
  provider: AIProvider;
  sessionId?: string;
  format?: 'wav' | 'mp3' | 'webm';
}

export interface StreamingResponse {
  type: 'token' | 'complete' | 'error';
  content: string;
  provider: AIProvider;
  sessionId?: string;
  error?: string;
}

// Omniverse integration types
export interface OmniverseConfig {
  streamUrl: string;
  appId: string;
  width: number;
  height: number;
  fps: number;
  enableInteraction: boolean;
}

export interface OmniverseMessage {
  type: 'input' | 'output' | 'control';
  data: any;
  timestamp: Date;
}

// Advanced features
export interface AIAnalytics {
  totalTokens: number;
  totalCost: number;
  providerUsage: Record<AIProvider, number>;
  avgResponseTime: number;
  popularModels: Record<string, number>;
  errorRate: number;
}

export interface AIAgentConfig {
  name: string;
  description: string;
  systemPrompt: string;
  provider: AIProvider;
  model: string;
  features: string[];
  isActive: boolean;
  metadata?: Record<string, any>;
}

export const aiAgentConfigSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  systemPrompt: z.string().min(1),
  provider: z.enum(['openai', 'anthropic', 'xai', 'deepseek']),
  model: z.string(),
  features: z.array(z.string()),
  isActive: z.boolean().default(true),
  metadata: z.record(z.any()).optional()
});
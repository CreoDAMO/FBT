import { Router } from 'express';
import { z } from 'zod';
import { aiManager } from './ai-manager';
import { voiceHandler } from './voice-handler';
import { streamlitIntegration } from './streamlit-integration';
import { storage } from '../storage';
import { AIProvider, AIMessage, ChatRequest, VoiceRequest } from '../../shared/ai-providers';

const router = Router();

// Validation schemas
const chatRequestSchema = z.object({
  message: z.string().min(1),
  provider: z.enum(['openai', 'anthropic', 'xai', 'deepseek']),
  model: z.string().optional(),
  sessionId: z.string().optional(),
  isVoiceEnabled: z.boolean().optional(),
  context: z.record(z.any()).optional()
});

const voiceRequestSchema = z.object({
  audioData: z.string(), // base64 encoded audio
  provider: z.enum(['openai', 'anthropic', 'xai', 'deepseek']),
  sessionId: z.string().optional(),
  format: z.enum(['wav', 'mp3', 'webm']).optional()
});

const imageAnalysisSchema = z.object({
  imageData: z.string(), // base64 encoded image
  prompt: z.string().min(1),
  provider: z.enum(['openai', 'anthropic', 'xai', 'deepseek']),
  model: z.string().optional()
});

// Chat endpoints
router.post('/chat', async (req, res) => {
  try {
    const validation = chatRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request', details: validation.error.errors });
    }

    const { message, provider, model, sessionId, isVoiceEnabled, context } = validation.data;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Create or get session
    let session;
    if (sessionId) {
      session = await storage.getAiChatSession(sessionId);
      if (!session || session.userId !== userId) {
        return res.status(404).json({ error: 'Session not found' });
      }
    } else {
      session = await storage.createAiChatSession({
        id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        provider,
        model: model || 'default',
        isVoiceEnabled: isVoiceEnabled || false,
        metadata: context || {}
      });
    }

    // Get conversation history
    const messages = await storage.getAiMessages(session.id);
    const conversationHistory: AIMessage[] = messages.map(msg => ({
      role: msg.role as 'system' | 'user' | 'assistant',
      content: msg.content,
      timestamp: msg.timestamp
    }));

    // Add current message
    conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Get AI response
    const startTime = Date.now();
    const aiResponse = await aiManager.chat(conversationHistory, provider, model);
    const responseTime = Date.now() - startTime;

    // Store messages
    await storage.createAiMessage({
      sessionId: session.id,
      role: 'user',
      content: message,
      provider,
      model: aiResponse.model,
      tokens: aiResponse.tokens?.input || 0
    });

    await storage.createAiMessage({
      sessionId: session.id,
      role: 'assistant',
      content: aiResponse.content,
      provider: aiResponse.provider,
      model: aiResponse.model,
      tokens: aiResponse.tokens?.output || 0,
      cost: aiResponse.cost || 0
    });

    // Store analytics
    await storage.createAiAnalytics({
      userId,
      provider: aiResponse.provider,
      model: aiResponse.model,
      requestType: 'chat',
      tokenUsage: (aiResponse.tokens?.input || 0) + (aiResponse.tokens?.output || 0),
      cost: aiResponse.cost || 0,
      responseTime: responseTime / 1000, // Convert to seconds
      success: true
    });

    res.json({
      response: aiResponse.content,
      sessionId: session.id,
      provider: aiResponse.provider,
      model: aiResponse.model,
      tokens: aiResponse.tokens,
      cost: aiResponse.cost,
      responseTime
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Streaming chat endpoint
router.post('/chat/stream', async (req, res) => {
  try {
    const validation = chatRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request', details: validation.error.errors });
    }

    const { message, provider, model, sessionId } = validation.data;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Set up SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    // Get session and conversation history
    let session;
    if (sessionId) {
      session = await storage.getAiChatSession(sessionId);
    } else {
      session = await storage.createAiChatSession({
        id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        title: message.substring(0, 50),
        provider,
        model: model || 'default',
        isVoiceEnabled: false
      });
    }

    const messages = await storage.getAiMessages(session.id);
    const conversationHistory: AIMessage[] = messages.map(msg => ({
      role: msg.role as 'system' | 'user' | 'assistant',
      content: msg.content,
      timestamp: msg.timestamp
    }));

    conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    let fullResponse = '';
    const startTime = Date.now();

    try {
      for await (const chunk of aiManager.streamChat(conversationHistory, provider, model)) {
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      }

      const responseTime = Date.now() - startTime;

      // Store messages
      await storage.createAiMessage({
        sessionId: session.id,
        role: 'user',
        content: message,
        provider,
        model: model || 'default'
      });

      await storage.createAiMessage({
        sessionId: session.id,
        role: 'assistant',
        content: fullResponse,
        provider,
        model: model || 'default'
      });

      res.write(`data: ${JSON.stringify({ 
        type: 'complete', 
        sessionId: session.id, 
        responseTime 
      })}\n\n`);
    } catch (error) {
      res.write(`data: ${JSON.stringify({ 
        type: 'error', 
        message: error.message 
      })}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error('Stream chat error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Voice endpoints
router.post('/voice/transcribe', async (req, res) => {
  try {
    const validation = voiceRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request', details: validation.error.errors });
    }

    const { audioData, provider, sessionId, format } = validation.data;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Convert base64 to ArrayBuffer
    const audioBuffer = Buffer.from(audioData, 'base64').buffer;

    // Transcribe audio
    const startTime = Date.now();
    const voiceMessage = await aiManager.transcribeAudio(audioBuffer, provider, format);
    const responseTime = Date.now() - startTime;

    // Store voice message if session exists
    if (sessionId) {
      await storage.createAiVoiceMessage({
        id: voiceMessage.id,
        sessionId,
        userId,
        text: voiceMessage.text,
        provider: voiceMessage.provider,
        duration: voiceMessage.duration || 0
      });
    }

    // Store analytics
    await storage.createAiAnalytics({
      userId,
      provider: voiceMessage.provider,
      model: 'whisper-1', // Default transcription model
      requestType: 'transcription',
      responseTime: responseTime / 1000,
      success: true
    });

    res.json({
      transcription: voiceMessage.text,
      provider: voiceMessage.provider,
      duration: voiceMessage.duration,
      responseTime
    });
  } catch (error) {
    console.error('Voice transcription error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

router.post('/voice/synthesize', async (req, res) => {
  try {
    const schema = z.object({
      text: z.string().min(1),
      provider: z.enum(['openai', 'anthropic', 'xai', 'deepseek']),
      voice: z.string().optional()
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request', details: validation.error.errors });
    }

    const { text, provider, voice } = validation.data;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Generate speech
    const startTime = Date.now();
    const audioBuffer = await aiManager.generateSpeech(text, provider, voice);
    const responseTime = Date.now() - startTime;

    // Store analytics
    await storage.createAiAnalytics({
      userId,
      provider,
      model: 'tts-1', // Default TTS model
      requestType: 'synthesis',
      responseTime: responseTime / 1000,
      success: true
    });

    // Return audio as base64
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    res.json({
      audioData: audioBase64,
      provider,
      voice,
      responseTime
    });
  } catch (error) {
    console.error('Voice synthesis error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Image analysis endpoint
router.post('/image/analyze', async (req, res) => {
  try {
    const validation = imageAnalysisSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request', details: validation.error.errors });
    }

    const { imageData, prompt, provider, model } = validation.data;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Analyze image
    const startTime = Date.now();
    const aiResponse = await aiManager.analyzeImage(imageData, prompt, provider, model);
    const responseTime = Date.now() - startTime;

    // Store analytics
    await storage.createAiAnalytics({
      userId,
      provider: aiResponse.provider,
      model: aiResponse.model,
      requestType: 'image',
      tokenUsage: (aiResponse.tokens?.input || 0) + (aiResponse.tokens?.output || 0),
      cost: aiResponse.cost || 0,
      responseTime: responseTime / 1000,
      success: true
    });

    res.json({
      analysis: aiResponse.content,
      provider: aiResponse.provider,
      model: aiResponse.model,
      tokens: aiResponse.tokens,
      cost: aiResponse.cost,
      responseTime
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Multi-provider comparison endpoint
router.post('/compare', async (req, res) => {
  try {
    const schema = z.object({
      message: z.string().min(1),
      providers: z.array(z.enum(['openai', 'anthropic', 'xai', 'deepseek'])).min(2)
    });

    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request', details: validation.error.errors });
    }

    const { message, providers } = validation.data;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const messages: AIMessage[] = [{ role: 'user', content: message }];
    
    // Compare providers
    const startTime = Date.now();
    const comparison = await aiManager.compareProviders(messages, providers);
    const responseTime = Date.now() - startTime;

    res.json({
      responses: comparison.responses,
      fastest: comparison.fastest,
      consensus: comparison.consensus,
      responseTime
    });
  } catch (error) {
    console.error('Provider comparison error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Session management endpoints
router.get('/sessions', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const sessions = await storage.getAiChatSessionsByUser(userId);
    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const session = await storage.getAiChatSession(sessionId);
    if (!session || session.userId !== userId) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const messages = await storage.getAiMessages(sessionId);
    const voiceMessages = await storage.getAiVoiceMessages(sessionId);

    res.json({
      session,
      messages,
      voiceMessages
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Provider status endpoint
router.get('/providers', async (req, res) => {
  try {
    const availableProviders = aiManager.getAvailableProviders();
    const healthStatus = await aiManager.checkProviderHealth();
    
    const providers = availableProviders.map(provider => ({
      name: provider,
      isHealthy: healthStatus[provider],
      capabilities: aiManager.getProviderCapabilities(provider)
    }));

    res.json(providers);
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Analytics endpoint
router.get('/analytics', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const analytics = await storage.getAiAnalyticsByUser(userId);
    
    // Process analytics data
    const summary = {
      totalRequests: analytics.length,
      totalTokens: analytics.reduce((sum, a) => sum + (a.tokenUsage || 0), 0),
      totalCost: analytics.reduce((sum, a) => sum + (Number(a.cost) || 0), 0),
      averageResponseTime: analytics.reduce((sum, a) => sum + (Number(a.responseTime) || 0), 0) / analytics.length,
      successRate: (analytics.filter(a => a.success).length / analytics.length) * 100,
      providerUsage: analytics.reduce((acc, a) => {
        acc[a.provider] = (acc[a.provider] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    res.json({ summary, analytics });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Streamlit integration endpoints
router.get('/streamlit/status', async (req, res) => {
  try {
    const status = streamlitIntegration.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Streamlit status error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

router.post('/streamlit/start', async (req, res) => {
  try {
    await streamlitIntegration.startStreamlit();
    res.json({ message: 'Streamlit started successfully' });
  } catch (error) {
    console.error('Streamlit start error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

router.post('/streamlit/stop', async (req, res) => {
  try {
    await streamlitIntegration.stopStreamlit();
    res.json({ message: 'Streamlit stopped successfully' });
  } catch (error) {
    console.error('Streamlit stop error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

export { router as aiRoutes };
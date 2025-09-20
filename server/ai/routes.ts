
import { Router } from 'express';
import { aiManager } from './ai-manager';
import { storage } from '../storage';
import { AIMessage, AIProvider } from '../../shared/ai-providers';

const router = Router();

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { messages, provider = 'openai', model, temperature, maxTokens, imageData } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    let response;

    if (imageData) {
      // Image analysis
      const prompt = messages[messages.length - 1]?.content || 'Analyze this image';
      response = await aiManager.analyzeImage(imageData, prompt, provider, model);
    } else {
      // Regular chat
      response = await aiManager.chat(messages, provider, model);
    }

    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// Stream chat endpoint
router.post('/chat/stream', async (req, res) => {
  try {
    const { messages, provider = 'openai', model } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of aiManager.streamChat(messages, provider, model)) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    console.error('Stream chat error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// Voice transcription endpoint
router.post('/voice/transcribe', async (req, res) => {
  try {
    const { audioData, provider = 'openai', format = 'wav' } = req.body;

    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    // Convert base64 to ArrayBuffer
    const audioBuffer = Buffer.from(audioData, 'base64').buffer;
    
    const voiceMessage = await aiManager.transcribeAudio(audioBuffer, provider, format);
    
    res.json(voiceMessage);
  } catch (error) {
    console.error('Voice transcription error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// Text-to-speech endpoint
router.post('/voice/synthesize', async (req, res) => {
  try {
    const { text, provider = 'openai', voice } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const audioBuffer = await aiManager.generateSpeech(text, provider, voice);
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error('Text-to-speech error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// Compare providers endpoint
router.post('/compare', async (req, res) => {
  try {
    const { messages, providers } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const comparison = await aiManager.compareProviders(messages, providers);
    
    res.json(comparison);
  } catch (error) {
    console.error('Provider comparison error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// Enhanced workflow endpoint
router.post('/workflow/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!['research', 'creative', 'analytical', 'technical'].includes(type)) {
      return res.status(400).json({ error: 'Invalid workflow type' });
    }

    const result = await aiManager.enhancedWorkflow(prompt, type as any);
    
    res.json(result);
  } catch (error) {
    console.error('Enhanced workflow error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// Provider health check
router.get('/health', async (req, res) => {
  try {
    const health = await aiManager.checkProviderHealth();
    const providers = aiManager.getAvailableProviders();
    
    const providerInfo = providers.map(provider => ({
      provider,
      healthy: health[provider],
      capabilities: aiManager.getProviderCapabilities(provider)
    }));

    res.json({
      providers: providerInfo,
      totalProviders: providers.length,
      healthyProviders: Object.values(health).filter(Boolean).length
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

// Get available providers
router.get('/providers', async (req, res) => {
  try {
    const providers = aiManager.getAvailableProviders();
    const providerDetails = providers.map(provider => ({
      id: provider,
      name: provider.charAt(0).toUpperCase() + provider.slice(1),
      capabilities: aiManager.getProviderCapabilities(provider)
    }));

    res.json(providerDetails);
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

export { router as aiRoutes };

import { aiManager } from './ai-manager';
import { AIProvider, VoiceMessage, AIMessage } from '../../shared/ai-providers';

export class VoiceHandler {
  private activeConnections: Map<string, {
    provider: AIProvider;
    sessionId: string;
    userId: number;
    isRecording: boolean;
    audioChunks: ArrayBuffer[];
  }> = new Map();

  // Start voice session
  async startVoiceSession(connectionId: string, userId: number, provider: AIProvider = 'openai', sessionId?: string): Promise<void> {
    this.activeConnections.set(connectionId, {
      provider,
      sessionId: sessionId || `voice-${Date.now()}`,
      userId,
      isRecording: false,
      audioChunks: []
    });

    console.log(`Voice session started for user ${userId} with provider ${provider}`);
  }

  // Process audio chunk
  async processAudioChunk(connectionId: string, audioChunk: ArrayBuffer): Promise<void> {
    const connection = this.activeConnections.get(connectionId);
    if (!connection) {
      throw new Error('Voice connection not found');
    }

    connection.audioChunks.push(audioChunk);
    
    // Auto-process if we have enough audio data (e.g., 3 seconds worth)
    if (connection.audioChunks.length >= 10) {
      await this.finalizeAudioProcessing(connectionId);
    }
  }

  // Finalize audio processing
  async finalizeAudioProcessing(connectionId: string): Promise<VoiceMessage> {
    const connection = this.activeConnections.get(connectionId);
    if (!connection) {
      throw new Error('Voice connection not found');
    }

    if (connection.audioChunks.length === 0) {
      throw new Error('No audio data to process');
    }

    // Combine audio chunks
    const totalLength = connection.audioChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
    const combinedAudio = new ArrayBuffer(totalLength);
    const view = new Uint8Array(combinedAudio);
    
    let offset = 0;
    for (const chunk of connection.audioChunks) {
      view.set(new Uint8Array(chunk), offset);
      offset += chunk.byteLength;
    }

    // Clear processed chunks
    connection.audioChunks = [];

    try {
      // Transcribe audio
      const voiceMessage = await aiManager.transcribeAudio(combinedAudio, connection.provider);
      
      console.log(`Voice transcription completed: "${voiceMessage.text}"`);
      return voiceMessage;
    } catch (error) {
      console.error('Voice transcription failed:', error);
      throw new Error(`Voice transcription failed: ${error.message}`);
    }
  }

  // Process voice message and get AI response
  async processVoiceMessage(connectionId: string, voiceMessage: VoiceMessage, conversationHistory?: AIMessage[]): Promise<{
    textResponse: string;
    audioResponse?: ArrayBuffer;
  }> {
    const connection = this.activeConnections.get(connectionId);
    if (!connection) {
      throw new Error('Voice connection not found');
    }

    // Create conversation context
    const messages: AIMessage[] = [
      ...(conversationHistory || []),
      {
        role: 'user',
        content: voiceMessage.text,
        timestamp: new Date()
      }
    ];

    try {
      // Get AI response
      const aiResponse = await aiManager.chat(messages, connection.provider);
      
      // Generate speech from response
      let audioResponse: ArrayBuffer | undefined;
      try {
        audioResponse = await aiManager.generateSpeech(aiResponse.content, connection.provider);
      } catch (error) {
        console.error('Speech generation failed:', error);
        // Continue without audio response
      }

      return {
        textResponse: aiResponse.content,
        audioResponse
      };
    } catch (error) {
      console.error('Voice message processing failed:', error);
      throw new Error(`Voice message processing failed: ${error.message}`);
    }
  }

  // Text to speech
  async textToSpeech(connectionId: string, text: string, voice?: string): Promise<ArrayBuffer> {
    const connection = this.activeConnections.get(connectionId);
    if (!connection) {
      throw new Error('Voice connection not found');
    }

    try {
      return await aiManager.generateSpeech(text, connection.provider, voice);
    } catch (error) {
      console.error('Text-to-speech failed:', error);
      throw new Error(`Text-to-speech failed: ${error.message}`);
    }
  }

  // Start recording
  startRecording(connectionId: string): void {
    const connection = this.activeConnections.get(connectionId);
    if (!connection) {
      throw new Error('Voice connection not found');
    }

    connection.isRecording = true;
    connection.audioChunks = [];
    console.log(`Recording started for connection ${connectionId}`);
  }

  // Stop recording
  async stopRecording(connectionId: string): Promise<VoiceMessage> {
    const connection = this.activeConnections.get(connectionId);
    if (!connection) {
      throw new Error('Voice connection not found');
    }

    connection.isRecording = false;
    return await this.finalizeAudioProcessing(connectionId);
  }

  // Get connection status
  getConnectionStatus(connectionId: string): {
    isActive: boolean;
    isRecording: boolean;
    provider: AIProvider;
    sessionId: string;
    audioChunksCount: number;
  } | null {
    const connection = this.activeConnections.get(connectionId);
    if (!connection) {
      return null;
    }

    return {
      isActive: true,
      isRecording: connection.isRecording,
      provider: connection.provider,
      sessionId: connection.sessionId,
      audioChunksCount: connection.audioChunks.length
    };
  }

  // End voice session
  endVoiceSession(connectionId: string): void {
    const connection = this.activeConnections.get(connectionId);
    if (connection) {
      console.log(`Voice session ended for connection ${connectionId}`);
      this.activeConnections.delete(connectionId);
    }
  }

  // Get active connections count
  getActiveConnectionsCount(): number {
    return this.activeConnections.size;
  }

  // Switch provider for existing connection
  switchProvider(connectionId: string, newProvider: AIProvider): void {
    const connection = this.activeConnections.get(connectionId);
    if (!connection) {
      throw new Error('Voice connection not found');
    }

    connection.provider = newProvider;
    console.log(`Provider switched to ${newProvider} for connection ${connectionId}`);
  }

  // Clean up inactive connections
  cleanupInactiveConnections(): void {
    const now = Date.now();
    const maxInactiveTime = 30 * 60 * 1000; // 30 minutes

    for (const [connectionId, connection] of this.activeConnections.entries()) {
      // If connection hasn't been active for too long, remove it
      // This is a simple cleanup - in production, you'd track last activity
      if (connection.audioChunks.length === 0 && !connection.isRecording) {
        // Could implement more sophisticated cleanup logic here
        console.log(`Cleaning up inactive connection ${connectionId}`);
      }
    }
  }
}

// Singleton instance
export const voiceHandler = new VoiceHandler();
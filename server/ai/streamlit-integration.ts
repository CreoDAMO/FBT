import { spawn, ChildProcess } from 'child_process';
import { WebSocketServer } from 'ws';
import { aiManager } from './ai-manager';
import { AIProvider, AIMessage } from '../../shared/ai-providers';

export class StreamlitIntegration {
  private streamlitProcess: ChildProcess | null = null;
  private streamlitPort: number = 8501;
  private isRunning: boolean = false;
  private wsServer: WebSocketServer | null = null;

  constructor() {
    this.setupStreamlitApp();
  }

  // Setup Streamlit application
  private setupStreamlitApp(): void {
    // Create Streamlit app file
    this.createStreamlitApp();
  }

  // Create the main Streamlit application
  private createStreamlitApp(): void {
    const streamlitAppContent = `
import streamlit as st
import asyncio
import websockets
import json
import base64
import numpy as np
import cv2
from PIL import Image
import io

# Page configuration
st.set_page_config(
    page_title="FastBite Pro AI Studio",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
    }
    .ai-provider-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        margin-bottom: 1rem;
    }
    .voice-control-panel {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 8px;
        border: 2px solid #e9ecef;
    }
    .stButton > button {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.5rem 1rem;
        font-weight: 600;
    }
</style>
""", unsafe_allow_html=True)

# Main header
st.markdown('<div class="main-header"><h1>🚀 FastBite Pro AI Studio</h1><p>Advanced Multi-AI Platform with Voice & Vision</p></div>', unsafe_allow_html=True)

# Sidebar for AI provider selection
with st.sidebar:
    st.header("🤖 AI Providers")
    
    # Provider selection
    provider = st.selectbox(
        "Select AI Provider",
        ["OpenAI", "Anthropic", "xAI Grok", "DeepSeek"],
        key="ai_provider"
    )
    
    # Model selection based on provider
    model_options = {
        "OpenAI": ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
        "Anthropic": ["claude-sonnet-4-20250514", "claude-3-7-sonnet-20250219"],
        "xAI Grok": ["grok-2-1212", "grok-2-vision-1212"],
        "DeepSeek": ["deepseek-chat", "deepseek-reasoner"]
    }
    
    model = st.selectbox(
        "Select Model",
        model_options[provider],
        key="ai_model"
    )
    
    # Features
    st.header("🎯 Features")
    enable_voice = st.checkbox("Enable Voice Chat", value=False)
    enable_vision = st.checkbox("Enable Vision Analysis", value=False)
    enable_multimodal = st.checkbox("Multi-Provider Mode", value=False)
    
    # Settings
    st.header("⚙️ Settings")
    temperature = st.slider("Temperature", 0.0, 2.0, 0.7, 0.1)
    max_tokens = st.slider("Max Tokens", 100, 4000, 2000, 100)

# Main content area
col1, col2 = st.columns([2, 1])

with col1:
    st.header("💬 AI Chat Interface")
    
    # Initialize chat history
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
            if "provider" in message:
                st.caption(f"Provider: {message['provider']} | Model: {message['model']}")
    
    # Chat input
    if prompt := st.chat_input("Ask anything..."):
        # Add user message
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Get AI response
        with st.chat_message("assistant"):
            with st.spinner(f"Thinking with {provider}..."):
                # Here you would make API call to your backend
                # For now, we'll simulate a response
                response = f"This is a simulated response from {provider} using {model}. In the real implementation, this would connect to your FastBite Pro backend API."
                st.markdown(response)
                
                # Add assistant message
                st.session_state.messages.append({
                    "role": "assistant", 
                    "content": response,
                    "provider": provider,
                    "model": model
                })

with col2:
    st.header("🎤 Voice Controls")
    
    # Voice interface
    if enable_voice:
        st.markdown('<div class="voice-control-panel">', unsafe_allow_html=True)
        
        # Voice recording controls
        if st.button("🎙️ Start Recording"):
            st.success("Recording started...")
            st.session_state.recording = True
        
        if st.button("⏹️ Stop Recording"):
            st.info("Recording stopped. Processing...")
            st.session_state.recording = False
        
        # Voice settings
        st.subheader("Voice Settings")
        voice_speed = st.slider("Speech Speed", 0.5, 2.0, 1.0, 0.1)
        voice_pitch = st.slider("Voice Pitch", 0.5, 2.0, 1.0, 0.1)
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    # Vision interface
    if enable_vision:
        st.header("👁️ Vision Analysis")
        
        uploaded_image = st.file_uploader(
            "Upload an image",
            type=["jpg", "jpeg", "png", "gif"]
        )
        
        if uploaded_image:
            # Display image
            image = Image.open(uploaded_image)
            st.image(image, caption="Uploaded Image", use_column_width=True)
            
            # Analysis prompt
            vision_prompt = st.text_area(
                "What would you like to know about this image?",
                value="Describe what you see in this image."
            )
            
            if st.button("🔍 Analyze Image"):
                with st.spinner("Analyzing image..."):
                    # Here you would make API call to analyze image
                    st.success("Image analysis complete!")
                    st.write("Analysis result would appear here...")

# Multi-provider comparison
if enable_multimodal:
    st.header("🔄 Multi-Provider Comparison")
    
    if st.button("Compare All Providers"):
        with st.spinner("Getting responses from all providers..."):
            providers = ["OpenAI", "Anthropic", "xAI Grok", "DeepSeek"]
            
            # Create tabs for each provider
            tabs = st.tabs(providers)
            
            for i, provider in enumerate(providers):
                with tabs[i]:
                    st.write(f"Response from {provider}:")
                    # Here you would make API calls to each provider
                    st.write(f"Simulated response from {provider}...")

# Real-time metrics
st.header("📊 Real-time Metrics")
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Total Requests", "1,234", "12%")
with col2:
    st.metric("Active Sessions", "56", "3%")
with col3:
    st.metric("Average Response Time", "1.2s", "-5%")
with col4:
    st.metric("Success Rate", "99.8%", "0.1%")

# Performance charts
st.header("📈 Performance Analytics")
col1, col2 = st.columns(2)

with col1:
    st.subheader("Provider Usage")
    # Sample data - in real app, this would come from your database
    provider_data = {
        "OpenAI": 45,
        "Anthropic": 25,
        "xAI Grok": 20,
        "DeepSeek": 10
    }
    st.bar_chart(provider_data)

with col2:
    st.subheader("Response Times")
    # Sample data
    import pandas as pd
    df = pd.DataFrame({
        'Time': ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        'OpenAI': [1.2, 1.1, 1.3, 1.0, 1.1, 1.2],
        'Anthropic': [1.5, 1.4, 1.6, 1.3, 1.4, 1.5],
        'xAI Grok': [1.8, 1.7, 1.9, 1.6, 1.7, 1.8],
        'DeepSeek': [2.1, 2.0, 2.2, 1.9, 2.0, 2.1]
    })
    st.line_chart(df.set_index('Time'))

# Footer
st.markdown("---")
st.markdown("💡 **FastBite Pro AI Studio** - Powered by NVIDIA Omniverse & Advanced Streamlit")
`;

    // Write the Streamlit app to file
    import('fs').then(fs => {
      fs.writeFileSync('streamlit_app.py', streamlitAppContent);
    });
  }

  // Start Streamlit server
  async startStreamlit(): Promise<void> {
    if (this.isRunning) {
      console.log('Streamlit is already running');
      return;
    }

    return new Promise((resolve, reject) => {
      this.streamlitProcess = spawn('python', ['-m', 'streamlit', 'run', 'streamlit_app.py', '--server.port', this.streamlitPort.toString()], {
        stdio: 'pipe',
        env: { ...process.env, PYTHONPATH: '.pythonlibs' }
      });

      this.streamlitProcess.stdout?.on('data', (data) => {
        const output = data.toString();
        console.log(`Streamlit: ${output}`);
        
        if (output.includes('You can now view your Streamlit app in your browser')) {
          this.isRunning = true;
          resolve();
        }
      });

      this.streamlitProcess.stderr?.on('data', (data) => {
        const error = data.toString();
        console.error(`Streamlit Error: ${error}`);
        
        if (error.includes('Address already in use')) {
          this.streamlitPort = 8502; // Try alternative port
          this.startStreamlit().then(resolve).catch(reject);
          return;
        }
      });

      this.streamlitProcess.on('close', (code) => {
        console.log(`Streamlit process exited with code ${code}`);
        this.isRunning = false;
        this.streamlitProcess = null;
      });

      this.streamlitProcess.on('error', (error) => {
        console.error('Failed to start Streamlit:', error);
        reject(error);
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!this.isRunning) {
          reject(new Error('Streamlit startup timeout'));
        }
      }, 30000);
    });
  }

  // Stop Streamlit server
  async stopStreamlit(): Promise<void> {
    if (this.streamlitProcess) {
      this.streamlitProcess.kill('SIGTERM');
      this.streamlitProcess = null;
      this.isRunning = false;
      console.log('Streamlit server stopped');
    }
  }

  // Setup WebSocket bridge between Streamlit and FastBite Pro
  setupWebSocketBridge(port: number = 8502): void {
    this.wsServer = new WebSocketServer({ port });

    this.wsServer.on('connection', (ws) => {
      console.log('Streamlit WebSocket client connected');

      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message.toString());
          
          switch (data.type) {
            case 'chat':
              await this.handleChatMessage(ws, data);
              break;
            case 'voice':
              await this.handleVoiceMessage(ws, data);
              break;
            case 'image':
              await this.handleImageAnalysis(ws, data);
              break;
            case 'multimodal':
              await this.handleMultimodalRequest(ws, data);
              break;
            default:
              ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(JSON.stringify({ type: 'error', message: error.message }));
        }
      });

      ws.on('close', () => {
        console.log('Streamlit WebSocket client disconnected');
      });
    });

    console.log(`Streamlit WebSocket bridge listening on port ${port}`);
  }

  // Handle chat messages from Streamlit
  private async handleChatMessage(ws: any, data: any): Promise<void> {
    const { message, provider, model } = data;
    
    try {
      const messages: AIMessage[] = [
        { role: 'user', content: message }
      ];
      
      const response = await aiManager.chat(messages, provider, model);
      
      ws.send(JSON.stringify({
        type: 'chat_response',
        response: response.content,
        provider: response.provider,
        model: response.model,
        tokens: response.tokens
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Chat error: ${error.message}`
      }));
    }
  }

  // Handle voice messages from Streamlit
  private async handleVoiceMessage(ws: any, data: any): Promise<void> {
    const { audioData, provider } = data;
    
    try {
      // Convert base64 audio to ArrayBuffer
      const audioBuffer = Buffer.from(audioData, 'base64').buffer;
      
      // Transcribe audio
      const voiceMessage = await aiManager.transcribeAudio(audioBuffer, provider);
      
      // Get AI response
      const messages: AIMessage[] = [
        { role: 'user', content: voiceMessage.text }
      ];
      
      const response = await aiManager.chat(messages, provider);
      
      // Generate speech response
      const speechBuffer = await aiManager.generateSpeech(response.content, provider);
      const speechBase64 = Buffer.from(speechBuffer).toString('base64');
      
      ws.send(JSON.stringify({
        type: 'voice_response',
        transcription: voiceMessage.text,
        response: response.content,
        audioResponse: speechBase64,
        provider: response.provider
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Voice error: ${error.message}`
      }));
    }
  }

  // Handle image analysis from Streamlit
  private async handleImageAnalysis(ws: any, data: any): Promise<void> {
    const { imageData, prompt, provider } = data;
    
    try {
      const response = await aiManager.analyzeImage(imageData, prompt, provider);
      
      ws.send(JSON.stringify({
        type: 'image_analysis',
        analysis: response.content,
        provider: response.provider,
        model: response.model
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Image analysis error: ${error.message}`
      }));
    }
  }

  // Handle multimodal requests from Streamlit
  private async handleMultimodalRequest(ws: any, data: any): Promise<void> {
    const { message, providers } = data;
    
    try {
      const messages: AIMessage[] = [
        { role: 'user', content: message }
      ];
      
      const comparison = await aiManager.compareProviders(messages, providers);
      
      ws.send(JSON.stringify({
        type: 'multimodal_response',
        responses: comparison.responses,
        fastest: comparison.fastest,
        consensus: comparison.consensus
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        message: `Multimodal error: ${error.message}`
      }));
    }
  }

  // Get Streamlit status
  getStatus(): {
    isRunning: boolean;
    port: number;
    url: string;
  } {
    return {
      isRunning: this.isRunning,
      port: this.streamlitPort,
      url: `http://localhost:${this.streamlitPort}`
    };
  }

  // Restart Streamlit
  async restartStreamlit(): Promise<void> {
    await this.stopStreamlit();
    await this.startStreamlit();
  }
}

// Singleton instance
export const streamlitIntegration = new StreamlitIntegration();
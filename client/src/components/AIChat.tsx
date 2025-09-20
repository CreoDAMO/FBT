
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Mic, 
  MicOff, 
  Image, 
  Settings, 
  Bot, 
  User,
  Loader2,
  Upload,
  VolumeX,
  Volume2
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  provider?: string;
  model?: string;
  timestamp: Date;
  tokens?: number;
}

interface AIProvider {
  id: string;
  name: string;
  models: string[];
  capabilities: string[];
}

const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    capabilities: ['chat', 'image', 'voice', 'tts']
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    models: ['claude-sonnet-4-20250514', 'claude-3-7-sonnet-20250219'],
    capabilities: ['chat', 'image', 'sentiment', 'summarization']
  },
  {
    id: 'xai',
    name: 'xAI Grok',
    models: ['grok-2-1212', 'grok-2-vision-1212'],
    capabilities: ['chat', 'image', 'realtime', 'code-generation', 'witty']
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    capabilities: ['chat', 'reasoning', 'math', 'code-review']
  }
];

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const currentProvider = AI_PROVIDERS.find(p => p.id === selectedProvider);
  const availableModels = currentProvider?.models || [];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Update model when provider changes
    if (currentProvider && !availableModels.includes(selectedModel)) {
      setSelectedModel(availableModels[0] || '');
    }
  }, [selectedProvider, availableModels, selectedModel, currentProvider]);

  const sendMessage = async () => {
    if (!inputValue.trim() && !uploadedImage) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: inputValue }],
          provider: selectedProvider,
          model: selectedModel,
          imageData: uploadedImage,
          temperature,
          maxTokens
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        provider: data.provider,
        model: data.model,
        tokens: data.tokens,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure the API keys are configured in the environment variables.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setUploadedImage(null);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
        // Send to voice transcription endpoint
        try {
          const response = await fetch('/api/ai/voice/transcribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              audioData: base64Audio,
              provider: selectedProvider
            }),
          });
          
          const data = await response.json();
          setInputValue(data.text || '');
        } catch (error) {
          console.error('Voice transcription error:', error);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error starting voice recording:', error);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setUploadedImage(base64.split(',')[1]); // Remove data:image/... prefix
      };
      reader.readAsDataURL(file);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Chat - {currentProvider?.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedModel}</Badge>
                  <Button variant="outline" size="sm" onClick={clearChat}>
                    Clear
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Start a conversation with AI</p>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.role === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                          <span className="text-xs opacity-75">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        
                        {message.provider && (
                          <div className="flex items-center gap-2 mt-2 text-xs opacity-75">
                            <Badge variant="secondary" className="text-xs">
                              {message.provider}
                            </Badge>
                            {message.tokens && (
                              <span>{message.tokens} tokens</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {uploadedImage && (
                <div className="mt-4 p-2 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Image attached</p>
                  <img 
                    src={`data:image/jpeg;base64,${uploadedImage}`} 
                    alt="Uploaded" 
                    className="max-h-32 rounded"
                  />
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    disabled={isLoading}
                  />
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || !currentProvider?.capabilities.includes('image')}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  disabled={isLoading || !currentProvider?.capabilities.includes('voice')}
                  className={isRecording ? 'bg-red-100' : ''}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                
                <Button 
                  onClick={sendMessage} 
                  disabled={isLoading || (!inputValue.trim() && !uploadedImage)}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>AI Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Provider</label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_PROVIDERS.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Model</label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Temperature: {temperature}</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Max Tokens: {maxTokens}</label>
                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="100"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="flex-1">
          <div className="grid gap-4">
            {AI_PROVIDERS.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {provider.name}
                    <Badge variant={selectedProvider === provider.id ? "default" : "secondary"}>
                      {selectedProvider === provider.id ? "Active" : "Available"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <strong>Models:</strong> {provider.models.join(", ")}
                    </div>
                    <div>
                      <strong>Capabilities:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {provider.capabilities.map((cap) => (
                          <Badge key={cap} variant="outline" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

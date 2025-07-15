import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, MicOff, Send, Bot, User, Image, Volume2, VolumeX, Zap, Brain } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  provider?: string;
  model?: string;
  timestamp: Date;
}

interface AIProvider {
  name: string;
  isHealthy: boolean;
  capabilities: string[];
}

const PROVIDER_ICONS = {
  openai: '🤖',
  anthropic: '🧠',
  xai: '⚡',
  deepseek: '🔍'
};

const PROVIDER_COLORS = {
  openai: 'bg-green-500',
  anthropic: 'bg-orange-500',
  xai: 'bg-purple-500',
  deepseek: 'bg-red-500'
};

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('openai');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const response = await apiRequest('/api/ai/providers');
      setProviders(response);
      if (response.length > 0) {
        setSelectedProvider(response[0].name.toLowerCase());
      }
    } catch (error) {
      console.error('Failed to load providers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load AI providers',
        variant: 'destructive'
      });
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() && !imageFile) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response;
      
      if (imageFile) {
        // Image analysis
        const base64Image = await fileToBase64(imageFile);
        response = await apiRequest('/api/ai/image/analyze', {
          method: 'POST',
          body: JSON.stringify({
            imageData: base64Image,
            prompt: inputMessage || 'Describe what you see in this image.',
            provider: selectedProvider,
            model: selectedModel
          }),
          headers: { 'Content-Type': 'application/json' }
        });
        
        setImageFile(null);
        setImagePreview('');
      } else {
        // Text chat
        response = await apiRequest('/api/ai/chat', {
          method: 'POST',
          body: JSON.stringify({
            message: inputMessage,
            provider: selectedProvider,
            model: selectedModel,
            sessionId: sessionId || undefined,
            isVoiceEnabled
          }),
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (response.sessionId && !sessionId) {
        setSessionId(response.sessionId);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: imageFile ? response.analysis : response.response,
        provider: response.provider,
        model: response.model,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Text-to-speech if voice is enabled
      if (isVoiceEnabled && response.response) {
        await playAudioResponse(response.response);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get AI response',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const playAudioResponse = async (text: string) => {
    try {
      const response = await apiRequest('/api/ai/voice/synthesize', {
        method: 'POST',
        body: JSON.stringify({
          text,
          provider: selectedProvider,
          voice: 'alloy'
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const audioBlob = new Blob([
        Uint8Array.from(atob(response.audioData), c => c.charCodeAt(0))
      ], { type: 'audio/mpeg' });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Text-to-speech error:', error);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result?.toString().split(',')[1];
        resolve(base64 || '');
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      // Implementation for recording would go here
      toast({
        title: 'Recording Started',
        description: 'Voice recording feature is being developed'
      });
    } catch (error) {
      console.error('Recording error:', error);
      toast({
        title: 'Error',
        description: 'Failed to start recording',
        variant: 'destructive'
      });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Implementation for stopping recording would go here
  };

  const compareProviders = async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    try {
      const response = await apiRequest('/api/ai/compare', {
        method: 'POST',
        body: JSON.stringify({
          message: inputMessage,
          providers: providers.filter(p => p.isHealthy).map(p => p.name.toLowerCase())
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      // Display comparison results
      const comparisonMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `**Multi-Provider Comparison:**\n\n${response.responses.map((r: any, index: number) => 
          `**${r.provider.toUpperCase()}:** ${r.response.content}`
        ).join('\n\n')}\n\n**Fastest:** ${response.fastest.toUpperCase()}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, comparisonMessage]);
      setInputMessage('');
    } catch (error) {
      console.error('Comparison error:', error);
      toast({
        title: 'Error',
        description: 'Failed to compare providers',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderModels = (provider: string) => {
    const modelOptions = {
      openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
      anthropic: ['claude-sonnet-4-20250514', 'claude-3-7-sonnet-20250219'],
      xai: ['grok-2-1212', 'grok-2-vision-1212'],
      deepseek: ['deepseek-chat', 'deepseek-reasoner']
    };
    return modelOptions[provider as keyof typeof modelOptions] || [];
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Chat Studio
          </CardTitle>
          
          <div className="flex gap-4 flex-wrap">
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map(provider => (
                  <SelectItem key={provider.name} value={provider.name.toLowerCase()}>
                    <div className="flex items-center gap-2">
                      <span>{PROVIDER_ICONS[provider.name.toLowerCase() as keyof typeof PROVIDER_ICONS]}</span>
                      <span>{provider.name}</span>
                      {provider.isHealthy && (
                        <div className={`w-2 h-2 rounded-full ${PROVIDER_COLORS[provider.name.toLowerCase() as keyof typeof PROVIDER_COLORS]}`} />
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {getProviderModels(selectedProvider).map(model => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={isVoiceEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Voice
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 mb-4 p-4 border rounded-md">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {message.role === 'user' ? 'You' : message.provider?.toUpperCase()}
                      </span>
                      {message.model && (
                        <Badge variant="secondary" className="text-xs">
                          {message.model}
                        </Badge>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span>AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {imagePreview && (
            <div className="mb-4 p-2 border rounded-md">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-32 rounded"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview('');
                }}
              >
                Remove
              </Button>
            </div>
          )}

          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="voice">Voice</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="flex-1"
                  rows={3}
                />
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || (!inputMessage.trim() && !imageFile)}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="voice" className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  size="lg"
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
              </div>
              <p className="text-center text-sm text-gray-500">
                Voice features are in development. Click the microphone to start recording.
              </p>
            </TabsContent>

            <TabsContent value="compare" className="space-y-4">
              <Textarea
                placeholder="Enter a message to compare across all AI providers..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="w-full"
                rows={3}
              />
              <Button
                onClick={compareProviders}
                disabled={isLoading || !inputMessage.trim()}
                className="w-full"
              >
                <Brain className="w-4 h-4 mr-2" />
                Compare All Providers
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
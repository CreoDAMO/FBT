import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, MessageSquare, Mic, Image, BarChart3, Settings, Zap } from 'lucide-react';
import AIChat from '@/components/AIChat';

export default function AIStudio() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Studio</h1>
        <p className="text-gray-600">Advanced AI capabilities with multiple providers</p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="vision" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Vision
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="streamlit" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Streamlit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <AIChat />
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice AI Interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Mic className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Voice AI Features</h3>
                <p className="text-gray-600 mb-6">
                  Experience natural voice conversations with multiple AI providers
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Speech-to-Text</h4>
                    <p className="text-sm text-gray-600">Convert your voice to text using OpenAI Whisper</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Text-to-Speech</h4>
                    <p className="text-sm text-gray-600">Convert AI responses to natural speech</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Voice Commands</h4>
                    <p className="text-sm text-gray-600">Control the interface with voice commands</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Multi-Language</h4>
                    <p className="text-sm text-gray-600">Support for multiple languages and accents</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vision" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Vision AI Interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Image className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Computer Vision Features</h3>
                <p className="text-gray-600 mb-6">
                  Upload images and get detailed analysis from AI providers
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Image Description</h4>
                    <p className="text-sm text-gray-600">Get detailed descriptions of images</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Object Detection</h4>
                    <p className="text-sm text-gray-600">Identify objects, people, and scenes</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Text Extraction</h4>
                    <p className="text-sm text-gray-600">Extract text from images (OCR)</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Food Recognition</h4>
                    <p className="text-sm text-gray-600">Identify food items and ingredients</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Brand Detection</h4>
                    <p className="text-sm text-gray-600">Recognize brands and logos</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Quality Assessment</h4>
                    <p className="text-sm text-gray-600">Assess image quality and composition</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-gray-500">+12% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2s</div>
                <p className="text-xs text-gray-500">-0.3s from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.8%</div>
                <p className="text-xs text-gray-500">+0.2% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45.67</div>
                <p className="text-xs text-gray-500">+$8.23 from last week</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Provider Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>OpenAI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Anthropic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <span className="text-sm">30%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>xAI Grok</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <span className="text-sm">15%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>DeepSeek</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="text-sm">10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Agents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Bot className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">AI Agent Management</h3>
                <p className="text-gray-600 mb-6">
                  Create and manage specialized AI agents for different tasks
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Customer Service Agent</h4>
                    <p className="text-sm text-gray-600">Handle customer inquiries and support</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Menu Recommendation Agent</h4>
                    <p className="text-sm text-gray-600">Suggest menu items based on preferences</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Order Processing Agent</h4>
                    <p className="text-sm text-gray-600">Process and manage food orders</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Analytics Agent</h4>
                    <p className="text-sm text-gray-600">Analyze business data and trends</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streamlit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Streamlit Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Zap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Enhanced UI/UX with Streamlit</h3>
                <p className="text-gray-600 mb-6">
                  Access advanced data visualization and interactive components
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Interactive Dashboards</h4>
                    <p className="text-sm text-gray-600">Real-time data visualization and metrics</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Advanced Charts</h4>
                    <p className="text-sm text-gray-600">Complex data analysis and reporting</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">ML Model Interface</h4>
                    <p className="text-sm text-gray-600">Interact with machine learning models</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Data Upload</h4>
                    <p className="text-sm text-gray-600">Upload and process data files</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Custom Components</h4>
                    <p className="text-sm text-gray-600">Build custom UI components</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Real-time Updates</h4>
                    <p className="text-sm text-gray-600">Live data streaming and updates</p>
                  </div>
                </div>
                <div className="mt-8">
                  <iframe
                    src="http://localhost:8501"
                    width="100%"
                    height="600"
                    className="border rounded-lg"
                    title="Streamlit App"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
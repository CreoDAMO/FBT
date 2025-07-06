import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Building, 
  Globe, 
  Zap,
  PieChart,
  BarChart3,
  Activity,
  Settings,
  Rocket,
  Crown,
  Package,
  Monitor,
  Palette,
  Code,
  Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { whiteLabelService, WhiteLabelConfig, InvestorMetrics } from "@/lib/whitelabel";
import { agentKitService } from "@/lib/agentkit";
import { onchainKitService } from "@/lib/onchainkit";

export default function InvestorDashboard() {
  const { toast } = useToast();
  const [investorMetrics, setInvestorMetrics] = useState<InvestorMetrics | null>(null);
  const [whiteLabelConfigs, setWhiteLabelConfigs] = useState<WhiteLabelConfig[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'month' | 'quarter' | 'year'>('month');
  const [newClientName, setNewClientName] = useState("");
  const [newClientDomain, setNewClientDomain] = useState("");
  const [loading, setLoading] = useState("");

  useEffect(() => {
    loadInvestorData();
  }, [selectedTimeframe]);

  const loadInvestorData = async () => {
    try {
      const metrics = await whiteLabelService.getInvestorMetrics(selectedTimeframe);
      setInvestorMetrics(metrics);
      
      const configs = whiteLabelService.getAllConfigurations();
      setWhiteLabelConfigs(configs);
    } catch (error) {
      console.error("Failed to load investor data:", error);
    }
  };

  const createWhiteLabelInstance = async () => {
    if (!newClientName || !newClientDomain) {
      toast({
        title: "Missing Information",
        description: "Please provide client name and domain",
        variant: "destructive"
      });
      return;
    }

    setLoading("creating");
    try {
      // Validate domain first
      const validation = await whiteLabelService.validateDomain(newClientDomain);
      if (!validation.available) {
        toast({
          title: "Domain Not Available",
          description: `Try: ${validation.suggestions?.join(', ')}`,
          variant: "destructive"
        });
        setLoading("");
        return;
      }

      // Create white label configuration
      const config = await whiteLabelService.createWhiteLabelConfig({
        name: newClientName,
        domain: newClientDomain,
        branding: {
          logo: '/default-logo.png',
          favicon: '/default-favicon.ico',
          primaryColor: '#6366f1',
          secondaryColor: '#8b5cf6',
          accentColor: '#ec4899',
          fontFamily: 'Inter'
        },
        pricing: {
          plan: 'professional',
          monthlyFee: 299,
          transactionFee: 2.5,
          customRates: false,
          revenueShare: 15
        }
      });

      // Deploy the instance
      const deployment = await whiteLabelService.deployInstance(config.organizationId);
      
      toast({
        title: "White Label Instance Created",
        description: `Deploying to ${config.domain}...`
      });

      setNewClientName("");
      setNewClientDomain("");
      loadInvestorData();
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading("");
  };

  if (!investorMetrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading investor dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-content p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Investor Dashboard</h1>
          <p className="text-muted-foreground">White label business metrics and client management</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedTimeframe} onValueChange={(value: any) => setSelectedTimeframe(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <TrendingUp className="w-4 h-4 mr-1" />
            Growing
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="white-label">White Label</TabsTrigger>
          <TabsTrigger value="agentkit">AgentKit</TabsTrigger>
          <TabsTrigger value="onchainkit">OnchainKit</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${investorMetrics.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-green-600">+{investorMetrics.growthRate}% growth</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Recurring</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${investorMetrics.monthlyRecurring.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">ARR: ${(investorMetrics.monthlyRecurring * 12).toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{investorMetrics.activeClients}</div>
                <p className="text-xs text-red-600">{investorMetrics.churnRate}% churn rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(investorMetrics.transactionVolume / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-muted-foreground">Processing volume</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Income sources and distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>White Label Subscriptions</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                  
                  <div className="flex justify-between">
                    <span>Transaction Fees</span>
                    <span className="font-semibold">22%</span>
                  </div>
                  <Progress value={22} className="h-2" />
                  
                  <div className="flex justify-between">
                    <span>Custom Development</span>
                    <span className="font-semibold">7%</span>
                  </div>
                  <Progress value={7} className="h-2" />
                  
                  <div className="flex justify-between">
                    <span>Support & Maintenance</span>
                    <span className="font-semibold">3%</span>
                  </div>
                  <Progress value={3} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Customer Acquisition Cost</span>
                    <span className="font-semibold">$420</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer Lifetime Value</span>
                    <span className="font-semibold">$8,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LTV/CAC Ratio</span>
                    <span className="font-semibold text-green-600">20:1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Deal Size</span>
                    <span className="font-semibold">$3,588</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Revenue Retention</span>
                    <span className="font-semibold text-green-600">118%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Client Portfolio</CardTitle>
                <CardDescription>Active white label deployments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {whiteLabelConfigs.length > 0 ? (
                  whiteLabelConfigs.map((config) => (
                    <div key={config.organizationId} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{config.name}</h3>
                          <p className="text-sm text-muted-foreground">{config.domain}</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {config.pricing.plan}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Monthly Fee</p>
                          <p className="font-semibold">${config.pricing.monthlyFee}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Transaction Fee</p>
                          <p className="font-semibold">{config.pricing.transactionFee}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Revenue Share</p>
                          <p className="font-semibold">{config.pricing.revenueShare}%</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Building className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-muted-foreground">No clients yet. Create your first white label instance.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Create New Client</CardTitle>
                <CardDescription>Deploy new white label instance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name</Label>
                  <Input
                    id="client-name"
                    placeholder="Acme Food Delivery"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-domain">Domain</Label>
                  <Input
                    id="client-domain"
                    placeholder="acme-food"
                    value={newClientDomain}
                    onChange={(e) => setNewClientDomain(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Will create: {newClientDomain}.fastbite.app</p>
                </div>
                <Button 
                  onClick={createWhiteLabelInstance}
                  disabled={loading === "creating" || !newClientName || !newClientDomain}
                  className="w-full"
                >
                  {loading === "creating" ? "Creating..." : "Create Instance"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="white-label" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>White Label Platform</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">Enterprise</Badge>
              </CardTitle>
              <CardDescription>
                Complete white labeling solution for FastBite Pro platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Monitor className="w-4 h-4" />
                      <span>Custom Branding</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Custom logos & favicons</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Brand color schemes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Custom fonts & CSS</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Domain customization</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Code className="w-4 h-4" />
                      <span>Feature Control</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Module selection</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Payment methods</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>API access control</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Custom integrations</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Enterprise Security</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>SSL certificates</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>RBAC & permissions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Compliance tools</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Audit logging</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Deployment Process</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Configuration Setup</p>
                        <p className="text-sm text-muted-foreground">Brand settings and feature selection</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Infrastructure Deployment</p>
                        <p className="text-sm text-muted-foreground">Automated cloud provisioning</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Domain & SSL Setup</p>
                        <p className="text-sm text-muted-foreground">Custom domain with SSL certificate</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-green-600">4</span>
                      </div>
                      <div>
                        <p className="font-medium">Go Live</p>
                        <p className="text-sm text-muted-foreground">Platform ready for production use</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing Tiers</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Starter</h4>
                        <Badge variant="outline">$199/mo</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Basic features, 3% transaction fee</p>
                    </div>
                    <div className="border rounded-lg p-4 border-blue-200 bg-blue-50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Professional</h4>
                        <Badge className="bg-blue-600">$299/mo</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Full features, 2.5% transaction fee</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Enterprise</h4>
                        <Badge variant="outline">Custom</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Custom rates and dedicated support</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agentkit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Coinbase AgentKit Integration</span>
                <Badge variant="outline" className="bg-orange-50 text-orange-700">Autonomous</Badge>
              </CardTitle>
              <CardDescription>
                AI-powered autonomous Web3 operations for intelligent transaction management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Autonomous Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Smart Payment Processing</p>
                        <p className="text-sm text-muted-foreground">Automated USDC/ETH/FBT payments with optimal routing</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Code className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Smart Contract Automation</p>
                        <p className="text-sm text-muted-foreground">Autonomous contract interactions and deployments</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Cross-Chain Operations</p>
                        <p className="text-sm text-muted-foreground">Intelligent bridge routing and gas optimization</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">Gas Optimization</p>
                        <p className="text-sm text-muted-foreground">AI-powered gas usage analysis and savings</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Actions Executed</span>
                      <span className="font-semibold">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate</span>
                      <span className="font-semibold text-green-600">99.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Execution Time</span>
                      <span className="font-semibold">2.3s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gas Savings Generated</span>
                      <span className="font-semibold text-green-600">15.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Automations</span>
                      <span className="font-semibold">23</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Recent Actions</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>USDC Payment to Driver</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>FBT Staking Reward</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Cross-chain Bridge</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">Processing</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onchainkit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>OnchainKit Integration</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">Seamless UX</Badge>
              </CardTitle>
              <CardDescription>
                Production-ready Web3 UI components for seamless user experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">UI Components</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium">Identity & Avatars</p>
                        <p className="text-sm text-muted-foreground">ENS names, avatars, and address display</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <p className="font-medium">Transaction Components</p>
                        <p className="text-sm text-muted-foreground">Sponsored transactions and status tracking</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Crown className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium">Wallet Integration</p>
                        <p className="text-sm text-muted-foreground">Seamless wallet connection and management</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-medium">Payment Flows</p>
                        <p className="text-sm text-muted-foreground">USDC and FBT token transactions</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Integration Benefits</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-green-600">Gasless Transactions</h4>
                      <p className="text-sm text-muted-foreground">Sponsored transactions for improved UX</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-blue-600">One-Click Payments</h4>
                      <p className="text-sm text-muted-foreground">Streamlined USDC payment processing</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-purple-600">Smart Routing</h4>
                      <p className="text-sm text-muted-foreground">Optimal transaction routing and batching</p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-orange-600">Real-time Status</h4>
                      <p className="text-sm text-muted-foreground">Live transaction status and confirmations</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">98.7%</div>
                  <p className="text-sm text-muted-foreground">Transaction Success Rate</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">1.2s</div>
                  <p className="text-sm text-muted-foreground">Average Confirmation Time</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">$0.02</div>
                  <p className="text-sm text-muted-foreground">Average Gas Cost (USDC)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
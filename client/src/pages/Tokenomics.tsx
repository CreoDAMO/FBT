import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Coins, 
  TrendingUp, 
  Users, 
  Vote, 
  Lock, 
  Gift, 
  ArrowUpRight,
  Wallet,
  PieChart,
  Target,
  Zap,
  Crown,
  Star
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { web3Service } from "@/lib/web3";

// Beautiful FBT Token Logo Component
const FBTLogo = ({ size = 64, className = "" }: { size?: number; className?: string }) => (
  <div className={`relative ${className}`} style={{ width: size, height: size }}>
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="fbtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="fbtGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Main Circle */}
      <circle cx="32" cy="32" r="30" fill="url(#fbtGradient)" />
      <circle cx="32" cy="32" r="30" fill="url(#fbtGlow)" />
      
      {/* Inner Design - Fast Food Elements */}
      <g transform="translate(32, 32)">
        {/* F Letter */}
        <path d="M-8 -12 L-8 12 L-6 12 L-6 2 L2 2 L2 0 L-6 0 L-6 -10 L4 -10 L4 -12 L-8 -12 Z" fill="white" />
        
        {/* B Letter */}
        <path d="M0 -12 L0 12 L8 12 C10 12 12 10 12 8 C12 6 11 5 10 4.5 C11 4 12 3 12 1 C12 -1 10 -3 8 -3 L8 -12 L0 -12 Z M2 -10 L6 -10 C7 -10 8 -9 8 -8 C8 -7 7 -6 6 -6 L2 -6 L2 -10 Z M2 -4 L7 -4 C8 -4 9 -3 9 -2 C9 -1 8 0 7 0 L2 0 L2 -4 Z" fill="white" />
        
        {/* T Letter */}
        <path d="M4 -12 L4 -10 L8 -10 L8 12 L10 12 L10 -10 L14 -10 L14 -12 L4 -12 Z" fill="white" />
        
        {/* Lightning bolt accent */}
        <path d="M-12 -8 L-10 -4 L-12 -4 L-9 2 L-11 -2 L-9 -2 L-12 -8 Z" fill="#fbbf24" />
      </g>
      
      {/* Outer Ring */}
      <circle cx="32" cy="32" r="30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    </svg>
  </div>
);

export default function Tokenomics() {
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const tokenMetrics = {
    totalSupply: "1,000,000,000",
    currentPrice: "$0.024",
    marketCap: "$24,000,000",
    circulatingSupply: "250,000,000",
    stakingAPY: "18.5%",
    totalStaked: "45,000,000"
  };

  const distribution = [
    { name: "Community Rewards", percentage: 35, amount: "350M FBT", color: "bg-blue-500" },
    { name: "Ecosystem Fund", percentage: 25, amount: "250M FBT", color: "bg-purple-500" },
    { name: "Team & Advisors", percentage: 15, amount: "150M FBT", color: "bg-green-500" },
    { name: "Public Sale", percentage: 15, amount: "150M FBT", color: "bg-orange-500" },
    { name: "Liquidity Pool", percentage: 10, amount: "100M FBT", color: "bg-pink-500" }
  ];

  const handleStake = async () => {
    setLoading(true);
    try {
      // This would integrate with actual staking contract
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Staking Successful",
        description: `${stakeAmount} FBT tokens staked successfully`
      });
      setStakeAmount("");
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <div className="section-content p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FBTLogo size={80} />
          <div>
            <h1 className="text-3xl font-bold">$FBT Tokenomics</h1>
            <p className="text-muted-foreground">FastBite Token - Powering the future of food delivery</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{tokenMetrics.currentPrice}</div>
          <div className="text-sm text-muted-foreground">+12.5% (24h)</div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
          <TabsTrigger value="governance">DAO</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Supply</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tokenMetrics.totalSupply}</div>
                <p className="text-xs text-muted-foreground">Fixed supply, deflationary</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tokenMetrics.marketCap}</div>
                <p className="text-xs text-muted-foreground">Fully diluted valuation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Staking APY</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{tokenMetrics.stakingAPY}</div>
                <p className="text-xs text-muted-foreground">Current reward rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Token Distribution</CardTitle>
                <CardDescription>How FBT tokens are allocated across the ecosystem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {distribution.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span>{item.name}</span>
                      </span>
                      <span className="font-semibold">{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">{item.amount}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Token Utility</CardTitle>
                <CardDescription>Multiple use cases within the FastBite ecosystem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Gas Station Payments</p>
                      <p className="text-sm text-muted-foreground">Pay transaction fees in FBT</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Crown className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Premium Membership</p>
                      <p className="text-sm text-muted-foreground">Lower fees and exclusive perks</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Vote className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">DAO Governance</p>
                      <p className="text-sm text-muted-foreground">Vote on platform decisions</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Staking Rewards</p>
                      <p className="text-sm text-muted-foreground">Earn yield by locking tokens</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Stake FBT Tokens</span>
                </CardTitle>
                <CardDescription>
                  Lock your FBT tokens to earn {tokenMetrics.stakingAPY} APY
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stake-amount">Amount to Stake</Label>
                    <Input
                      id="stake-amount"
                      type="number"
                      placeholder="1000"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current APY:</span>
                      <span className="font-semibold text-green-600">{tokenMetrics.stakingAPY}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Lock Period:</span>
                      <span className="font-semibold">30 days minimum</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Estimated Rewards:</span>
                      <span className="font-semibold">
                        {stakeAmount ? ((parseFloat(stakeAmount) * 0.185) / 12).toFixed(2) : "0"} FBT/month
                      </span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleStake} 
                    disabled={loading || !stakeAmount}
                    className="w-full"
                  >
                    {loading ? "Staking..." : "Stake Tokens"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Staking Statistics</CardTitle>
                <CardDescription>Current staking pool information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Staked:</span>
                    <span className="font-semibold">{tokenMetrics.totalStaked} FBT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staking Ratio:</span>
                    <span className="font-semibold">18% of supply</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Stake:</span>
                    <span className="font-semibold">0 FBT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Rewards:</span>
                    <span className="font-semibold text-green-600">0 FBT</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Staking Tiers</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Bronze (1K-10K FBT):</span>
                      <span>15% APY</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Silver (10K-100K FBT):</span>
                      <span>18% APY</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gold (100K+ FBT):</span>
                      <span>22% APY</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="governance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Vote className="w-5 h-5" />
                <span>DAO Governance</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">Active</Badge>
              </CardTitle>
              <CardDescription>
                Participate in FastBite DAO governance and shape the platform's future
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Active Proposals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-sm text-muted-foreground">Currently voting</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Your Voting Power</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-sm text-muted-foreground">Stake FBT to vote</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Treasury</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$2.5M</div>
                    <p className="text-sm text-muted-foreground">Community funds</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent Proposals</h3>
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">FBP-003: Reduce platform fees to 2.5%</h4>
                      <Badge variant="outline" className="bg-green-50 text-green-700">Passed</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Proposal to reduce platform fees from 3% to 2.5% to increase competitiveness
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>For: 85%</span>
                        <span>Against: 15%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">FBP-004: Launch loyalty program</h4>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Implement customer loyalty program with FBT token rewards
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>For: 72%</span>
                        <span>Against: 28%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="w-5 h-5" />
                <span>Reward Programs</span>
              </CardTitle>
              <CardDescription>
                Earn FBT tokens through various platform activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Customer Rewards</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">Order Rewards</p>
                        <p className="text-sm text-muted-foreground">Earn 1% back in FBT</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">Referral Bonus</p>
                        <p className="text-sm text-muted-foreground">50 FBT per referral</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">Review Rewards</p>
                        <p className="text-sm text-muted-foreground">5 FBT per review</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Driver Rewards</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">Delivery Bonus</p>
                        <p className="text-sm text-muted-foreground">2 FBT per delivery</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">Performance Bonus</p>
                        <p className="text-sm text-muted-foreground">Weekly top performer</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">Rating Bonus</p>
                        <p className="text-sm text-muted-foreground">4.8+ rating bonus</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span>Token Analytics</span>
              </CardTitle>
              <CardDescription>
                Comprehensive token metrics and market data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">24h Volume</p>
                  <p className="text-2xl font-bold">$1.2M</p>
                  <p className="text-sm text-green-600">+15.3%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Holders</p>
                  <p className="text-2xl font-bold">12,547</p>
                  <p className="text-sm text-green-600">+245</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Liquidity</p>
                  <p className="text-2xl font-bold">$5.8M</p>
                  <p className="text-sm text-green-600">+8.2%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Market Rank</p>
                  <p className="text-2xl font-bold">#847</p>
                  <p className="text-sm text-green-600">+12</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Price Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>24h Change:</span>
                      <span className="text-green-600 font-semibold">+12.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>7d Change:</span>
                      <span className="text-green-600 font-semibold">+28.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>30d Change:</span>
                      <span className="text-green-600 font-semibold">+156.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>All Time High:</span>
                      <span className="font-semibold">$0.087</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Top Exchanges</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Uniswap V3:</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PancakeSwap:</span>
                      <span className="font-semibold">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SushiSwap:</span>
                      <span className="font-semibold">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Others:</span>
                      <span className="font-semibold">12%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

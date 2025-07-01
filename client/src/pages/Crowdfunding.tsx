import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Calendar, DollarSign, Check } from "lucide-react";

interface Campaign {
  id: number;
  title: string;
  goalAmount: string;
  raisedAmount: string;
  investorCount: number;
  daysLeft: number;
}

export default function Crowdfunding() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  // Mock campaign data
  const mockCampaign = {
    id: 1,
    title: "FastBite Pro Funding Round",
    goalAmount: "5000000",
    raisedAmount: "2250000",
    investorCount: 327,
    daysLeft: 45,
  };

  const progress = (parseFloat(mockCampaign.raisedAmount) / parseFloat(mockCampaign.goalAmount)) * 100;

  const investmentTiers = [
    {
      id: "starter",
      name: "Starter",
      amount: "$500",
      features: [
        "Platform equity",
        "$FBT tokens",
        "Quarterly updates"
      ],
      popular: false,
    },
    {
      id: "growth",
      name: "Growth",
      amount: "$2,500",
      features: [
        "All Starter benefits",
        "Monthly calls",
        "DAO voting rights",
        "Beta access"
      ],
      popular: true,
    },
    {
      id: "venture",
      name: "Venture",
      amount: "$10,000+",
      features: [
        "All Growth benefits",
        "Advisory board seat",
        "White-label licensing",
        "Revenue sharing"
      ],
      popular: false,
    },
  ];

  const handleInvestment = (tierId: string) => {
    setSelectedTier(tierId);
    // In a real implementation, this would open a payment modal
    console.log(`Investment selected: ${tierId}`);
  };

  return (
    <div className="section-content p-6">
      {/* Funding Progress */}
      <Card className="mb-8 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold">FastBite Pro Funding Round</h2>
              <p className="text-blue-200">Disrupt the $0.78T Food Delivery Market</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${(parseFloat(mockCampaign.raisedAmount) / 1000000).toFixed(2)}M</p>
              <p className="text-blue-200">of ${(parseFloat(mockCampaign.goalAmount) / 1000000).toFixed(0)}M goal</p>
            </div>
          </div>
          
          <Progress value={progress} className="mb-4 h-3 bg-blue-800" />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{mockCampaign.investorCount}</p>
              <p className="text-blue-200">Investors</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.round(progress)}%</p>
              <p className="text-blue-200">Funded</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{mockCampaign.daysLeft}</p>
              <p className="text-blue-200">Days Left</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {investmentTiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`relative ${tier.popular ? 'border-2 border-orange-500' : 'border border-gray-200'}`}
          >
            {tier.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">{tier.amount}</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleInvestment(tier.id)}
                className={`w-full ${
                  tier.popular 
                    ? 'bg-orange-500 hover:bg-orange-600' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {tier.id === 'venture' ? 'Contact Us' : 'Invest Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold mb-1">$0.78T</h3>
            <p className="text-gray-600">TAM (15.01% CAGR)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold mb-1">1100%</h3>
            <p className="text-gray-600">Projected EROI</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-12 h-12 text-purple-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold mb-1">39%</h3>
            <p className="text-gray-600">DoorDash Share at Risk</p>
          </CardContent>
        </Card>
      </div>

      {/* Pitch Deck Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Pitch Deck Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {['Market Opportunity', 'Technology Solution', 'Financial Projections', 'Team & Vision'].map((slide, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Slide {index + 1}</span>
                </div>
                <p className="text-sm font-medium">{slide}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              View Full Pitch Deck
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

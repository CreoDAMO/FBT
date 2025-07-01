import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";

export default function Tokenomics() {
  return (
    <div className="section-content p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="w-6 h-6 text-purple-600" />
            <span>$FBT Tokenomics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20">
            <Coins size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">$FBT Tokenomics</h2>
            <p className="text-gray-600">Token distribution, staking rewards, and DAO governance</p>
            <p className="text-sm text-gray-500 mt-4">Features would include token allocation charts, staking interface, DAO voting, and rewards tracking</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";

export default function MerchantHub() {
  return (
    <div className="section-content p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Store className="w-6 h-6 text-blue-600" />
            <span>Merchant Portal</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20">
            <Store size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Merchant Portal</h2>
            <p className="text-gray-600">Restaurant management, menu updates, and analytics</p>
            <p className="text-sm text-gray-500 mt-4">Features would include menu management, order tracking, revenue analytics, and customer insights</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

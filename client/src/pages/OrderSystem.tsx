import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function OrderSystem() {
  return (
    <div className="section-content p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <span>Order Management System</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-20">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Management System</h2>
            <p className="text-gray-600">Customer ordering interface and order tracking dashboard</p>
            <p className="text-sm text-gray-500 mt-4">Features would include order placement, tracking, payment processing, and real-time updates</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

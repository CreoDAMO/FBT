import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Clock, Star, Coins, MapPin, Navigation } from "lucide-react";

interface DriverStats {
  deliveriesToday: number;
  todayEarnings: string;
  rating: number;
  fbtEarned: number;
  onlineTime: string;
}

export default function DriverPortal() {
  // In a real app, this would fetch actual driver data
  const { data: driverStats, isLoading } = useQuery<DriverStats>({
    queryKey: ["/api/drivers/stats"],
    enabled: false, // Disabled for demo
  });

  // Mock data for demonstration
  const mockStats = {
    deliveriesToday: 12,
    todayEarnings: "$247.50",
    rating: 4.92,
    fbtEarned: 847,
    onlineTime: "7h 23m",
  };

  const stats = driverStats || mockStats;

  const driverCards = [
    {
      title: "Deliveries Today",
      value: stats.deliveriesToday.toString(),
      icon: Truck,
      color: "text-green-600",
    },
    {
      title: "Average Rating",
      value: stats.rating.toString(),
      icon: Star,
      color: "text-yellow-500",
    },
    {
      title: "$FBT Earned",
      value: stats.fbtEarned.toString(),
      icon: Coins,
      color: "text-purple-600",
    },
    {
      title: "Online Time",
      value: stats.onlineTime,
      icon: Clock,
      color: "text-blue-600",
    },
  ];

  const activeOrders = [
    {
      id: "12847",
      restaurant: "Maria's Tacos",
      address: "1234 Oak Street",
      status: "Pickup",
      eta: "12 mins",
      amount: "$18.50",
    },
    {
      id: "12848",
      restaurant: "Pizza Palace",
      address: "5678 Main Ave",
      status: "Delivery",
      eta: "8 mins",
      amount: "$32.25",
    },
  ];

  return (
    <div className="section-content p-6">
      {/* Driver Dashboard Header */}
      <Card className="mb-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Driver Dashboard</h2>
              <p className="text-green-200">Manage your delivery schedule and earnings</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-200">Today's Earnings</p>
              <p className="text-3xl font-bold">{stats.todayEarnings}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {driverCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="metric-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <Icon className={`${card.color}`} size={20} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Orders & Route Optimization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Order #{order.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'Pickup' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <MapPin size={12} className="mr-1" />
                    {order.restaurant} → {order.address}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">ETA: {order.eta}</span>
                    <span className="font-semibold text-green-600">{order.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Route Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Navigation size={20} />
              <span>Orion AI Route Optimization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center text-gray-500">
                <Navigation size={48} className="mx-auto mb-2" />
                <p>AI-optimized route visualization</p>
                <p className="text-sm">Would integrate GPS navigation</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Distance</span>
                <span className="font-medium">12.4 miles</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estimated Time</span>
                <span className="font-medium">45 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fuel Savings</span>
                <span className="font-medium text-green-600">$4.20</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

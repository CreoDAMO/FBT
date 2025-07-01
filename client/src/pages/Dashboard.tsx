import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Truck, DollarSign, Coins, TrendingUp, UserPlus, Award } from "lucide-react";

interface DashboardMetrics {
  totalOrders: number;
  activeDrivers: number;
  revenue: string;
  fbtStaked: string;
}

export default function Dashboard() {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Total Orders",
      value: metrics?.totalOrders.toLocaleString() || "0",
      change: "+12.5% from last month",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Drivers",
      value: metrics?.activeDrivers.toString() || "0",
      change: "+8.3% from last week",
      icon: Truck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Revenue (USDC)",
      value: `$${parseFloat(metrics?.revenue || "0").toLocaleString()}`,
      change: "+22.1% from last month",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "$FBT Staked",
      value: `${parseFloat(metrics?.fbtStaked || "0").toLocaleString()}K`,
      change: "73% of supply",
      icon: Coins,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const recentActivity = [
    {
      icon: ShoppingCart,
      title: "New order #12847 from Maria's Tacos",
      time: "2 minutes ago",
      amount: "$24.50 USDC",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: UserPlus,
      title: "Driver Alex Johnson joined the platform",
      time: "15 minutes ago",
      amount: "Background verified",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Coins,
      title: "$FBT rewards distributed to 127 drivers",
      time: "1 hour ago",
      amount: "15,000 $FBT total",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="section-content p-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="metric-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-sm text-green-600">{card.change}</p>
                  </div>
                  <div className={`p-3 ${card.bgColor} rounded-full`}>
                    <Icon className={`${card.color}`} size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Real-time Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Order Volume Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <TrendingUp size={48} className="mx-auto mb-2" />
                <p>Interactive chart integration pending</p>
                <p className="text-sm">Would integrate Chart.js or Recharts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Map */}
        <Card>
          <CardHeader>
            <CardTitle>Live Delivery Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Truck size={48} className="mx-auto mb-2" />
                <p>Real-time map integration pending</p>
                <p className="text-sm">Would integrate Mapbox or Google Maps</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Platform Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center`}>
                    <Icon className={activity.iconColor} size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time} • {activity.amount}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

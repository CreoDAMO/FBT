import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Clock, 
  CheckCircle, 
  Truck,
  MapPin,
  Star,
  Filter
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  cuisineType: string;
  isActive: boolean;
  deliveryRadius: number;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  restaurantId: number;
  isAvailable: boolean;
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface Order {
  id: number;
  orderNumber: string;
  restaurantId: number;
  status: string;
  totalAmount: string;
  deliveryAddress: string;
  specialInstructions: string;
  createdAt: string;
}

const ORDER_STATUSES = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  preparing: { label: "Preparing", color: "bg-orange-100 text-orange-800" },
  ready: { label: "Ready for Pickup", color: "bg-purple-100 text-purple-800" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" }
};

export default function OrderSystem() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState("browse");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch restaurants
  const { data: restaurants = [], isLoading: loadingRestaurants } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
  });

  // Fetch menu items for selected restaurant
  const { data: menuItems = [], isLoading: loadingMenu } = useQuery<MenuItem[]>({
    queryKey: ["/api/restaurants", selectedRestaurant?.id, "menu"],
    enabled: !!selectedRestaurant,
  });

  // Fetch user orders
  const { data: orders = [], isLoading: loadingOrders } = useQuery<Order[]>({
    queryKey: ["/api/orders", "customer", user?.id],
    enabled: !!user,
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error("Failed to place order");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Order placed successfully!",
      });
      setCart([]);
      setActiveTab("orders");
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    },
  });

  const addToCart = (menuItem: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { menuItem, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (menuItemId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.menuItem.id === menuItemId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.menuItem.id === menuItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prev.filter(item => item.menuItem.id !== menuItemId);
      }
    });
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + parseFloat(item.menuItem.price) * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (!selectedRestaurant || cart.length === 0) return;

    const orderData = {
      restaurantId: selectedRestaurant.id,
      customerId: user?.id,
      orderNumber: `ORD-${Date.now()}`,
      totalAmount: cartTotal.toFixed(2),
      deliveryAddress: "123 Customer Street", // In real app, get from user
      specialInstructions: "",
      items: cart.map(item => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity,
        price: item.menuItem.price,
      })),
    };

    placeOrderMutation.mutate(orderData);
  };

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loadingRestaurants) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Restaurants</TabsTrigger>
          <TabsTrigger value="menu">Menu & Cart</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Card 
                key={restaurant.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedRestaurant?.id === restaurant.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  setSelectedRestaurant(restaurant);
                  setActiveTab("menu");
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{restaurant.name}</span>
                    <Badge variant={restaurant.isActive ? "default" : "secondary"}>
                      {restaurant.isActive ? "Open" : "Closed"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">{restaurant.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{restaurant.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Delivery in ~30 mins</span>
                  </div>
                  <div className="mt-3">
                    <Badge variant="outline">{restaurant.cuisineType}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          {selectedRestaurant ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Menu Items */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedRestaurant.name} Menu</CardTitle>
                  </CardHeader>
                </Card>

                {Object.entries(groupedMenuItems).map(([category, items]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="text-lg">{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            <p className="font-bold text-green-600">${item.price}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center">
                              {cart.find(cartItem => cartItem.menuItem.id === item.id)?.quantity || 0}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCart(item)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Cart */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Cart ({cart.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cart.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.menuItem.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{item.menuItem.name}</p>
                              <p className="text-sm text-gray-600">
                                ${item.menuItem.price} x {item.quantity}
                              </p>
                            </div>
                            <p className="font-bold">
                              ${(parseFloat(item.menuItem.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                          </div>
                          <Button 
                            className="w-full mt-4" 
                            onClick={handlePlaceOrder}
                            disabled={placeOrderMutation.isPending}
                          >
                            {placeOrderMutation.isPending ? "Placing Order..." : "Place Order"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-20">
                <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Select a Restaurant</h2>
                <p className="text-gray-600">Choose a restaurant from the Browse tab to view their menu</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          {loadingOrders ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-20">
                <Clock size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
                <p className="text-gray-600">Your order history will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold">Order #{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]?.color}>
                        {ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]?.label}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Amount</p>
                        <p className="font-bold">${order.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Delivery Address</p>
                        <p>{order.deliveryAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Special Instructions</p>
                        <p>{order.specialInstructions || "None"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

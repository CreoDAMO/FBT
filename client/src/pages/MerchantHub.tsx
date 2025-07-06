import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Store, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  ShoppingCart, 
  Clock, 
  Users,
  Star,
  TrendingUp,
  Package,
  Settings
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
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

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  totalAmount: string;
  status: string;
  deliveryAddress: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  menuItemName: string;
  quantity: number;
  price: string;
}

const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  isAvailable: z.boolean().default(true),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

const ORDER_STATUSES = {
  pending: { label: "New Order", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  preparing: { label: "Preparing", color: "bg-orange-100 text-orange-800" },
  ready: { label: "Ready", color: "bg-purple-100 text-purple-800" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" }
};

export default function MerchantHub() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [showAddMenuItem, setShowAddMenuItem] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch merchant's restaurant
  const { data: restaurant, isLoading: loadingRestaurant } = useQuery<Restaurant>({
    queryKey: ["/api/restaurants/merchant", user?.id],
    enabled: !!user,
  });

  // Fetch menu items
  const { data: menuItems = [], isLoading: loadingMenu } = useQuery<MenuItem[]>({
    queryKey: ["/api/restaurants", restaurant?.id, "menu"],
    enabled: !!restaurant,
  });

  // Fetch orders
  const { data: orders = [], isLoading: loadingOrders } = useQuery<Order[]>({
    queryKey: ["/api/orders/restaurant", restaurant?.id],
    enabled: !!restaurant,
  });

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      isAvailable: true,
    },
  });

  // Add/Update menu item mutation
  const menuItemMutation = useMutation({
    mutationFn: async (data: MenuItemFormData & { id?: number }) => {
      const url = data.id 
        ? `/api/menu-items/${data.id}` 
        : `/api/menu-items`;
      const method = data.id ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          restaurantId: restaurant?.id,
        }),
      });
      if (!response.ok) throw new Error("Failed to save menu item");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Menu item ${editingMenuItem ? 'updated' : 'added'} successfully!`,
      });
      form.reset();
      setEditingMenuItem(null);
      setShowAddMenuItem(false);
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive",
      });
    },
  });

  // Update order status mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update order");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Order status updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
    form.reset({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isAvailable: item.isAvailable,
    });
    setShowAddMenuItem(true);
  };

  const handleAddMenuItem = () => {
    setEditingMenuItem(null);
    form.reset();
    setShowAddMenuItem(true);
  };

  const onSubmit = (data: MenuItemFormData) => {
    menuItemMutation.mutate({
      ...data,
      id: editingMenuItem?.id,
    });
  };

  const updateOrderStatus = (orderId: number, status: string) => {
    updateOrderMutation.mutate({ orderId, status });
  };

  // Calculate analytics
  const todayOrders = orders.filter(order => 
    new Date(order.createdAt).toDateString() === new Date().toDateString()
  );
  const todayRevenue = todayOrders.reduce((sum, order) => 
    sum + parseFloat(order.totalAmount), 0
  );
  const pendingOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing'].includes(order.status)
  );

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loadingRestaurant) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-20">
            <Store size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Restaurant Found</h2>
            <p className="text-gray-600">Please contact admin to set up your restaurant profile</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
        <p className="text-gray-600">{restaurant.description}</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Orders</p>
                <p className="text-2xl font-bold">{todayOrders.length}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold">${todayRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold">{pendingOrders.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menu Items</p>
                <p className="text-2xl font-bold">{menuItems.length}</p>
              </div>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-bold">Order #{order.orderNumber}</h3>
                          <p className="text-sm text-gray-600">
                            {order.customerName} • ${order.totalAmount}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]?.color}>
                            {ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]?.label}
                          </Badge>
                          {order.status === 'pending' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                          )}
                          {order.status === 'confirmed' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                            >
                              Start Preparing
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                            >
                              Mark Ready
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><strong>Address:</strong> {order.deliveryAddress}</p>
                        <p><strong>Items:</strong> {order.items?.map(item => 
                          `${item.menuItemName} (${item.quantity})`
                        ).join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Menu Management</h2>
            <Button onClick={handleAddMenuItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </div>

          {showAddMenuItem && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Item name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Appetizers, Main Courses" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Item description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        disabled={menuItemMutation.isPending}
                      >
                        {menuItemMutation.isPending 
                          ? "Saving..." 
                          : editingMenuItem ? "Update Item" : "Add Item"
                        }
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowAddMenuItem(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {Object.entries(groupedMenuItems).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                        <p className="font-bold text-green-600">${item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={item.isAvailable ? "default" : "secondary"}>
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditMenuItem(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">Analytics charts would be implemented here</p>
                  <p className="text-sm text-gray-500 mt-2">Revenue trends, order volume, popular items</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Star size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">Popular menu items analysis</p>
                  <p className="text-sm text-gray-500 mt-2">Best selling items, customer preferences</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

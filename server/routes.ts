import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertUserSchema, insertOrderSchema, insertInvestmentSchema, insertSmartContractSchema, insertMenuItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup comprehensive authentication system
  const authenticateJWT = setupAuth(app);

  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Dashboard metrics error:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const { role } = req.query;
      const users = role ? await storage.getUsersByRole(role as string) : [];
      res.json(users);
    } catch (error) {
      console.error("Users fetch error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("User fetch error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Restaurant routes
  app.get("/api/restaurants", async (req, res) => {
    try {
      const restaurants = await storage.getAllRestaurants();
      res.json(restaurants);
    } catch (error) {
      console.error("Restaurants fetch error:", error);
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  });

  app.get("/api/restaurants/:id/menu", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const menuItems = await storage.getMenuItemsByRestaurant(restaurantId);
      res.json(menuItems);
    } catch (error) {
      console.error("Menu fetch error:", error);
      res.status(500).json({ message: "Failed to fetch menu" });
    }
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    try {
      const { customerId, restaurantId, driverId } = req.query;
      let orders = [];
      
      if (customerId) {
        orders = await storage.getOrdersByCustomer(parseInt(customerId as string));
      } else if (restaurantId) {
        orders = await storage.getOrdersByRestaurant(parseInt(restaurantId as string));
      } else if (driverId) {
        orders = await storage.getOrdersByDriver(parseInt(driverId as string));
      } else {
        orders = await storage.getActiveOrders();
      }
      
      res.json(orders);
    } catch (error) {
      console.error("Orders fetch error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const updates = req.body;
      const order = await storage.updateOrder(orderId, updates);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Order update error:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.put("/api/orders/:id", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const updates = req.body;
      const order = await storage.updateOrder(orderId, updates);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Order update error:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Menu item routes
  app.get("/api/restaurants/:restaurantId/menu", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.restaurantId);
      const menuItems = await storage.getMenuItemsByRestaurant(restaurantId);
      res.json(menuItems);
    } catch (error) {
      console.error("Menu items fetch error:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.post("/api/menu-items", async (req, res) => {
    try {
      const menuItemData = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.createMenuItem(menuItemData);
      res.json(menuItem);
    } catch (error) {
      console.error("Menu item creation error:", error);
      res.status(500).json({ message: "Failed to create menu item" });
    }
  });

  app.put("/api/menu-items/:id", async (req, res) => {
    try {
      const menuItemId = parseInt(req.params.id);
      const updates = insertMenuItemSchema.partial().parse(req.body);
      const menuItem = await storage.updateMenuItem(menuItemId, updates);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(menuItem);
    } catch (error) {
      console.error("Menu item update error:", error);
      res.status(500).json({ message: "Failed to update menu item" });
    }
  });

  // Merchant-specific routes
  app.get("/api/restaurants/merchant/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const restaurants = await storage.getRestaurantsByOwner(userId);
      res.json(restaurants[0] || null); // Return first restaurant for merchant
    } catch (error) {
      console.error("Merchant restaurant fetch error:", error);
      res.status(500).json({ message: "Failed to fetch restaurant" });
    }
  });

  app.get("/api/orders/restaurant/:restaurantId", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.restaurantId);
      const orders = await storage.getOrdersByRestaurant(restaurantId);
      res.json(orders);
    } catch (error) {
      console.error("Restaurant orders fetch error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/customer/:customerId", async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const orders = await storage.getOrdersByCustomer(customerId);
      res.json(orders);
    } catch (error) {
      console.error("Customer orders fetch error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Driver routes
  app.get("/api/drivers/available", async (req, res) => {
    try {
      const drivers = await storage.getAvailableDrivers();
      res.json(drivers);
    } catch (error) {
      console.error("Available drivers fetch error:", error);
      res.status(500).json({ message: "Failed to fetch available drivers" });
    }
  });

  app.patch("/api/drivers/:id/location", async (req, res) => {
    try {
      const driverId = parseInt(req.params.id);
      const { location } = req.body;
      const driver = await storage.updateDriver(driverId, { currentLocation: location });
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      res.json(driver);
    } catch (error) {
      console.error("Driver location update error:", error);
      res.status(500).json({ message: "Failed to update driver location" });
    }
  });

  // Crowdfunding routes
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getActiveCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Campaigns fetch error:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const campaign = await storage.getCampaign(campaignId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Campaign fetch error:", error);
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.post("/api/investments", async (req, res) => {
    try {
      const investmentData = insertInvestmentSchema.parse(req.body);
      const investment = await storage.createInvestment(investmentData);
      res.json(investment);
    } catch (error) {
      console.error("Investment creation error:", error);
      res.status(500).json({ message: "Failed to create investment" });
    }
  });

  // Smart contract routes
  app.get("/api/smart-contracts", async (req, res) => {
    try {
      const contracts = await storage.getAllSmartContracts();
      res.json(contracts);
    } catch (error) {
      console.error("Smart contracts fetch error:", error);
      res.status(500).json({ message: "Failed to fetch smart contracts" });
    }
  });

  app.post("/api/smart-contracts", async (req, res) => {
    try {
      const contractData = insertSmartContractSchema.parse(req.body);
      const contract = await storage.createSmartContract(contractData);
      res.json(contract);
    } catch (error) {
      console.error("Smart contract creation error:", error);
      res.status(500).json({ message: "Failed to create smart contract" });
    }
  });

  // Token routes
  app.get("/api/tokens", async (req, res) => {
    try {
      const tokens = await storage.getAllTokens();
      res.json(tokens);
    } catch (error) {
      console.error("Tokens fetch error:", error);
      res.status(500).json({ message: "Failed to fetch tokens" });
    }
  });

  app.get("/api/users/:userId/tokens", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const balances = await storage.getUserTokenBalances(userId);
      res.json(balances);
    } catch (error) {
      console.error("User token balances fetch error:", error);
      res.status(500).json({ message: "Failed to fetch token balances" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/metrics", async (req, res) => {
    try {
      const { type, startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      const metrics = await storage.getMetricsByType(type as string, start, end);
      res.json(metrics);
    } catch (error) {
      console.error("Analytics fetch error:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // WebSocket server for real-time updates
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received WebSocket message:', data);
        
        // Handle different message types
        switch (data.type) {
          case 'subscribe':
            // Subscribe to specific events (orders, driver location, etc.)
            break;
          case 'driver_location':
            // Broadcast driver location updates
            wss.clients.forEach((client) => {
              if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({
                  type: 'driver_location_update',
                  data: data.payload
                }));
              }
            });
            break;
          case 'order_update':
            // Broadcast order status updates
            wss.clients.forEach((client) => {
              if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({
                  type: 'order_status_update',
                  data: data.payload
                }));
              }
            });
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({ type: 'connected', message: 'WebSocket connected successfully' }));
  });

  return httpServer;
}

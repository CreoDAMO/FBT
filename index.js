var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import rateLimit2 from "express-rate-limit";
import { WebSocketServer } from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  aiAgents: () => aiAgents,
  aiAnalytics: () => aiAnalytics,
  aiAnalyticsRelations: () => aiAnalyticsRelations,
  aiChatSessions: () => aiChatSessions,
  aiChatSessionsRelations: () => aiChatSessionsRelations,
  aiMessages: () => aiMessages,
  aiMessagesRelations: () => aiMessagesRelations,
  aiVoiceMessages: () => aiVoiceMessages,
  aiVoiceMessagesRelations: () => aiVoiceMessagesRelations,
  campaigns: () => campaigns,
  campaignsRelations: () => campaignsRelations,
  drivers: () => drivers,
  driversRelations: () => driversRelations,
  insertAiAgentSchema: () => insertAiAgentSchema,
  insertAiAnalyticsSchema: () => insertAiAnalyticsSchema,
  insertAiChatSessionSchema: () => insertAiChatSessionSchema,
  insertAiMessageSchema: () => insertAiMessageSchema,
  insertAiVoiceMessageSchema: () => insertAiVoiceMessageSchema,
  insertCampaignSchema: () => insertCampaignSchema,
  insertDriverSchema: () => insertDriverSchema,
  insertInvestmentSchema: () => insertInvestmentSchema,
  insertMenuItemSchema: () => insertMenuItemSchema,
  insertMetricSchema: () => insertMetricSchema,
  insertOmniverseInteractionSchema: () => insertOmniverseInteractionSchema,
  insertOmniverseSessionSchema: () => insertOmniverseSessionSchema,
  insertOrderItemSchema: () => insertOrderItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertRestaurantSchema: () => insertRestaurantSchema,
  insertSmartContractSchema: () => insertSmartContractSchema,
  insertTokenSchema: () => insertTokenSchema,
  insertUserSchema: () => insertUserSchema,
  insertUserTokenBalanceSchema: () => insertUserTokenBalanceSchema,
  investments: () => investments,
  investmentsRelations: () => investmentsRelations,
  menuItems: () => menuItems,
  menuItemsRelations: () => menuItemsRelations,
  metrics: () => metrics,
  omniverseInteractions: () => omniverseInteractions,
  omniverseInteractionsRelations: () => omniverseInteractionsRelations,
  omniverseSessions: () => omniverseSessions,
  omniverseSessionsRelations: () => omniverseSessionsRelations,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  restaurants: () => restaurants,
  restaurantsRelations: () => restaurantsRelations,
  smartContracts: () => smartContracts,
  smartContractsRelations: () => smartContractsRelations,
  tokens: () => tokens,
  tokensRelations: () => tokensRelations,
  userTokenBalances: () => userTokenBalances,
  userTokenBalancesRelations: () => userTokenBalancesRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("customer"),
  // customer, driver, merchant, admin, investor
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  profileImageUrl: text("profile_image_url"),
  walletAddress: text("wallet_address"),
  authProvider: text("auth_provider").default("email"),
  // email, google, facebook, metamask, coinbase
  kycStatus: text("kyc_status").default("pending"),
  // pending, verified, rejected
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  phone: text("phone"),
  email: text("email"),
  cuisineType: text("cuisine_type"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  operatingHours: jsonb("operating_hours"),
  deliveryRadius: integer("delivery_radius").default(5),
  // miles
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).default("0.0000"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category"),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true),
  preparationTime: integer("preparation_time"),
  // minutes
  calories: integer("calories"),
  allergens: text("allergens").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id).notNull(),
  driverId: integer("driver_id").references(() => users.id),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"),
  // pending, confirmed, preparing, ready, picked_up, delivered, cancelled
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default("0.00"),
  tip: decimal("tip", { precision: 10, scale: 2 }).default("0.00"),
  paymentMethod: text("payment_method"),
  // card, usdc, eth, fbt
  paymentStatus: text("payment_status").default("pending"),
  // pending, paid, refunded
  deliveryAddress: text("delivery_address").notNull(),
  deliveryInstructions: text("delivery_instructions"),
  estimatedDeliveryTime: timestamp("estimated_delivery_time"),
  actualDeliveryTime: timestamp("actual_delivery_time"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  menuItemId: integer("menu_item_id").references(() => menuItems.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  specialInstructions: text("special_instructions")
});
var drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  licenseNumber: text("license_number").notNull(),
  vehicleType: text("vehicle_type"),
  // car, motorcycle, bicycle, scooter
  vehicleMake: text("vehicle_make"),
  vehicleModel: text("vehicle_model"),
  vehicleYear: integer("vehicle_year"),
  licensePlate: text("license_plate"),
  insuranceExpiry: timestamp("insurance_expiry"),
  backgroundCheckStatus: text("background_check_status").default("pending"),
  isOnline: boolean("is_online").default(false),
  currentLocation: jsonb("current_location"),
  // {lat, lng}
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  totalDeliveries: integer("total_deliveries").default(0),
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  goalAmount: decimal("goal_amount", { precision: 15, scale: 2 }).notNull(),
  raisedAmount: decimal("raised_amount", { precision: 15, scale: 2 }).default("0.00"),
  investorCount: integer("investor_count").default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("active"),
  // active, paused, completed, cancelled
  minimumInvestment: decimal("minimum_investment", { precision: 10, scale: 2 }).default("500.00"),
  maximumInvestment: decimal("maximum_investment", { precision: 12, scale: 2 }),
  equityPercentage: decimal("equity_percentage", { precision: 5, scale: 2 }),
  pitchDeckUrl: text("pitch_deck_url"),
  businessPlanUrl: text("business_plan_url"),
  financialProjectionsUrl: text("financial_projections_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  investorId: integer("investor_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method"),
  // stripe, usdc, eth
  transactionHash: text("transaction_hash"),
  status: text("status").default("pending"),
  // pending, confirmed, refunded
  kycCompleted: boolean("kyc_completed").default(false),
  accreditationStatus: text("accreditation_status"),
  // none, pending, verified
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var smartContracts = pgTable("smart_contracts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol"),
  contractType: text("contract_type").notNull(),
  // token, dao, escrow, rewards
  network: text("network").notNull(),
  // base, ethereum, polygon
  contractAddress: text("contract_address").notNull(),
  deployerAddress: text("deployer_address").notNull(),
  deploymentTxHash: text("deployment_tx_hash").notNull(),
  abi: jsonb("abi").notNull(),
  bytecode: text("bytecode"),
  verified: boolean("verified").default(false),
  status: text("status").default("active"),
  // active, paused, deprecated
  totalSupply: text("total_supply"),
  // for tokens
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").references(() => smartContracts.id),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  totalSupply: text("total_supply").notNull(),
  circulatingSupply: text("circulating_supply").default("0"),
  price: decimal("price", { precision: 18, scale: 8 }),
  marketCap: decimal("market_cap", { precision: 20, scale: 2 }),
  stakingRewards: decimal("staking_rewards", { precision: 5, scale: 4 }),
  burnRate: decimal("burn_rate", { precision: 5, scale: 4 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var userTokenBalances = pgTable("user_token_balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  tokenId: integer("token_id").references(() => tokens.id).notNull(),
  balance: text("balance").notNull().default("0"),
  stakedBalance: text("staked_balance").default("0"),
  lastUpdated: timestamp("last_updated").defaultNow()
});
var metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  metricType: text("metric_type").notNull(),
  // orders, revenue, users, etc.
  value: decimal("value", { precision: 20, scale: 8 }).notNull(),
  period: text("period"),
  // daily, weekly, monthly
  date: timestamp("date").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow()
});
var aiChatSessions = pgTable("ai_chat_sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  provider: text("provider").notNull(),
  // openai, anthropic, xai, deepseek
  model: text("model").notNull(),
  isVoiceEnabled: boolean("is_voice_enabled").default(false).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
var aiMessages = pgTable("ai_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").references(() => aiChatSessions.id).notNull(),
  role: text("role").notNull(),
  // system, user, assistant
  content: text("content").notNull(),
  provider: text("provider"),
  model: text("model"),
  tokens: integer("tokens"),
  cost: decimal("cost", { precision: 10, scale: 6 }),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull()
});
var aiVoiceMessages = pgTable("ai_voice_messages", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").references(() => aiChatSessions.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  text: text("text").notNull(),
  audioUrl: text("audio_url"),
  provider: text("provider").notNull(),
  duration: decimal("duration", { precision: 8, scale: 3 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
var aiAgents = pgTable("ai_agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  systemPrompt: text("system_prompt").notNull(),
  provider: text("provider").notNull(),
  model: text("model").notNull(),
  features: text("features").array().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
var aiAnalytics = pgTable("ai_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  provider: text("provider").notNull(),
  model: text("model").notNull(),
  requestType: text("request_type").notNull(),
  // chat, voice, image, etc.
  tokenUsage: integer("token_usage"),
  cost: decimal("cost", { precision: 10, scale: 6 }),
  responseTime: decimal("response_time", { precision: 8, scale: 3 }),
  // in milliseconds
  success: boolean("success").default(true).notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});
var omniverseSessions = pgTable("omniverse_sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  appId: text("app_id").notNull(),
  streamUrl: text("stream_url").notNull(),
  status: text("status").notNull(),
  // active, inactive, error
  config: jsonb("config").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
var omniverseInteractions = pgTable("omniverse_interactions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").references(() => omniverseSessions.id).notNull(),
  interactionType: text("interaction_type").notNull(),
  // input, output, control
  data: jsonb("data").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull()
});
var usersRelations = relations(users, ({ many, one }) => ({
  restaurants: many(restaurants),
  orders: many(orders),
  driverProfile: one(drivers, {
    fields: [users.id],
    references: [drivers.userId]
  }),
  investments: many(investments),
  tokenBalances: many(userTokenBalances),
  aiChatSessions: many(aiChatSessions),
  aiVoiceMessages: many(aiVoiceMessages),
  aiAnalytics: many(aiAnalytics),
  omniverseSessions: many(omniverseSessions)
}));
var restaurantsRelations = relations(restaurants, ({ one, many }) => ({
  owner: one(users, {
    fields: [restaurants.ownerId],
    references: [users.id]
  }),
  menuItems: many(menuItems),
  orders: many(orders)
}));
var menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [menuItems.restaurantId],
    references: [restaurants.id]
  }),
  orderItems: many(orderItems)
}));
var ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id]
  }),
  restaurant: one(restaurants, {
    fields: [orders.restaurantId],
    references: [restaurants.id]
  }),
  driver: one(users, {
    fields: [orders.driverId],
    references: [users.id]
  }),
  orderItems: many(orderItems)
}));
var orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id]
  })
}));
var driversRelations = relations(drivers, ({ one }) => ({
  user: one(users, {
    fields: [drivers.userId],
    references: [users.id]
  })
}));
var campaignsRelations = relations(campaigns, ({ many }) => ({
  investments: many(investments)
}));
var investmentsRelations = relations(investments, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [investments.campaignId],
    references: [campaigns.id]
  }),
  investor: one(users, {
    fields: [investments.investorId],
    references: [users.id]
  })
}));
var smartContractsRelations = relations(smartContracts, ({ many }) => ({
  tokens: many(tokens)
}));
var tokensRelations = relations(tokens, ({ one, many }) => ({
  contract: one(smartContracts, {
    fields: [tokens.contractId],
    references: [smartContracts.id]
  }),
  userBalances: many(userTokenBalances)
}));
var userTokenBalancesRelations = relations(userTokenBalances, ({ one }) => ({
  user: one(users, {
    fields: [userTokenBalances.userId],
    references: [users.id]
  }),
  token: one(tokens, {
    fields: [userTokenBalances.tokenId],
    references: [tokens.id]
  })
}));
var aiChatSessionsRelations = relations(aiChatSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [aiChatSessions.userId],
    references: [users.id]
  }),
  messages: many(aiMessages),
  voiceMessages: many(aiVoiceMessages)
}));
var aiMessagesRelations = relations(aiMessages, ({ one }) => ({
  session: one(aiChatSessions, {
    fields: [aiMessages.sessionId],
    references: [aiChatSessions.id]
  })
}));
var aiVoiceMessagesRelations = relations(aiVoiceMessages, ({ one }) => ({
  session: one(aiChatSessions, {
    fields: [aiVoiceMessages.sessionId],
    references: [aiChatSessions.id]
  }),
  user: one(users, {
    fields: [aiVoiceMessages.userId],
    references: [users.id]
  })
}));
var aiAnalyticsRelations = relations(aiAnalytics, ({ one }) => ({
  user: one(users, {
    fields: [aiAnalytics.userId],
    references: [users.id]
  })
}));
var omniverseSessionsRelations = relations(omniverseSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [omniverseSessions.userId],
    references: [users.id]
  }),
  interactions: many(omniverseInteractions)
}));
var omniverseInteractionsRelations = relations(omniverseInteractions, ({ one }) => ({
  session: one(omniverseSessions, {
    fields: [omniverseInteractions.sessionId],
    references: [omniverseSessions.id]
  })
}));
var insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
var insertRestaurantSchema = createInsertSchema(restaurants).omit({ id: true, createdAt: true, updatedAt: true });
var insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true, createdAt: true, updatedAt: true });
var insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });
var insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
var insertDriverSchema = createInsertSchema(drivers).omit({ id: true, createdAt: true, updatedAt: true });
var insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true, createdAt: true, updatedAt: true });
var insertInvestmentSchema = createInsertSchema(investments).omit({ id: true, createdAt: true, updatedAt: true });
var insertSmartContractSchema = createInsertSchema(smartContracts).omit({ id: true, createdAt: true, updatedAt: true });
var insertTokenSchema = createInsertSchema(tokens).omit({ id: true, createdAt: true, updatedAt: true });
var insertUserTokenBalanceSchema = createInsertSchema(userTokenBalances).omit({ id: true });
var insertMetricSchema = createInsertSchema(metrics).omit({ id: true, createdAt: true });
var insertAiChatSessionSchema = createInsertSchema(aiChatSessions).omit({ createdAt: true, updatedAt: true });
var insertAiMessageSchema = createInsertSchema(aiMessages).omit({ id: true, timestamp: true });
var insertAiVoiceMessageSchema = createInsertSchema(aiVoiceMessages).omit({ createdAt: true });
var insertAiAgentSchema = createInsertSchema(aiAgents).omit({ id: true, createdAt: true, updatedAt: true });
var insertAiAnalyticsSchema = createInsertSchema(aiAnalytics).omit({ id: true, createdAt: true });
var insertOmniverseSessionSchema = createInsertSchema(omniverseSessions).omit({ createdAt: true, updatedAt: true });
var insertOmniverseInteractionSchema = createInsertSchema(omniverseInteractions).omit({ id: true, timestamp: true });

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, and, gte, lte, sum, count } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async updateUser(id, updates) {
    const [user] = await db.update(users).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
    return user || void 0;
  }
  async getUsersByRole(role) {
    return await db.select().from(users).where(eq(users.role, role));
  }
  async getUserByWalletAddress(walletAddress) {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || void 0;
  }
  // Restaurant operations
  async getRestaurant(id) {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return restaurant || void 0;
  }
  async getRestaurantsByOwner(ownerId) {
    return await db.select().from(restaurants).where(eq(restaurants.ownerId, ownerId));
  }
  async createRestaurant(insertRestaurant) {
    const [restaurant] = await db.insert(restaurants).values(insertRestaurant).returning();
    return restaurant;
  }
  async updateRestaurant(id, updates) {
    const [restaurant] = await db.update(restaurants).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(restaurants.id, id)).returning();
    return restaurant || void 0;
  }
  async getAllRestaurants() {
    return await db.select().from(restaurants).where(eq(restaurants.isActive, true));
  }
  // Menu operations
  async getMenuItem(id) {
    const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return menuItem || void 0;
  }
  async getMenuItemsByRestaurant(restaurantId) {
    return await db.select().from(menuItems).where(and(eq(menuItems.restaurantId, restaurantId), eq(menuItems.isAvailable, true)));
  }
  async createMenuItem(insertMenuItem) {
    const [menuItem] = await db.insert(menuItems).values(insertMenuItem).returning();
    return menuItem;
  }
  async updateMenuItem(id, updates) {
    const [menuItem] = await db.update(menuItems).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(menuItems.id, id)).returning();
    return menuItem || void 0;
  }
  // Order operations
  async getOrder(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || void 0;
  }
  async getOrdersByCustomer(customerId) {
    return await db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt));
  }
  async getOrdersByRestaurant(restaurantId) {
    return await db.select().from(orders).where(eq(orders.restaurantId, restaurantId)).orderBy(desc(orders.createdAt));
  }
  async getOrdersByDriver(driverId) {
    return await db.select().from(orders).where(eq(orders.driverId, driverId)).orderBy(desc(orders.createdAt));
  }
  async createOrder(insertOrder) {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }
  async updateOrder(id, updates) {
    const [order] = await db.update(orders).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(orders.id, id)).returning();
    return order || void 0;
  }
  async getActiveOrders() {
    return await db.select().from(orders).where(and(
      eq(orders.status, "confirmed"),
      eq(orders.paymentStatus, "paid")
    )).orderBy(desc(orders.createdAt));
  }
  // Order items operations
  async getOrderItems(orderId) {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
  async createOrderItem(insertOrderItem) {
    const [orderItem] = await db.insert(orderItems).values(insertOrderItem).returning();
    return orderItem;
  }
  // Driver operations
  async getDriver(id) {
    const [driver] = await db.select().from(drivers).where(eq(drivers.id, id));
    return driver || void 0;
  }
  async getDriverByUserId(userId) {
    const [driver] = await db.select().from(drivers).where(eq(drivers.userId, userId));
    return driver || void 0;
  }
  async createDriver(insertDriver) {
    const [driver] = await db.insert(drivers).values(insertDriver).returning();
    return driver;
  }
  async updateDriver(id, updates) {
    const [driver] = await db.update(drivers).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(drivers.id, id)).returning();
    return driver || void 0;
  }
  async getAvailableDrivers() {
    return await db.select().from(drivers).where(and(
      eq(drivers.isOnline, true),
      eq(drivers.backgroundCheckStatus, "approved")
    ));
  }
  // Campaign operations
  async getCampaign(id) {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign || void 0;
  }
  async getAllCampaigns() {
    return await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
  }
  async getActiveCampaigns() {
    return await db.select().from(campaigns).where(eq(campaigns.status, "active")).orderBy(desc(campaigns.createdAt));
  }
  async createCampaign(insertCampaign) {
    const [campaign] = await db.insert(campaigns).values(insertCampaign).returning();
    return campaign;
  }
  async updateCampaign(id, updates) {
    const [campaign] = await db.update(campaigns).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(campaigns.id, id)).returning();
    return campaign || void 0;
  }
  // Investment operations
  async getInvestment(id) {
    const [investment] = await db.select().from(investments).where(eq(investments.id, id));
    return investment || void 0;
  }
  async getInvestmentsByUser(userId) {
    return await db.select().from(investments).where(eq(investments.investorId, userId)).orderBy(desc(investments.createdAt));
  }
  async getInvestmentsByCampaign(campaignId) {
    return await db.select().from(investments).where(eq(investments.campaignId, campaignId)).orderBy(desc(investments.createdAt));
  }
  async createInvestment(insertInvestment) {
    const [investment] = await db.insert(investments).values(insertInvestment).returning();
    return investment;
  }
  async updateInvestment(id, updates) {
    const [investment] = await db.update(investments).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(investments.id, id)).returning();
    return investment || void 0;
  }
  // Smart contract operations
  async getSmartContract(id) {
    const [contract] = await db.select().from(smartContracts).where(eq(smartContracts.id, id));
    return contract || void 0;
  }
  async getSmartContractByAddress(contractAddress) {
    const [contract] = await db.select().from(smartContracts).where(eq(smartContracts.contractAddress, contractAddress));
    return contract || void 0;
  }
  async createSmartContract(insertContract) {
    const [contract] = await db.insert(smartContracts).values(insertContract).returning();
    return contract;
  }
  async updateSmartContract(id, updates) {
    const [contract] = await db.update(smartContracts).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(smartContracts.id, id)).returning();
    return contract || void 0;
  }
  async getAllSmartContracts() {
    return await db.select().from(smartContracts).orderBy(desc(smartContracts.createdAt));
  }
  // Token operations
  async getToken(id) {
    const [token] = await db.select().from(tokens).where(eq(tokens.id, id));
    return token || void 0;
  }
  async getTokenBySymbol(symbol) {
    const [token] = await db.select().from(tokens).where(eq(tokens.symbol, symbol));
    return token || void 0;
  }
  async createToken(insertToken) {
    const [token] = await db.insert(tokens).values(insertToken).returning();
    return token;
  }
  async updateToken(id, updates) {
    const [token] = await db.update(tokens).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(tokens.id, id)).returning();
    return token || void 0;
  }
  async getAllTokens() {
    return await db.select().from(tokens).orderBy(desc(tokens.createdAt));
  }
  // User token balance operations
  async getUserTokenBalance(userId, tokenId) {
    const [balance] = await db.select().from(userTokenBalances).where(and(
      eq(userTokenBalances.userId, userId),
      eq(userTokenBalances.tokenId, tokenId)
    ));
    return balance || void 0;
  }
  async getUserTokenBalances(userId) {
    return await db.select().from(userTokenBalances).where(eq(userTokenBalances.userId, userId));
  }
  async updateUserTokenBalance(userId, tokenId, balanceData) {
    const [balance] = await db.insert(userTokenBalances).values({
      ...balanceData,
      userId,
      tokenId,
      lastUpdated: /* @__PURE__ */ new Date()
    }).onConflictDoUpdate({
      target: [userTokenBalances.userId, userTokenBalances.tokenId],
      set: {
        ...balanceData,
        lastUpdated: /* @__PURE__ */ new Date()
      }
    }).returning();
    return balance;
  }
  // Metrics operations
  async createMetric(insertMetric) {
    const [metric] = await db.insert(metrics).values(insertMetric).returning();
    return metric;
  }
  async getMetricsByType(metricType, startDate, endDate) {
    let query = db.select().from(metrics).where(eq(metrics.metricType, metricType));
    if (startDate && endDate) {
      query = query.where(and(
        eq(metrics.metricType, metricType),
        gte(metrics.date, startDate),
        lte(metrics.date, endDate)
      ));
    }
    return await query.orderBy(desc(metrics.date));
  }
  async getDashboardMetrics() {
    const [orderCount] = await db.select({ count: count() }).from(orders);
    const [driverCount] = await db.select({ count: count() }).from(drivers).where(eq(drivers.isOnline, true));
    const [revenueResult] = await db.select({ total: sum(orders.totalAmount) }).from(orders).where(eq(orders.status, "delivered"));
    const fbtToken = await this.getTokenBySymbol("FBT");
    let fbtStaked = "0";
    if (fbtToken) {
      const [stakedResult] = await db.select({ total: sum(userTokenBalances.stakedBalance) }).from(userTokenBalances).where(eq(userTokenBalances.tokenId, fbtToken.id));
      fbtStaked = stakedResult?.total || "0";
    }
    return {
      totalOrders: orderCount?.count || 0,
      activeDrivers: driverCount?.count || 0,
      revenue: revenueResult?.total || "0",
      fbtStaked
    };
  }
  // AI Chat Session operations
  async getAiChatSession(id) {
    const [session2] = await db.select().from(aiChatSessions).where(eq(aiChatSessions.id, id));
    return session2 || void 0;
  }
  async getAiChatSessionsByUser(userId) {
    return await db.select().from(aiChatSessions).where(eq(aiChatSessions.userId, userId)).orderBy(desc(aiChatSessions.updatedAt));
  }
  async createAiChatSession(session2) {
    const [createdSession] = await db.insert(aiChatSessions).values(session2).returning();
    return createdSession;
  }
  async updateAiChatSession(id, updates) {
    const [session2] = await db.update(aiChatSessions).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(aiChatSessions.id, id)).returning();
    return session2 || void 0;
  }
  async deleteAiChatSession(id) {
    const result = await db.delete(aiChatSessions).where(eq(aiChatSessions.id, id));
    return result.rowCount > 0;
  }
  // AI Message operations
  async getAiMessage(id) {
    const [message] = await db.select().from(aiMessages).where(eq(aiMessages.id, id));
    return message || void 0;
  }
  async getAiMessages(sessionId) {
    return await db.select().from(aiMessages).where(eq(aiMessages.sessionId, sessionId)).orderBy(aiMessages.timestamp);
  }
  async createAiMessage(message) {
    const [createdMessage] = await db.insert(aiMessages).values(message).returning();
    return createdMessage;
  }
  async deleteAiMessage(id) {
    const result = await db.delete(aiMessages).where(eq(aiMessages.id, id));
    return result.rowCount > 0;
  }
  // AI Voice Message operations
  async getAiVoiceMessage(id) {
    const [voiceMessage] = await db.select().from(aiVoiceMessages).where(eq(aiVoiceMessages.id, id));
    return voiceMessage || void 0;
  }
  async getAiVoiceMessages(sessionId) {
    return await db.select().from(aiVoiceMessages).where(eq(aiVoiceMessages.sessionId, sessionId)).orderBy(aiVoiceMessages.createdAt);
  }
  async getAiVoiceMessagesByUser(userId) {
    return await db.select().from(aiVoiceMessages).where(eq(aiVoiceMessages.userId, userId)).orderBy(desc(aiVoiceMessages.createdAt));
  }
  async createAiVoiceMessage(voiceMessage) {
    const [createdVoiceMessage] = await db.insert(aiVoiceMessages).values(voiceMessage).returning();
    return createdVoiceMessage;
  }
  async deleteAiVoiceMessage(id) {
    const result = await db.delete(aiVoiceMessages).where(eq(aiVoiceMessages.id, id));
    return result.rowCount > 0;
  }
  // AI Agent operations
  async getAiAgent(id) {
    const [agent] = await db.select().from(aiAgents).where(eq(aiAgents.id, id));
    return agent || void 0;
  }
  async getAllAiAgents() {
    return await db.select().from(aiAgents).orderBy(desc(aiAgents.createdAt));
  }
  async getActiveAiAgents() {
    return await db.select().from(aiAgents).where(eq(aiAgents.isActive, true)).orderBy(desc(aiAgents.createdAt));
  }
  async createAiAgent(agent) {
    const [createdAgent] = await db.insert(aiAgents).values(agent).returning();
    return createdAgent;
  }
  async updateAiAgent(id, updates) {
    const [agent] = await db.update(aiAgents).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(aiAgents.id, id)).returning();
    return agent || void 0;
  }
  async deleteAiAgent(id) {
    const result = await db.delete(aiAgents).where(eq(aiAgents.id, id));
    return result.rowCount > 0;
  }
  // AI Analytics operations
  async getAiAnalytics(id) {
    const [analytics] = await db.select().from(aiAnalytics).where(eq(aiAnalytics.id, id));
    return analytics || void 0;
  }
  async getAiAnalyticsByUser(userId) {
    return await db.select().from(aiAnalytics).where(eq(aiAnalytics.userId, userId)).orderBy(desc(aiAnalytics.createdAt));
  }
  async getAiAnalyticsByProvider(provider) {
    return await db.select().from(aiAnalytics).where(eq(aiAnalytics.provider, provider)).orderBy(desc(aiAnalytics.createdAt));
  }
  async createAiAnalytics(analytics) {
    const [createdAnalytics] = await db.insert(aiAnalytics).values(analytics).returning();
    return createdAnalytics;
  }
  // Omniverse Session operations
  async getOmniverseSession(id) {
    const [session2] = await db.select().from(omniverseSessions).where(eq(omniverseSessions.id, id));
    return session2 || void 0;
  }
  async getOmniverseSessionsByUser(userId) {
    return await db.select().from(omniverseSessions).where(eq(omniverseSessions.userId, userId)).orderBy(desc(omniverseSessions.updatedAt));
  }
  async createOmniverseSession(session2) {
    const [createdSession] = await db.insert(omniverseSessions).values(session2).returning();
    return createdSession;
  }
  async updateOmniverseSession(id, updates) {
    const [session2] = await db.update(omniverseSessions).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(omniverseSessions.id, id)).returning();
    return session2 || void 0;
  }
  async deleteOmniverseSession(id) {
    const result = await db.delete(omniverseSessions).where(eq(omniverseSessions.id, id));
    return result.rowCount > 0;
  }
  // Omniverse Interaction operations
  async getOmniverseInteraction(id) {
    const [interaction] = await db.select().from(omniverseInteractions).where(eq(omniverseInteractions.id, id));
    return interaction || void 0;
  }
  async getOmniverseInteractions(sessionId) {
    return await db.select().from(omniverseInteractions).where(eq(omniverseInteractions.sessionId, sessionId)).orderBy(omniverseInteractions.timestamp);
  }
  async createOmniverseInteraction(interaction) {
    const [createdInteraction] = await db.insert(omniverseInteractions).values(interaction).returning();
    return createdInteraction;
  }
  async deleteOmniverseInteraction(id) {
    const result = await db.delete(omniverseInteractions).where(eq(omniverseInteractions.id, id));
    return result.rowCount > 0;
  }
};
var storage = new DatabaseStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import rateLimit from "express-rate-limit";
import session from "express-session";
import MemoryStore from "memorystore";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import * as nodemailer from "nodemailer";
import { z } from "zod";
var JWT_SECRET = process.env.JWT_SECRET || "your-super-secure-jwt-secret-key-here-change-in-production";
var SESSION_SECRET = process.env.SESSION_SECRET || "your-super-secure-session-secret-key-here-change-in-production";
var emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}
async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
function generateJWT(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      authProvider: user.authProvider
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}
function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
var passwordResetTokens = /* @__PURE__ */ new Map();
function generatePasswordResetToken(email) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 36e5);
  passwordResetTokens.set(token, { email, expires });
  return token;
}
function validatePasswordResetToken(token) {
  const tokenData = passwordResetTokens.get(token);
  if (!tokenData) return null;
  if (/* @__PURE__ */ new Date() > tokenData.expires) {
    passwordResetTokens.delete(token);
    return null;
  }
  return tokenData.email;
}
async function sendPasswordResetEmail(email, resetToken) {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5000"}/reset-password?token=${resetToken}`;
    await emailTransporter.sendMail({
      from: process.env.FROM_EMAIL || "noreply@fastbitepro.com",
      to: email,
      subject: "FastBite Pro - Password Reset",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>We received a request to reset your password for your FastBite Pro account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Reset Password</a>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            If the button doesn't work, copy and paste this URL into your browser:<br>
            ${resetUrl}
          </p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
}
function setupAuth(app2) {
  const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1e3,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  });
  const MemoryStoreSession = MemoryStore(session);
  const sessionSettings = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStoreSession({
      checkPeriod: 864e5
      // prune expired entries every 24h
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1e3
      // 24 hours
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }
        const isValidPassword = await comparePasswords(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "Invalid credentials" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await storage.getUserByEmail(profile.emails?.[0]?.value || "");
            if (!user) {
              const userData = {
                username: profile.emails?.[0]?.value || profile.id,
                email: profile.emails?.[0]?.value || "",
                password: await hashPassword(crypto.randomBytes(32).toString("hex")),
                // Random password
                firstName: profile.name?.givenName || "",
                lastName: profile.name?.familyName || "",
                role: "customer",
                authProvider: "google"
              };
              user = await storage.createUser(userData);
            } else if (!user.authProvider || user.authProvider === "email") {
              await storage.updateUser(user.id, { authProvider: "google" });
              user = await storage.getUser(user.id);
            }
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: "/api/auth/facebook/callback",
          profileFields: ["id", "emails", "name"]
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await storage.getUserByEmail(profile.emails?.[0]?.value || "");
            if (!user) {
              const userData = {
                username: profile.emails?.[0]?.value || profile.id,
                email: profile.emails?.[0]?.value || "",
                password: await hashPassword(crypto.randomBytes(32).toString("hex")),
                // Random password
                firstName: profile.name?.givenName || "",
                lastName: profile.name?.familyName || "",
                role: "customer",
                authProvider: "facebook"
              };
              user = await storage.createUser(userData);
            } else if (!user.authProvider || user.authProvider === "email") {
              await storage.updateUser(user.id, { authProvider: "facebook" });
              user = await storage.getUser(user.id);
            }
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      const decoded = verifyJWT(token);
      if (decoded) {
        req.user = decoded;
        return next();
      }
    }
    return res.status(401).json({ message: "Access token required" });
  };
  app2.post("/api/auth/login", async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (err2) => {
        if (err2) {
          console.error("Session error:", err2);
          return res.status(500).json({ message: "Session error" });
        }
        const token = generateJWT(user);
        res.json({
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            walletAddress: user.walletAddress,
            authProvider: user.authProvider
          },
          token
        });
      });
    })(req, res, next);
  });
  const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1e3,
    // 15 minutes
    max: 5,
    // limit each IP to 5 registration attempts per windowMs
    message: { message: "Too many registration attempts, please try again later." }
  });
  app2.post("/api/auth/register", registerLimiter, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username) || await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = await hashPassword(userData.password);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        authProvider: "email"
      });
      req.login(user, (err) => {
        if (err) {
          console.error("Session error:", err);
          return res.status(500).json({ message: "Session error" });
        }
        const token = generateJWT(user);
        res.status(201).json({
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            walletAddress: user.walletAddress,
            authProvider: user.authProvider
          },
          token
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  const walletLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1e3,
    // 15 minutes
    max: 10,
    // limit each IP to 10 requests per windowMs
    message: { message: "Too many wallet login attempts, please try again later." }
  });
  app2.post("/api/auth/wallet-login", walletLoginLimiter, async (req, res) => {
    try {
      const { walletAddress, provider } = req.body;
      if (!walletAddress || !provider) {
        return res.status(400).json({ message: "Wallet address and provider required" });
      }
      let user = await storage.getUserByWalletAddress?.(walletAddress);
      if (!user) {
        const userData = {
          username: `${provider}_${walletAddress.slice(0, 8)}`,
          email: `${walletAddress}@${provider}.wallet`,
          password: await hashPassword(crypto.randomBytes(32).toString("hex")),
          // Random password
          role: "customer",
          walletAddress,
          authProvider: provider
        };
        user = await storage.createUser(userData);
      }
      req.login(user, (err) => {
        if (err) {
          console.error("Session error:", err);
          return res.status(500).json({ message: "Session error" });
        }
        const token = generateJWT(user);
        res.json({
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            walletAddress: user.walletAddress,
            authProvider: user.authProvider
          },
          token
        });
      });
    } catch (error) {
      console.error("Wallet login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app2.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth?error=google" }),
    (req, res) => {
      const token = generateJWT(req.user);
      res.redirect(`/auth?token=${token}&success=true`);
    }
  );
  app2.get("/api/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
  app2.get(
    "/api/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/auth?error=facebook" }),
    (req, res) => {
      const token = generateJWT(req.user);
      res.redirect(`/auth?token=${token}&success=true`);
    }
  );
  app2.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.json({ message: "If the email exists, a reset link has been sent" });
      }
      const resetToken = generatePasswordResetToken(email);
      const emailSent = await sendPasswordResetEmail(email, resetToken);
      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send reset email" });
      }
      res.json({ message: "If the email exists, a reset link has been sent" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
      }
      const email = validatePasswordResetToken(token);
      if (!email) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(user.id, { password: hashedPassword });
      passwordResetTokens.delete(token);
      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err2) => {
        if (err2) return next(err2);
        res.clearCookie("connect.sid");
        res.sendStatus(200);
      });
    });
  });
  app2.get("/api/auth/user", authRateLimiter, (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = req.user;
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      walletAddress: user.walletAddress,
      authProvider: user.authProvider
    });
  });
  return authenticateJWT;
}

// server/ai/routes.ts
import { Router } from "express";

// server/ai/openai-provider.ts
import OpenAI from "openai";

// server/ai/base-provider.ts
var BaseAIProvider = class {
  provider;
  apiKey;
  baseUrl;
  constructor(provider, apiKey, baseUrl) {
    this.provider = provider;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }
  // Helper methods
  formatMessages(messages) {
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content
    }));
  }
  calculateTokens(text2) {
    return Math.ceil(text2.length / 4);
  }
  createResponse(content, model, inputTokens, outputTokens) {
    return {
      content,
      provider: this.provider,
      model,
      timestamp: /* @__PURE__ */ new Date(),
      tokens: {
        input: inputTokens,
        output: outputTokens,
        total: inputTokens + outputTokens
      }
    };
  }
  // Health check
  async healthCheck() {
    try {
      const testMessage = {
        role: "user",
        content: "Hello"
      };
      const response = await this.chat([testMessage]);
      return response.content.length > 0;
    } catch (error) {
      console.error(`Health check failed for ${this.provider}:`, error);
      return false;
    }
  }
  // Get provider info
  getProviderInfo() {
    return {
      provider: this.provider,
      baseUrl: this.baseUrl,
      isHealthy: false
      // Will be updated by health check
    };
  }
};

// server/ai/openai-provider.ts
var OpenAIProvider = class extends BaseAIProvider {
  client;
  constructor(apiKey) {
    super("openai", apiKey);
    this.client = new OpenAI({
      apiKey: this.apiKey
    });
  }
  async chat(messages, model = "gpt-4o") {
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: this.formatMessages(messages),
        temperature: 0.7,
        max_tokens: 2e3
      });
      const inputTokens = this.calculateTokens(messages.map((m) => m.content).join(" "));
      const outputTokens = response.usage?.completion_tokens || 0;
      return this.createResponse(
        response.choices[0].message.content || "",
        model,
        inputTokens,
        outputTokens
      );
    } catch (error) {
      console.error("OpenAI chat error:", error);
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
  async *streamChat(messages, model = "gpt-4o") {
    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: this.formatMessages(messages),
        temperature: 0.7,
        max_tokens: 2e3,
        stream: true
      });
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error("OpenAI stream error:", error);
      throw new Error(`OpenAI stream error: ${error.message}`);
    }
  }
  async analyzeImage(imageData, prompt, model = "gpt-4o") {
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageData}`
                }
              }
            ]
          }
        ],
        max_tokens: 1e3
      });
      const inputTokens = this.calculateTokens(prompt);
      const outputTokens = response.usage?.completion_tokens || 0;
      return this.createResponse(
        response.choices[0].message.content || "",
        model,
        inputTokens,
        outputTokens
      );
    } catch (error) {
      console.error("OpenAI image analysis error:", error);
      throw new Error(`OpenAI image analysis error: ${error.message}`);
    }
  }
  async transcribeAudio(audioData, format = "wav") {
    try {
      const audioFile = new File([audioData], `audio.${format}`, { type: `audio/${format}` });
      const response = await this.client.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
        language: "en"
      });
      return {
        id: `openai-${Date.now()}`,
        text: response.text,
        provider: "openai",
        timestamp: /* @__PURE__ */ new Date(),
        duration: 0
        // OpenAI doesn't provide duration
      };
    } catch (error) {
      console.error("OpenAI transcription error:", error);
      throw new Error(`OpenAI transcription error: ${error.message}`);
    }
  }
  async generateSpeech(text2, voice = "alloy") {
    try {
      const response = await this.client.audio.speech.create({
        model: "tts-1",
        voice,
        input: text2,
        response_format: "mp3"
      });
      return await response.arrayBuffer();
    } catch (error) {
      console.error("OpenAI TTS error:", error);
      throw new Error(`OpenAI TTS error: ${error.message}`);
    }
  }
  // OpenAI-specific methods
  async generateImage(prompt, size = "1024x1024") {
    try {
      const response = await this.client.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size,
        quality: "standard"
      });
      return response.data[0].url || "";
    } catch (error) {
      console.error("OpenAI image generation error:", error);
      throw new Error(`OpenAI image generation error: ${error.message}`);
    }
  }
  async createAssistant(name, instructions, model = "gpt-4o") {
    try {
      const assistant = await this.client.beta.assistants.create({
        name,
        instructions,
        model,
        tools: [{ type: "code_interpreter" }, { type: "file_search" }]
      });
      return assistant;
    } catch (error) {
      console.error("OpenAI assistant creation error:", error);
      throw new Error(`OpenAI assistant creation error: ${error.message}`);
    }
  }
};

// server/ai/anthropic-provider.ts
import Anthropic from "@anthropic-ai/sdk";
var AnthropicProvider = class extends BaseAIProvider {
  client;
  constructor(apiKey) {
    super("anthropic", apiKey);
    this.client = new Anthropic({
      apiKey: this.apiKey
    });
  }
  async chat(messages, model = "claude-sonnet-4-20250514") {
    try {
      const systemMessage = messages.find((m) => m.role === "system");
      const userMessages = messages.filter((m) => m.role !== "system");
      const response = await this.client.messages.create({
        model,
        max_tokens: 2e3,
        temperature: 0.7,
        system: systemMessage?.content || void 0,
        messages: this.formatMessages(userMessages)
      });
      const inputTokens = this.calculateTokens(messages.map((m) => m.content).join(" "));
      const outputTokens = response.usage?.output_tokens || 0;
      return this.createResponse(
        response.content[0].type === "text" ? response.content[0].text : "",
        model,
        inputTokens,
        outputTokens
      );
    } catch (error) {
      console.error("Anthropic chat error:", error);
      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }
  async *streamChat(messages, model = "claude-sonnet-4-20250514") {
    try {
      const systemMessage = messages.find((m) => m.role === "system");
      const userMessages = messages.filter((m) => m.role !== "system");
      const stream = await this.client.messages.create({
        model,
        max_tokens: 2e3,
        temperature: 0.7,
        system: systemMessage?.content || void 0,
        messages: this.formatMessages(userMessages),
        stream: true
      });
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          yield chunk.delta.text;
        }
      }
    } catch (error) {
      console.error("Anthropic stream error:", error);
      throw new Error(`Anthropic stream error: ${error.message}`);
    }
  }
  async analyzeImage(imageData, prompt, model = "claude-sonnet-4-20250514") {
    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: 1e3,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: imageData
                }
              }
            ]
          }
        ]
      });
      const inputTokens = this.calculateTokens(prompt);
      const outputTokens = response.usage?.output_tokens || 0;
      return this.createResponse(
        response.content[0].type === "text" ? response.content[0].text : "",
        model,
        inputTokens,
        outputTokens
      );
    } catch (error) {
      console.error("Anthropic image analysis error:", error);
      throw new Error(`Anthropic image analysis error: ${error.message}`);
    }
  }
  async transcribeAudio(audioData, format = "wav") {
    throw new Error("Audio transcription not supported by Anthropic. Use OpenAI Whisper or similar service.");
  }
  async generateSpeech(text2, voice) {
    throw new Error("Text-to-speech not supported by Anthropic. Use OpenAI TTS or similar service.");
  }
  // Anthropic-specific methods
  async analyzeSentiment(text2, model = "claude-sonnet-4-20250514") {
    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: 500,
        system: "You are a sentiment analysis expert. Analyze the sentiment of the given text and respond with JSON containing: sentiment (positive/negative/neutral), confidence (0-1), and reasoning.",
        messages: [
          {
            role: "user",
            content: text2
          }
        ]
      });
      const content = response.content[0].type === "text" ? response.content[0].text : "";
      try {
        const result = JSON.parse(content);
        return {
          sentiment: result.sentiment || "neutral",
          confidence: Math.max(0, Math.min(1, result.confidence || 0)),
          reasoning: result.reasoning || "No reasoning provided"
        };
      } catch (parseError) {
        console.error("Failed to parse sentiment response:", parseError);
        return {
          sentiment: "neutral",
          confidence: 0,
          reasoning: "Failed to parse response"
        };
      }
    } catch (error) {
      console.error("Anthropic sentiment analysis error:", error);
      throw new Error(`Anthropic sentiment analysis error: ${error.message}`);
    }
  }
  async summarizeText(text2, maxLength = 200, model = "claude-sonnet-4-20250514") {
    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: maxLength * 2,
        system: `Summarize the following text in approximately ${maxLength} words or less. Focus on key points and main ideas.`,
        messages: [
          {
            role: "user",
            content: text2
          }
        ]
      });
      return response.content[0].type === "text" ? response.content[0].text : "";
    } catch (error) {
      console.error("Anthropic summarization error:", error);
      throw new Error(`Anthropic summarization error: ${error.message}`);
    }
  }
};

// server/ai/xai-provider.ts
import OpenAI2 from "openai";
var XAIProvider = class extends BaseAIProvider {
  client;
  constructor(apiKey) {
    super("xai", apiKey, "https://api.x.ai/v1");
    this.client = new OpenAI2({
      baseURL: "https://api.x.ai/v1",
      apiKey: this.apiKey
    });
  }
  async chat(messages, model = "grok-2-1212") {
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: this.formatMessages(messages),
        temperature: 0.7,
        max_tokens: 2e3
      });
      const inputTokens = this.calculateTokens(messages.map((m) => m.content).join(" "));
      const outputTokens = response.usage?.completion_tokens || 0;
      return this.createResponse(
        response.choices[0].message.content || "",
        model,
        inputTokens,
        outputTokens
      );
    } catch (error) {
      console.error("xAI chat error:", error);
      throw new Error(`xAI API error: ${error.message}`);
    }
  }
  async *streamChat(messages, model = "grok-2-1212") {
    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: this.formatMessages(messages),
        temperature: 0.7,
        max_tokens: 2e3,
        stream: true
      });
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error("xAI stream error:", error);
      throw new Error(`xAI stream error: ${error.message}`);
    }
  }
  async analyzeImage(imageData, prompt, model = "grok-2-vision-1212") {
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageData}`
                }
              }
            ]
          }
        ],
        max_tokens: 1e3
      });
      const inputTokens = this.calculateTokens(prompt);
      const outputTokens = response.usage?.completion_tokens || 0;
      return this.createResponse(
        response.choices[0].message.content || "",
        model,
        inputTokens,
        outputTokens
      );
    } catch (error) {
      console.error("xAI image analysis error:", error);
      throw new Error(`xAI image analysis error: ${error.message}`);
    }
  }
  async transcribeAudio(audioData, format = "wav") {
    throw new Error("Audio transcription not supported by xAI. Use OpenAI Whisper or similar service.");
  }
  async generateSpeech(text2, voice) {
    throw new Error("Text-to-speech not supported by xAI. Use OpenAI TTS or similar service.");
  }
  // xAI-specific methods
  async analyzeWithRealtime(messages, model = "grok-2-1212") {
    try {
      const enhancedMessages = [
        {
          role: "system",
          content: `You are Grok, xAI's AI assistant. Current timestamp: ${(/* @__PURE__ */ new Date()).toISOString()}. You have access to real-time information and can provide current, up-to-date responses.`
        },
        ...messages
      ];
      const response = await this.chat(enhancedMessages, model);
      return {
        response,
        realTimeData: {
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          hasRealTimeAccess: true
        }
      };
    } catch (error) {
      console.error("xAI real-time analysis error:", error);
      throw new Error(`xAI real-time analysis error: ${error.message}`);
    }
  }
  async generateCode(prompt, language = "javascript", model = "grok-2-1212") {
    try {
      const systemPrompt = `You are a code generation expert. Generate ${language} code based on the user's request. Respond with JSON containing:
      - code: the generated code
      - explanation: explanation of how the code works
      - suggestions: array of improvement suggestions`;
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2e3
      });
      const content = response.choices[0].message.content || "{}";
      try {
        const result = JSON.parse(content);
        return {
          code: result.code || "",
          explanation: result.explanation || "",
          suggestions: result.suggestions || []
        };
      } catch (parseError) {
        console.error("Failed to parse code generation response:", parseError);
        return {
          code: content,
          explanation: "Failed to parse structured response",
          suggestions: []
        };
      }
    } catch (error) {
      console.error("xAI code generation error:", error);
      throw new Error(`xAI code generation error: ${error.message}`);
    }
  }
  async wittyResponse(prompt, model = "grok-2-1212") {
    try {
      const systemPrompt = `You are Grok, xAI's witty and humorous AI assistant. Respond with clever humor, wit, and personality while still being helpful. Feel free to be playful and entertaining in your responses.`;
      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ];
      return await this.chat(messages, model);
    } catch (error) {
      console.error("xAI witty response error:", error);
      throw new Error(`xAI witty response error: ${error.message}`);
    }
  }
};

// server/ai/deepseek-provider.ts
import OpenAI3 from "openai";
var DeepSeekProvider = class extends BaseAIProvider {
  client;
  constructor(apiKey) {
    super("deepseek", apiKey, "https://api.deepseek.com");
    this.client = new OpenAI3({
      baseURL: "https://api.deepseek.com",
      apiKey: this.apiKey
    });
  }
  async chat(messages, model = "deepseek-chat") {
    try {
      const response = await this.client.chat.completions.create({
        model,
        messages: this.formatMessages(messages),
        temperature: 0.7,
        max_tokens: 2e3
      });
      const inputTokens = this.calculateTokens(messages.map((m) => m.content).join(" "));
      const outputTokens = response.usage?.completion_tokens || 0;
      return this.createResponse(
        response.choices[0].message.content || "",
        model,
        inputTokens,
        outputTokens
      );
    } catch (error) {
      console.error("DeepSeek chat error:", error);
      throw new Error(`DeepSeek API error: ${error.message}`);
    }
  }
  async *streamChat(messages, model = "deepseek-chat") {
    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages: this.formatMessages(messages),
        temperature: 0.7,
        max_tokens: 2e3,
        stream: true
      });
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error("DeepSeek stream error:", error);
      throw new Error(`DeepSeek stream error: ${error.message}`);
    }
  }
  async analyzeImage(imageData, prompt, model = "deepseek-chat") {
    throw new Error("Image analysis not supported by DeepSeek. Use OpenAI GPT-4V or similar service.");
  }
  async transcribeAudio(audioData, format = "wav") {
    throw new Error("Audio transcription not supported by DeepSeek. Use OpenAI Whisper or similar service.");
  }
  async generateSpeech(text2, voice) {
    throw new Error("Text-to-speech not supported by DeepSeek. Use OpenAI TTS or similar service.");
  }
  // DeepSeek-specific methods
  async reasoning(prompt, model = "deepseek-reasoner") {
    try {
      const systemPrompt = `You are DeepSeek's reasoning model. Provide detailed step-by-step reasoning for complex problems. Break down your thought process and show your work.`;
      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ];
      const response = await this.chat(messages, model);
      const reasoning = response.content.includes("**Reasoning:**") ? response.content.split("**Reasoning:**")[1]?.split("**Answer:**")[0]?.trim() || "" : "";
      return {
        response,
        reasoning,
        confidence: 0.8
        // DeepSeek reasoning is generally high confidence
      };
    } catch (error) {
      console.error("DeepSeek reasoning error:", error);
      throw new Error(`DeepSeek reasoning error: ${error.message}`);
    }
  }
  async solveMathProblem(problem, model = "deepseek-reasoner") {
    try {
      const systemPrompt = `You are a mathematical reasoning expert. Solve the given problem step by step. Show all work and verify your answer. Format your response as JSON with:
      - solution: the final answer
      - steps: array of solution steps
      - verification: verification of the answer`;
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: problem
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2e3
      });
      const content = response.choices[0].message.content || "{}";
      try {
        const result = JSON.parse(content);
        return {
          solution: result.solution || "",
          steps: result.steps || [],
          verification: result.verification || ""
        };
      } catch (parseError) {
        console.error("Failed to parse math solution response:", parseError);
        return {
          solution: content,
          steps: [],
          verification: "Failed to parse structured response"
        };
      }
    } catch (error) {
      console.error("DeepSeek math problem error:", error);
      throw new Error(`DeepSeek math problem error: ${error.message}`);
    }
  }
  async codeReview(code, language = "javascript", model = "deepseek-chat") {
    try {
      const systemPrompt = `You are a code review expert. Review the provided ${language} code and provide:
      - summary: overall assessment
      - issues: array of issues found (type, message, line)
      - suggestions: improvement suggestions
      - score: code quality score 0-100
      Respond in JSON format.`;
      const response = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Review this ${language} code:

${code}`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2e3
      });
      const content = response.choices[0].message.content || "{}";
      try {
        const result = JSON.parse(content);
        return {
          summary: result.summary || "",
          issues: result.issues || [],
          suggestions: result.suggestions || [],
          score: Math.max(0, Math.min(100, result.score || 0))
        };
      } catch (parseError) {
        console.error("Failed to parse code review response:", parseError);
        return {
          summary: content,
          issues: [],
          suggestions: [],
          score: 0
        };
      }
    } catch (error) {
      console.error("DeepSeek code review error:", error);
      throw new Error(`DeepSeek code review error: ${error.message}`);
    }
  }
};

// server/ai/ai-manager.ts
var AIManager = class {
  providers = /* @__PURE__ */ new Map();
  defaultProvider = "openai";
  isInitialized = false;
  constructor() {
    this.initializeProviders();
  }
  initializeProviders() {
    if (process.env.OPENAI_API_KEY) {
      this.providers.set("openai", new OpenAIProvider(process.env.OPENAI_API_KEY));
    }
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.set("anthropic", new AnthropicProvider(process.env.ANTHROPIC_API_KEY));
    }
    if (process.env.XAI_API_KEY) {
      this.providers.set("xai", new XAIProvider(process.env.XAI_API_KEY));
    }
    if (process.env.DEEPSEEK_API_KEY) {
      this.providers.set("deepseek", new DeepSeekProvider(process.env.DEEPSEEK_API_KEY));
    }
    const availableProviders = Array.from(this.providers.keys());
    if (availableProviders.length > 0) {
      this.defaultProvider = availableProviders[0];
    }
    this.isInitialized = true;
    console.log(`AI Manager initialized with providers: ${availableProviders.join(", ")}`);
  }
  // Get provider instance
  getProvider(provider) {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new Error(`Provider ${provider} not available. Check API key configuration.`);
    }
    return providerInstance;
  }
  // Chat with any provider
  async chat(messages, provider = this.defaultProvider, model) {
    const providerInstance = this.getProvider(provider);
    return await providerInstance.chat(messages, model);
  }
  // Stream chat with any provider
  async *streamChat(messages, provider = this.defaultProvider, model) {
    const providerInstance = this.getProvider(provider);
    yield* providerInstance.streamChat(messages, model);
  }
  // Multi-provider chat comparison
  async compareProviders(messages, providers = Array.from(this.providers.keys())) {
    const startTime = Date.now();
    const results = await Promise.allSettled(
      providers.map(async (provider) => {
        const providerInstance = this.getProvider(provider);
        const response = await providerInstance.chat(messages);
        return { provider, response };
      })
    );
    const responses = results.map((result, index) => {
      const provider = providers[index];
      if (result.status === "fulfilled") {
        return {
          provider,
          response: result.value.response
        };
      } else {
        return {
          provider,
          response: {
            content: "",
            provider,
            model: "unknown",
            timestamp: /* @__PURE__ */ new Date()
          },
          error: result.reason?.message || "Unknown error"
        };
      }
    });
    const fastest = responses.find((r) => !r.error)?.provider || providers[0];
    const validResponses = responses.filter((r) => !r.error && r.response.content.length > 0);
    const consensus = validResponses.length > 1 ? this.findConsensus(validResponses.map((r) => r.response.content)) : void 0;
    return {
      responses,
      fastest,
      consensus
    };
  }
  // Image analysis
  async analyzeImage(imageData, prompt, provider = "openai", model) {
    const providerInstance = this.getProvider(provider);
    return await providerInstance.analyzeImage(imageData, prompt, model);
  }
  // Voice transcription
  async transcribeAudio(audioData, provider = "openai", format = "wav") {
    const providerInstance = this.getProvider(provider);
    return await providerInstance.transcribeAudio(audioData, format);
  }
  // Text-to-speech
  async generateSpeech(text2, provider = "openai", voice) {
    const providerInstance = this.getProvider(provider);
    return await providerInstance.generateSpeech(text2, voice);
  }
  // Provider health checks
  async checkProviderHealth() {
    const healthResults = {};
    const checks = Array.from(this.providers.entries()).map(async ([provider, instance]) => {
      try {
        const isHealthy = await instance.healthCheck();
        healthResults[provider] = isHealthy;
      } catch (error) {
        console.error(`Health check failed for ${provider}:`, error);
        healthResults[provider] = false;
      }
    });
    await Promise.all(checks);
    return healthResults;
  }
  // Get available providers
  getAvailableProviders() {
    return Array.from(this.providers.keys());
  }
  // Get provider capabilities
  getProviderCapabilities(provider) {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) return [];
    const capabilities = ["chat"];
    try {
      if (provider === "openai" || provider === "anthropic" || provider === "xai") {
        capabilities.push("image");
      }
      if (provider === "openai") {
        capabilities.push("voice", "transcription", "tts");
      }
      if (provider === "deepseek") {
        capabilities.push("reasoning", "math", "code-review");
      }
      if (provider === "xai") {
        capabilities.push("realtime", "code-generation", "witty");
      }
      if (provider === "anthropic") {
        capabilities.push("sentiment", "summarization");
      }
    } catch (error) {
      console.error(`Error checking capabilities for ${provider}:`, error);
    }
    return capabilities;
  }
  // Advanced AI workflows
  async enhancedWorkflow(prompt, workflow) {
    const workflowConfigs = {
      research: {
        primary: "xai",
        secondary: "deepseek",
        synthesizer: "anthropic"
      },
      creative: {
        primary: "xai",
        secondary: "openai",
        synthesizer: "anthropic"
      },
      analytical: {
        primary: "anthropic",
        secondary: "deepseek",
        synthesizer: "openai"
      },
      technical: {
        primary: "deepseek",
        secondary: "openai",
        synthesizer: "anthropic"
      }
    };
    const config = workflowConfigs[workflow];
    const messages = [{ role: "user", content: prompt }];
    const primary = await this.chat(messages, config.primary);
    let secondary;
    if (this.providers.has(config.secondary)) {
      try {
        secondary = await this.chat(messages, config.secondary);
      } catch (error) {
        console.error(`Secondary provider ${config.secondary} failed:`, error);
      }
    }
    const synthesisPrompt = secondary ? `Synthesize these two AI responses to the prompt "${prompt}":

Response 1: ${primary.content}

Response 2: ${secondary.content}

Provide a comprehensive synthesis that combines the best insights from both responses.` : `Enhance and expand on this AI response to the prompt "${prompt}":

${primary.content}

Provide additional insights and improvements.`;
    const synthesis = await this.chat([{ role: "user", content: synthesisPrompt }], config.synthesizer);
    return {
      primary,
      secondary,
      synthesis
    };
  }
  // Find consensus among multiple responses
  findConsensus(responses) {
    if (responses.length < 2) return void 0;
    const words = responses.map((r) => r.toLowerCase().split(/\s+/));
    const commonWords = words[0].filter(
      (word) => words.every((wordList) => wordList.includes(word)) && word.length > 3
    );
    if (commonWords.length > 5) {
      return `Consensus detected: ${commonWords.slice(0, 5).join(", ")}...`;
    }
    return void 0;
  }
  // Clean shutdown
  async shutdown() {
    console.log("AI Manager shutting down...");
    this.providers.clear();
    this.isInitialized = false;
  }
};
var aiManager = new AIManager();

// server/ai/routes.ts
var router = Router();
router.post("/chat", async (req, res) => {
  try {
    const { messages, provider = "openai", model, temperature, maxTokens, imageData } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }
    let response;
    if (imageData) {
      const prompt = messages[messages.length - 1]?.content || "Analyze this image";
      response = await aiManager.analyzeImage(imageData, prompt, provider, model);
    } else {
      response = await aiManager.chat(messages, provider, model);
    }
    res.json(response);
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});
router.post("/chat/stream", async (req, res) => {
  try {
    const { messages, provider = "openai", model } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    for await (const chunk of aiManager.streamChat(messages, provider, model)) {
      res.write(chunk);
    }
    res.end();
  } catch (error) {
    console.error("Stream chat error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});
router.post("/voice/transcribe", async (req, res) => {
  try {
    const { audioData, provider = "openai", format = "wav" } = req.body;
    if (!audioData) {
      return res.status(400).json({ error: "Audio data is required" });
    }
    const audioBuffer = Buffer.from(audioData, "base64").buffer;
    const voiceMessage = await aiManager.transcribeAudio(audioBuffer, provider, format);
    res.json(voiceMessage);
  } catch (error) {
    console.error("Voice transcription error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});
router.post("/voice/synthesize", async (req, res) => {
  try {
    const { text: text2, provider = "openai", voice } = req.body;
    if (!text2) {
      return res.status(400).json({ error: "Text is required" });
    }
    const audioBuffer = await aiManager.generateSpeech(text2, provider, voice);
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error("Text-to-speech error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});
router.post("/compare", async (req, res) => {
  try {
    const { messages, providers } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }
    const comparison = await aiManager.compareProviders(messages, providers);
    res.json(comparison);
  } catch (error) {
    console.error("Provider comparison error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});
router.post("/workflow/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    if (!["research", "creative", "analytical", "technical"].includes(type)) {
      return res.status(400).json({ error: "Invalid workflow type" });
    }
    const result = await aiManager.enhancedWorkflow(prompt, type);
    res.json(result);
  } catch (error) {
    console.error("Enhanced workflow error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});
router.get("/health", async (req, res) => {
  try {
    const health = await aiManager.checkProviderHealth();
    const providers = aiManager.getAvailableProviders();
    const providerInfo = providers.map((provider) => ({
      provider,
      healthy: health[provider],
      capabilities: aiManager.getProviderCapabilities(provider)
    }));
    res.json({
      providers: providerInfo,
      totalProviders: providers.length,
      healthyProviders: Object.values(health).filter(Boolean).length
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});
router.get("/providers", async (req, res) => {
  try {
    const providers = aiManager.getAvailableProviders();
    const providerDetails = providers.map((provider) => ({
      id: provider,
      name: provider.charAt(0).toUpperCase() + provider.slice(1),
      capabilities: aiManager.getProviderCapabilities(provider)
    }));
    res.json(providerDetails);
  } catch (error) {
    console.error("Get providers error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

// server/routes.ts
async function registerRoutes(app2) {
  const authenticateJWT = setupAuth(app2);
  const aiRateLimiter = rateLimit2({
    windowMs: 15 * 60 * 1e3,
    // 15 minutes
    max: 100,
    // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
  });
  app2.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics2 = await storage.getDashboardMetrics();
      res.json(metrics2);
    } catch (error) {
      console.error("Dashboard metrics error:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });
  app2.get("/api/users", async (req, res) => {
    try {
      const { role } = req.query;
      const users2 = role ? await storage.getUsersByRole(role) : [];
      res.json(users2);
    } catch (error) {
      console.error("Users fetch error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
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
  app2.get("/api/restaurants", async (req, res) => {
    try {
      const restaurants2 = await storage.getAllRestaurants();
      res.json(restaurants2);
    } catch (error) {
      console.error("Restaurants fetch error:", error);
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  });
  app2.get("/api/restaurants/:id/menu", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const menuItems2 = await storage.getMenuItemsByRestaurant(restaurantId);
      res.json(menuItems2);
    } catch (error) {
      console.error("Menu fetch error:", error);
      res.status(500).json({ message: "Failed to fetch menu" });
    }
  });
  app2.get("/api/orders", async (req, res) => {
    try {
      const { customerId, restaurantId, driverId } = req.query;
      let orders2 = [];
      if (customerId) {
        orders2 = await storage.getOrdersByCustomer(parseInt(customerId));
      } else if (restaurantId) {
        orders2 = await storage.getOrdersByRestaurant(parseInt(restaurantId));
      } else if (driverId) {
        orders2 = await storage.getOrdersByDriver(parseInt(driverId));
      } else {
        orders2 = await storage.getActiveOrders();
      }
      res.json(orders2);
    } catch (error) {
      console.error("Orders fetch error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  app2.patch("/api/orders/:id", async (req, res) => {
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
  app2.put("/api/orders/:id", async (req, res) => {
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
  app2.get("/api/restaurants/:restaurantId/menu", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.restaurantId);
      const menuItems2 = await storage.getMenuItemsByRestaurant(restaurantId);
      res.json(menuItems2);
    } catch (error) {
      console.error("Menu items fetch error:", error);
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });
  app2.post("/api/menu-items", async (req, res) => {
    try {
      const menuItemData = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.createMenuItem(menuItemData);
      res.json(menuItem);
    } catch (error) {
      console.error("Menu item creation error:", error);
      res.status(500).json({ message: "Failed to create menu item" });
    }
  });
  app2.put("/api/menu-items/:id", async (req, res) => {
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
  app2.get("/api/restaurants/merchant/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const restaurants2 = await storage.getRestaurantsByOwner(userId);
      res.json(restaurants2[0] || null);
    } catch (error) {
      console.error("Merchant restaurant fetch error:", error);
      res.status(500).json({ message: "Failed to fetch restaurant" });
    }
  });
  app2.get("/api/orders/restaurant/:restaurantId", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.restaurantId);
      const orders2 = await storage.getOrdersByRestaurant(restaurantId);
      res.json(orders2);
    } catch (error) {
      console.error("Restaurant orders fetch error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/orders/customer/:customerId", async (req, res) => {
    try {
      const customerId = parseInt(req.params.customerId);
      const orders2 = await storage.getOrdersByCustomer(customerId);
      res.json(orders2);
    } catch (error) {
      console.error("Customer orders fetch error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/drivers/available", async (req, res) => {
    try {
      const drivers2 = await storage.getAvailableDrivers();
      res.json(drivers2);
    } catch (error) {
      console.error("Available drivers fetch error:", error);
      res.status(500).json({ message: "Failed to fetch available drivers" });
    }
  });
  app2.patch("/api/drivers/:id/location", async (req, res) => {
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
  app2.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns2 = await storage.getActiveCampaigns();
      res.json(campaigns2);
    } catch (error) {
      console.error("Campaigns fetch error:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });
  app2.get("/api/campaigns/:id", async (req, res) => {
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
  app2.post("/api/investments", async (req, res) => {
    try {
      const investmentData = insertInvestmentSchema.parse(req.body);
      const investment = await storage.createInvestment(investmentData);
      res.json(investment);
    } catch (error) {
      console.error("Investment creation error:", error);
      res.status(500).json({ message: "Failed to create investment" });
    }
  });
  app2.get("/api/smart-contracts", async (req, res) => {
    try {
      const contracts = await storage.getAllSmartContracts();
      res.json(contracts);
    } catch (error) {
      console.error("Smart contracts fetch error:", error);
      res.status(500).json({ message: "Failed to fetch smart contracts" });
    }
  });
  app2.post("/api/smart-contracts", async (req, res) => {
    try {
      const contractData = insertSmartContractSchema.parse(req.body);
      const contract = await storage.createSmartContract(contractData);
      res.json(contract);
    } catch (error) {
      console.error("Smart contract creation error:", error);
      res.status(500).json({ message: "Failed to create smart contract" });
    }
  });
  app2.get("/api/tokens", async (req, res) => {
    try {
      const tokens2 = await storage.getAllTokens();
      res.json(tokens2);
    } catch (error) {
      console.error("Tokens fetch error:", error);
      res.status(500).json({ message: "Failed to fetch tokens" });
    }
  });
  app2.get("/api/users/:userId/tokens", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const balances = await storage.getUserTokenBalances(userId);
      res.json(balances);
    } catch (error) {
      console.error("User token balances fetch error:", error);
      res.status(500).json({ message: "Failed to fetch token balances" });
    }
  });
  app2.get("/api/analytics/metrics", async (req, res) => {
    try {
      const { type, startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate) : void 0;
      const end = endDate ? new Date(endDate) : void 0;
      const metrics2 = await storage.getMetricsByType(type, start, end);
      res.json(metrics2);
    } catch (error) {
      console.error("Analytics fetch error:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });
  app2.use("/api/ai", aiRateLimiter, authenticateJWT, router);
  const httpServer = createServer(app2);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });
  wss.on("connection", (ws2) => {
    console.log("WebSocket client connected");
    ws2.on("message", (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Received WebSocket message:", data);
        switch (data.type) {
          case "subscribe":
            break;
          case "driver_location":
            wss.clients.forEach((client) => {
              if (client.readyState === ws2.OPEN) {
                client.send(JSON.stringify({
                  type: "driver_location_update",
                  data: data.payload
                }));
              }
            });
            break;
          case "order_update":
            wss.clients.forEach((client) => {
              if (client.readyState === ws2.OPEN) {
                client.send(JSON.stringify({
                  type: "order_status_update",
                  data: data.payload
                }));
              }
            });
            break;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });
    ws2.on("close", () => {
      console.log("WebSocket client disconnected");
    });
    ws2.send(JSON.stringify({ type: "connected", message: "WebSocket connected successfully" }));
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import rateLimit3 from "express-rate-limit";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  define: {
    global: "globalThis"
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  optimizeDeps: {
    exclude: ["@replit/vite-plugin-cartographer"]
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    hmr: {
      port: 5173,
      host: "0.0.0.0",
      clientPort: process.env.REPL_ID ? 443 : 5173
    },
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  const limiter = rateLimit3({
    windowMs: 15 * 60 * 1e3,
    // 15 minutes
    max: 100
    // max 100 requests per windowMs
  });
  app2.use("*", limiter, async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  const limiter = rateLimit3({
    windowMs: 15 * 60 * 1e3,
    // 15 minutes
    max: 100
    // max 100 requests per windowMs
  });
  app2.use("*", limiter, (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/simple-seed.ts
async function simpleSeed() {
  try {
    console.log("Starting simple database seeding...");
    const users2 = [
      {
        username: "admin",
        email: "admin@fastbite.com",
        password: "admin123",
        role: "admin",
        firstName: "Admin",
        lastName: "User"
      },
      {
        username: "driver1",
        email: "driver1@fastbite.com",
        password: "driver123",
        role: "driver",
        firstName: "John",
        lastName: "Driver"
      },
      {
        username: "merchant1",
        email: "merchant1@fastbite.com",
        password: "merchant123",
        role: "merchant",
        firstName: "Restaurant",
        lastName: "Owner"
      },
      {
        username: "customer1",
        email: "customer1@fastbite.com",
        password: "customer123",
        role: "customer",
        firstName: "Jane",
        lastName: "Customer"
      }
    ];
    for (const userData of users2) {
      try {
        const existingUser = await storage.getUserByUsername(userData.username);
        if (!existingUser) {
          await storage.createUser(userData);
          console.log(`\u2713 Created user: ${userData.username}`);
        } else {
          console.log(`\u2022 User ${userData.username} already exists, skipping`);
        }
      } catch (error) {
        console.log(`\u2022 Failed to create user ${userData.username}:`, error.message);
      }
    }
    console.log("\u2713 Database seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  try {
    await simpleSeed();
  } catch (error) {
    console.log("Seed data already exists or failed to create");
  }
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

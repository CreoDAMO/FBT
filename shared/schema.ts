import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, varchar, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with role-based access
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("customer"), // customer, driver, merchant, admin, investor
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  profileImageUrl: text("profile_image_url"),
  walletAddress: text("wallet_address"),
  authProvider: text("auth_provider").default("email"), // email, google, facebook, metamask, coinbase
  kycStatus: text("kyc_status").default("pending"), // pending, verified, rejected
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Restaurants/Merchants
export const restaurants = pgTable("restaurants", {
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
  deliveryRadius: integer("delivery_radius").default(5), // miles
  commissionRate: decimal("commission_rate", { precision: 5, scale: 4 }).default("0.0000"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Menu items
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category"),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true),
  preparationTime: integer("preparation_time"), // minutes
  calories: integer("calories"),
  allergens: text("allergens").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => users.id).notNull(),
  restaurantId: integer("restaurant_id").references(() => restaurants.id).notNull(),
  driverId: integer("driver_id").references(() => users.id),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, confirmed, preparing, ready, picked_up, delivered, cancelled
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).default("0.00"),
  tip: decimal("tip", { precision: 10, scale: 2 }).default("0.00"),
  paymentMethod: text("payment_method"), // card, usdc, eth, fbt
  paymentStatus: text("payment_status").default("pending"), // pending, paid, refunded
  deliveryAddress: text("delivery_address").notNull(),
  deliveryInstructions: text("delivery_instructions"),
  estimatedDeliveryTime: timestamp("estimated_delivery_time"),
  actualDeliveryTime: timestamp("actual_delivery_time"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  menuItemId: integer("menu_item_id").references(() => menuItems.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  specialInstructions: text("special_instructions"),
});

// Drivers
export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  licenseNumber: text("license_number").notNull(),
  vehicleType: text("vehicle_type"), // car, motorcycle, bicycle, scooter
  vehicleMake: text("vehicle_make"),
  vehicleModel: text("vehicle_model"),
  vehicleYear: integer("vehicle_year"),
  licensePlate: text("license_plate"),
  insuranceExpiry: timestamp("insurance_expiry"),
  backgroundCheckStatus: text("background_check_status").default("pending"),
  isOnline: boolean("is_online").default(false),
  currentLocation: jsonb("current_location"), // {lat, lng}
  rating: decimal("rating", { precision: 3, scale: 2 }).default("5.00"),
  totalDeliveries: integer("total_deliveries").default(0),
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Crowdfunding campaigns
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  goalAmount: decimal("goal_amount", { precision: 15, scale: 2 }).notNull(),
  raisedAmount: decimal("raised_amount", { precision: 15, scale: 2 }).default("0.00"),
  investorCount: integer("investor_count").default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("active"), // active, paused, completed, cancelled
  minimumInvestment: decimal("minimum_investment", { precision: 10, scale: 2 }).default("500.00"),
  maximumInvestment: decimal("maximum_investment", { precision: 12, scale: 2 }),
  equityPercentage: decimal("equity_percentage", { precision: 5, scale: 2 }),
  pitchDeckUrl: text("pitch_deck_url"),
  businessPlanUrl: text("business_plan_url"),
  financialProjectionsUrl: text("financial_projections_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Investments
export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id).notNull(),
  investorId: integer("investor_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method"), // stripe, usdc, eth
  transactionHash: text("transaction_hash"),
  status: text("status").default("pending"), // pending, confirmed, refunded
  kycCompleted: boolean("kyc_completed").default(false),
  accreditationStatus: text("accreditation_status"), // none, pending, verified
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Smart contracts
export const smartContracts = pgTable("smart_contracts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol"),
  contractType: text("contract_type").notNull(), // token, dao, escrow, rewards
  network: text("network").notNull(), // base, ethereum, polygon
  contractAddress: text("contract_address").notNull(),
  deployerAddress: text("deployer_address").notNull(),
  deploymentTxHash: text("deployment_tx_hash").notNull(),
  abi: jsonb("abi").notNull(),
  bytecode: text("bytecode"),
  verified: boolean("verified").default(false),
  status: text("status").default("active"), // active, paused, deprecated
  totalSupply: text("total_supply"), // for tokens
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tokens (FBT and partner tokens)
export const tokens = pgTable("tokens", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User token balances
export const userTokenBalances = pgTable("user_token_balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  tokenId: integer("token_id").references(() => tokens.id).notNull(),
  balance: text("balance").notNull().default("0"),
  stakedBalance: text("staked_balance").default("0"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Analytics/metrics
export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  metricType: text("metric_type").notNull(), // orders, revenue, users, etc.
  value: decimal("value", { precision: 20, scale: 8 }).notNull(),
  period: text("period"), // daily, weekly, monthly
  date: timestamp("date").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  restaurants: many(restaurants),
  orders: many(orders),
  driverProfile: one(drivers, {
    fields: [users.id],
    references: [drivers.userId],
  }),
  investments: many(investments),
  tokenBalances: many(userTokenBalances),
}));

export const restaurantsRelations = relations(restaurants, ({ one, many }) => ({
  owner: one(users, {
    fields: [restaurants.ownerId],
    references: [users.id],
  }),
  menuItems: many(menuItems),
  orders: many(orders),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [menuItems.restaurantId],
    references: [restaurants.id],
  }),
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(users, {
    fields: [orders.customerId],
    references: [users.id],
  }),
  restaurant: one(restaurants, {
    fields: [orders.restaurantId],
    references: [restaurants.id],
  }),
  driver: one(users, {
    fields: [orders.driverId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));

export const driversRelations = relations(drivers, ({ one }) => ({
  user: one(users, {
    fields: [drivers.userId],
    references: [users.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ many }) => ({
  investments: many(investments),
}));

export const investmentsRelations = relations(investments, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [investments.campaignId],
    references: [campaigns.id],
  }),
  investor: one(users, {
    fields: [investments.investorId],
    references: [users.id],
  }),
}));

export const smartContractsRelations = relations(smartContracts, ({ many }) => ({
  tokens: many(tokens),
}));

export const tokensRelations = relations(tokens, ({ one, many }) => ({
  contract: one(smartContracts, {
    fields: [tokens.contractId],
    references: [smartContracts.id],
  }),
  userBalances: many(userTokenBalances),
}));

export const userTokenBalancesRelations = relations(userTokenBalances, ({ one }) => ({
  user: one(users, {
    fields: [userTokenBalances.userId],
    references: [users.id],
  }),
  token: one(tokens, {
    fields: [userTokenBalances.tokenId],
    references: [tokens.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRestaurantSchema = createInsertSchema(restaurants).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMenuItemSchema = createInsertSchema(menuItems).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertDriverSchema = createInsertSchema(drivers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true, createdAt: true, updatedAt: true });
export const insertInvestmentSchema = createInsertSchema(investments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSmartContractSchema = createInsertSchema(smartContracts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTokenSchema = createInsertSchema(tokens).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserTokenBalanceSchema = createInsertSchema(userTokenBalances).omit({ id: true });
export const insertMetricSchema = createInsertSchema(metrics).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Driver = typeof drivers.$inferSelect;
export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type SmartContract = typeof smartContracts.$inferSelect;
export type InsertSmartContract = z.infer<typeof insertSmartContractSchema>;
export type Token = typeof tokens.$inferSelect;
export type InsertToken = z.infer<typeof insertTokenSchema>;
export type UserTokenBalance = typeof userTokenBalances.$inferSelect;
export type InsertUserTokenBalance = z.infer<typeof insertUserTokenBalanceSchema>;
export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = z.infer<typeof insertMetricSchema>;

import {
  users,
  restaurants,
  menuItems,
  orders,
  orderItems,
  drivers,
  campaigns,
  investments,
  smartContracts,
  tokens,
  userTokenBalances,
  metrics,
  aiChatSessions,
  aiMessages,
  aiVoiceMessages,
  aiAgents,
  aiAnalytics,
  omniverseSessions,
  omniverseInteractions,
  type User,
  type InsertUser,
  type Restaurant,
  type InsertRestaurant,
  type MenuItem,
  type InsertMenuItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Driver,
  type InsertDriver,
  type Campaign,
  type InsertCampaign,
  type Investment,
  type InsertInvestment,
  type SmartContract,
  type InsertSmartContract,
  type Token,
  type InsertToken,
  type UserTokenBalance,
  type InsertUserTokenBalance,
  type Metric,
  type InsertMetric,
  type AiChatSession,
  type InsertAiChatSession,
  type AiMessage,
  type InsertAiMessage,
  type AiVoiceMessage,
  type InsertAiVoiceMessage,
  type AiAgent,
  type InsertAiAgent,
  type AiAnalytics,
  type InsertAiAnalytics,
  type OmniverseSession,
  type InsertOmniverseSession,
  type OmniverseInteraction,
  type InsertOmniverseInteraction,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sum, count } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByWalletAddress?(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  getUsersByRole(role: string): Promise<User[]>;

  // Restaurant operations
  getRestaurant(id: number): Promise<Restaurant | undefined>;
  getRestaurantsByOwner(ownerId: number): Promise<Restaurant[]>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: number, updates: Partial<InsertRestaurant>): Promise<Restaurant | undefined>;
  getAllRestaurants(): Promise<Restaurant[]>;

  // Menu operations
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;

  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByCustomer(customerId: number): Promise<Order[]>;
  getOrdersByRestaurant(restaurantId: number): Promise<Order[]>;
  getOrdersByDriver(driverId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined>;
  getActiveOrders(): Promise<Order[]>;

  // Order items operations
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Driver operations
  getDriver(id: number): Promise<Driver | undefined>;
  getDriverByUserId(userId: number): Promise<Driver | undefined>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriver(id: number, updates: Partial<InsertDriver>): Promise<Driver | undefined>;
  getAvailableDrivers(): Promise<Driver[]>;

  // Campaign operations
  getCampaign(id: number): Promise<Campaign | undefined>;
  getAllCampaigns(): Promise<Campaign[]>;
  getActiveCampaigns(): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, updates: Partial<InsertCampaign>): Promise<Campaign | undefined>;

  // Investment operations
  getInvestment(id: number): Promise<Investment | undefined>;
  getInvestmentsByUser(userId: number): Promise<Investment[]>;
  getInvestmentsByCampaign(campaignId: number): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestment(id: number, updates: Partial<InsertInvestment>): Promise<Investment | undefined>;

  // Smart contract operations
  getSmartContract(id: number): Promise<SmartContract | undefined>;
  getSmartContractByAddress(contractAddress: string): Promise<SmartContract | undefined>;
  createSmartContract(contract: InsertSmartContract): Promise<SmartContract>;
  updateSmartContract(id: number, updates: Partial<InsertSmartContract>): Promise<SmartContract | undefined>;
  getAllSmartContracts(): Promise<SmartContract[]>;

  // Token operations
  getToken(id: number): Promise<Token | undefined>;
  getTokenBySymbol(symbol: string): Promise<Token | undefined>;
  createToken(token: InsertToken): Promise<Token>;
  updateToken(id: number, updates: Partial<InsertToken>): Promise<Token | undefined>;
  getAllTokens(): Promise<Token[]>;

  // User token balance operations
  getUserTokenBalance(userId: number, tokenId: number): Promise<UserTokenBalance | undefined>;
  getUserTokenBalances(userId: number): Promise<UserTokenBalance[]>;
  updateUserTokenBalance(userId: number, tokenId: number, balance: InsertUserTokenBalance): Promise<UserTokenBalance>;

  // Metrics operations
  createMetric(metric: InsertMetric): Promise<Metric>;
  getMetricsByType(metricType: string, startDate?: Date, endDate?: Date): Promise<Metric[]>;
  getDashboardMetrics(): Promise<{
    totalOrders: number;
    activeDrivers: number;
    revenue: string;
    fbtStaked: string;
  }>;

  // AI Chat Session operations
  getAiChatSession(id: string): Promise<AiChatSession | undefined>;
  getAiChatSessionsByUser(userId: number): Promise<AiChatSession[]>;
  createAiChatSession(session: InsertAiChatSession): Promise<AiChatSession>;
  updateAiChatSession(id: string, updates: Partial<InsertAiChatSession>): Promise<AiChatSession | undefined>;
  deleteAiChatSession(id: string): Promise<boolean>;

  // AI Message operations
  getAiMessage(id: number): Promise<AiMessage | undefined>;
  getAiMessages(sessionId: string): Promise<AiMessage[]>;
  createAiMessage(message: InsertAiMessage): Promise<AiMessage>;
  deleteAiMessage(id: number): Promise<boolean>;

  // AI Voice Message operations
  getAiVoiceMessage(id: string): Promise<AiVoiceMessage | undefined>;
  getAiVoiceMessages(sessionId: string): Promise<AiVoiceMessage[]>;
  getAiVoiceMessagesByUser(userId: number): Promise<AiVoiceMessage[]>;
  createAiVoiceMessage(voiceMessage: InsertAiVoiceMessage): Promise<AiVoiceMessage>;
  deleteAiVoiceMessage(id: string): Promise<boolean>;

  // AI Agent operations
  getAiAgent(id: number): Promise<AiAgent | undefined>;
  getAllAiAgents(): Promise<AiAgent[]>;
  getActiveAiAgents(): Promise<AiAgent[]>;
  createAiAgent(agent: InsertAiAgent): Promise<AiAgent>;
  updateAiAgent(id: number, updates: Partial<InsertAiAgent>): Promise<AiAgent | undefined>;
  deleteAiAgent(id: number): Promise<boolean>;

  // AI Analytics operations
  getAiAnalytics(id: number): Promise<AiAnalytics | undefined>;
  getAiAnalyticsByUser(userId: number): Promise<AiAnalytics[]>;
  getAiAnalyticsByProvider(provider: string): Promise<AiAnalytics[]>;
  createAiAnalytics(analytics: InsertAiAnalytics): Promise<AiAnalytics>;

  // Omniverse Session operations
  getOmniverseSession(id: string): Promise<OmniverseSession | undefined>;
  getOmniverseSessionsByUser(userId: number): Promise<OmniverseSession[]>;
  createOmniverseSession(session: InsertOmniverseSession): Promise<OmniverseSession>;
  updateOmniverseSession(id: string, updates: Partial<InsertOmniverseSession>): Promise<OmniverseSession | undefined>;
  deleteOmniverseSession(id: string): Promise<boolean>;

  // Omniverse Interaction operations
  getOmniverseInteraction(id: number): Promise<OmniverseInteraction | undefined>;
  getOmniverseInteractions(sessionId: string): Promise<OmniverseInteraction[]>;
  createOmniverseInteraction(interaction: InsertOmniverseInteraction): Promise<OmniverseInteraction>;
  deleteOmniverseInteraction(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set({ ...updates, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return user || undefined;
  }

  // Restaurant operations
  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return restaurant || undefined;
  }

  async getRestaurantsByOwner(ownerId: number): Promise<Restaurant[]> {
    return await db.select().from(restaurants).where(eq(restaurants.ownerId, ownerId));
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const [restaurant] = await db.insert(restaurants).values(insertRestaurant).returning();
    return restaurant;
  }

  async updateRestaurant(id: number, updates: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    const [restaurant] = await db.update(restaurants).set({ ...updates, updatedAt: new Date() }).where(eq(restaurants.id, id)).returning();
    return restaurant || undefined;
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    return await db.select().from(restaurants).where(eq(restaurants.isActive, true));
  }

  // Menu operations
  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return menuItem || undefined;
  }

  async getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(and(eq(menuItems.restaurantId, restaurantId), eq(menuItems.isAvailable, true)));
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const [menuItem] = await db.insert(menuItems).values(insertMenuItem).returning();
    return menuItem;
  }

  async updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const [menuItem] = await db.update(menuItems).set({ ...updates, updatedAt: new Date() }).where(eq(menuItems.id, id)).returning();
    return menuItem || undefined;
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt));
  }

  async getOrdersByRestaurant(restaurantId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.restaurantId, restaurantId)).orderBy(desc(orders.createdAt));
  }

  async getOrdersByDriver(driverId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.driverId, driverId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const [order] = await db.update(orders).set({ ...updates, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
    return order || undefined;
  }

  async getActiveOrders(): Promise<Order[]> {
    return await db.select().from(orders).where(and(
      eq(orders.status, "confirmed"),
      eq(orders.paymentStatus, "paid")
    )).orderBy(desc(orders.createdAt));
  }

  // Order items operations
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db.insert(orderItems).values(insertOrderItem).returning();
    return orderItem;
  }

  // Driver operations
  async getDriver(id: number): Promise<Driver | undefined> {
    const [driver] = await db.select().from(drivers).where(eq(drivers.id, id));
    return driver || undefined;
  }

  async getDriverByUserId(userId: number): Promise<Driver | undefined> {
    const [driver] = await db.select().from(drivers).where(eq(drivers.userId, userId));
    return driver || undefined;
  }

  async createDriver(insertDriver: InsertDriver): Promise<Driver> {
    const [driver] = await db.insert(drivers).values(insertDriver).returning();
    return driver;
  }

  async updateDriver(id: number, updates: Partial<InsertDriver>): Promise<Driver | undefined> {
    const [driver] = await db.update(drivers).set({ ...updates, updatedAt: new Date() }).where(eq(drivers.id, id)).returning();
    return driver || undefined;
  }

  async getAvailableDrivers(): Promise<Driver[]> {
    return await db.select().from(drivers).where(and(
      eq(drivers.isOnline, true),
      eq(drivers.backgroundCheckStatus, "approved")
    ));
  }

  // Campaign operations
  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign || undefined;
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
  }

  async getActiveCampaigns(): Promise<Campaign[]> {
    return await db.select().from(campaigns).where(eq(campaigns.status, "active")).orderBy(desc(campaigns.createdAt));
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db.insert(campaigns).values(insertCampaign).returning();
    return campaign;
  }

  async updateCampaign(id: number, updates: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const [campaign] = await db.update(campaigns).set({ ...updates, updatedAt: new Date() }).where(eq(campaigns.id, id)).returning();
    return campaign || undefined;
  }

  // Investment operations
  async getInvestment(id: number): Promise<Investment | undefined> {
    const [investment] = await db.select().from(investments).where(eq(investments.id, id));
    return investment || undefined;
  }

  async getInvestmentsByUser(userId: number): Promise<Investment[]> {
    return await db.select().from(investments).where(eq(investments.investorId, userId)).orderBy(desc(investments.createdAt));
  }

  async getInvestmentsByCampaign(campaignId: number): Promise<Investment[]> {
    return await db.select().from(investments).where(eq(investments.campaignId, campaignId)).orderBy(desc(investments.createdAt));
  }

  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const [investment] = await db.insert(investments).values(insertInvestment).returning();
    return investment;
  }

  async updateInvestment(id: number, updates: Partial<InsertInvestment>): Promise<Investment | undefined> {
    const [investment] = await db.update(investments).set({ ...updates, updatedAt: new Date() }).where(eq(investments.id, id)).returning();
    return investment || undefined;
  }

  // Smart contract operations
  async getSmartContract(id: number): Promise<SmartContract | undefined> {
    const [contract] = await db.select().from(smartContracts).where(eq(smartContracts.id, id));
    return contract || undefined;
  }

  async getSmartContractByAddress(contractAddress: string): Promise<SmartContract | undefined> {
    const [contract] = await db.select().from(smartContracts).where(eq(smartContracts.contractAddress, contractAddress));
    return contract || undefined;
  }

  async createSmartContract(insertContract: InsertSmartContract): Promise<SmartContract> {
    const [contract] = await db.insert(smartContracts).values(insertContract).returning();
    return contract;
  }

  async updateSmartContract(id: number, updates: Partial<InsertSmartContract>): Promise<SmartContract | undefined> {
    const [contract] = await db.update(smartContracts).set({ ...updates, updatedAt: new Date() }).where(eq(smartContracts.id, id)).returning();
    return contract || undefined;
  }

  async getAllSmartContracts(): Promise<SmartContract[]> {
    return await db.select().from(smartContracts).orderBy(desc(smartContracts.createdAt));
  }

  // Token operations
  async getToken(id: number): Promise<Token | undefined> {
    const [token] = await db.select().from(tokens).where(eq(tokens.id, id));
    return token || undefined;
  }

  async getTokenBySymbol(symbol: string): Promise<Token | undefined> {
    const [token] = await db.select().from(tokens).where(eq(tokens.symbol, symbol));
    return token || undefined;
  }

  async createToken(insertToken: InsertToken): Promise<Token> {
    const [token] = await db.insert(tokens).values(insertToken).returning();
    return token;
  }

  async updateToken(id: number, updates: Partial<InsertToken>): Promise<Token | undefined> {
    const [token] = await db.update(tokens).set({ ...updates, updatedAt: new Date() }).where(eq(tokens.id, id)).returning();
    return token || undefined;
  }

  async getAllTokens(): Promise<Token[]> {
    return await db.select().from(tokens).orderBy(desc(tokens.createdAt));
  }

  // User token balance operations
  async getUserTokenBalance(userId: number, tokenId: number): Promise<UserTokenBalance | undefined> {
    const [balance] = await db.select().from(userTokenBalances).where(and(
      eq(userTokenBalances.userId, userId),
      eq(userTokenBalances.tokenId, tokenId)
    ));
    return balance || undefined;
  }

  async getUserTokenBalances(userId: number): Promise<UserTokenBalance[]> {
    return await db.select().from(userTokenBalances).where(eq(userTokenBalances.userId, userId));
  }

  async updateUserTokenBalance(userId: number, tokenId: number, balanceData: InsertUserTokenBalance): Promise<UserTokenBalance> {
    const [balance] = await db.insert(userTokenBalances).values({
      ...balanceData,
      userId,
      tokenId,
      lastUpdated: new Date()
    }).onConflictDoUpdate({
      target: [userTokenBalances.userId, userTokenBalances.tokenId],
      set: {
        ...balanceData,
        lastUpdated: new Date()
      }
    }).returning();
    return balance;
  }

  // Metrics operations
  async createMetric(insertMetric: InsertMetric): Promise<Metric> {
    const [metric] = await db.insert(metrics).values(insertMetric).returning();
    return metric;
  }

  async getMetricsByType(metricType: string, startDate?: Date, endDate?: Date): Promise<Metric[]> {
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

  async getDashboardMetrics(): Promise<{
    totalOrders: number;
    activeDrivers: number;
    revenue: string;
    fbtStaked: string;
  }> {
    // Get total orders count
    const [orderCount] = await db.select({ count: count() }).from(orders);
    
    // Get active drivers count
    const [driverCount] = await db.select({ count: count() }).from(drivers).where(eq(drivers.isOnline, true));
    
    // Get total revenue (sum of all completed orders)
    const [revenueResult] = await db.select({ total: sum(orders.totalAmount) }).from(orders).where(eq(orders.status, "delivered"));
    
    // Get FBT staked amount (sum of all staked balances)
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
      fbtStaked: fbtStaked,
    };
  }

  // AI Chat Session operations
  async getAiChatSession(id: string): Promise<AiChatSession | undefined> {
    const [session] = await db.select().from(aiChatSessions).where(eq(aiChatSessions.id, id));
    return session || undefined;
  }

  async getAiChatSessionsByUser(userId: number): Promise<AiChatSession[]> {
    return await db.select().from(aiChatSessions).where(eq(aiChatSessions.userId, userId)).orderBy(desc(aiChatSessions.updatedAt));
  }

  async createAiChatSession(session: InsertAiChatSession): Promise<AiChatSession> {
    const [createdSession] = await db.insert(aiChatSessions).values(session).returning();
    return createdSession;
  }

  async updateAiChatSession(id: string, updates: Partial<InsertAiChatSession>): Promise<AiChatSession | undefined> {
    const [session] = await db.update(aiChatSessions).set({ ...updates, updatedAt: new Date() }).where(eq(aiChatSessions.id, id)).returning();
    return session || undefined;
  }

  async deleteAiChatSession(id: string): Promise<boolean> {
    const result = await db.delete(aiChatSessions).where(eq(aiChatSessions.id, id));
    return result.rowCount > 0;
  }

  // AI Message operations
  async getAiMessage(id: number): Promise<AiMessage | undefined> {
    const [message] = await db.select().from(aiMessages).where(eq(aiMessages.id, id));
    return message || undefined;
  }

  async getAiMessages(sessionId: string): Promise<AiMessage[]> {
    return await db.select().from(aiMessages).where(eq(aiMessages.sessionId, sessionId)).orderBy(aiMessages.timestamp);
  }

  async createAiMessage(message: InsertAiMessage): Promise<AiMessage> {
    const [createdMessage] = await db.insert(aiMessages).values(message).returning();
    return createdMessage;
  }

  async deleteAiMessage(id: number): Promise<boolean> {
    const result = await db.delete(aiMessages).where(eq(aiMessages.id, id));
    return result.rowCount > 0;
  }

  // AI Voice Message operations
  async getAiVoiceMessage(id: string): Promise<AiVoiceMessage | undefined> {
    const [voiceMessage] = await db.select().from(aiVoiceMessages).where(eq(aiVoiceMessages.id, id));
    return voiceMessage || undefined;
  }

  async getAiVoiceMessages(sessionId: string): Promise<AiVoiceMessage[]> {
    return await db.select().from(aiVoiceMessages).where(eq(aiVoiceMessages.sessionId, sessionId)).orderBy(aiVoiceMessages.createdAt);
  }

  async getAiVoiceMessagesByUser(userId: number): Promise<AiVoiceMessage[]> {
    return await db.select().from(aiVoiceMessages).where(eq(aiVoiceMessages.userId, userId)).orderBy(desc(aiVoiceMessages.createdAt));
  }

  async createAiVoiceMessage(voiceMessage: InsertAiVoiceMessage): Promise<AiVoiceMessage> {
    const [createdVoiceMessage] = await db.insert(aiVoiceMessages).values(voiceMessage).returning();
    return createdVoiceMessage;
  }

  async deleteAiVoiceMessage(id: string): Promise<boolean> {
    const result = await db.delete(aiVoiceMessages).where(eq(aiVoiceMessages.id, id));
    return result.rowCount > 0;
  }

  // AI Agent operations
  async getAiAgent(id: number): Promise<AiAgent | undefined> {
    const [agent] = await db.select().from(aiAgents).where(eq(aiAgents.id, id));
    return agent || undefined;
  }

  async getAllAiAgents(): Promise<AiAgent[]> {
    return await db.select().from(aiAgents).orderBy(desc(aiAgents.createdAt));
  }

  async getActiveAiAgents(): Promise<AiAgent[]> {
    return await db.select().from(aiAgents).where(eq(aiAgents.isActive, true)).orderBy(desc(aiAgents.createdAt));
  }

  async createAiAgent(agent: InsertAiAgent): Promise<AiAgent> {
    const [createdAgent] = await db.insert(aiAgents).values(agent).returning();
    return createdAgent;
  }

  async updateAiAgent(id: number, updates: Partial<InsertAiAgent>): Promise<AiAgent | undefined> {
    const [agent] = await db.update(aiAgents).set({ ...updates, updatedAt: new Date() }).where(eq(aiAgents.id, id)).returning();
    return agent || undefined;
  }

  async deleteAiAgent(id: number): Promise<boolean> {
    const result = await db.delete(aiAgents).where(eq(aiAgents.id, id));
    return result.rowCount > 0;
  }

  // AI Analytics operations
  async getAiAnalytics(id: number): Promise<AiAnalytics | undefined> {
    const [analytics] = await db.select().from(aiAnalytics).where(eq(aiAnalytics.id, id));
    return analytics || undefined;
  }

  async getAiAnalyticsByUser(userId: number): Promise<AiAnalytics[]> {
    return await db.select().from(aiAnalytics).where(eq(aiAnalytics.userId, userId)).orderBy(desc(aiAnalytics.createdAt));
  }

  async getAiAnalyticsByProvider(provider: string): Promise<AiAnalytics[]> {
    return await db.select().from(aiAnalytics).where(eq(aiAnalytics.provider, provider)).orderBy(desc(aiAnalytics.createdAt));
  }

  async createAiAnalytics(analytics: InsertAiAnalytics): Promise<AiAnalytics> {
    const [createdAnalytics] = await db.insert(aiAnalytics).values(analytics).returning();
    return createdAnalytics;
  }

  // Omniverse Session operations
  async getOmniverseSession(id: string): Promise<OmniverseSession | undefined> {
    const [session] = await db.select().from(omniverseSessions).where(eq(omniverseSessions.id, id));
    return session || undefined;
  }

  async getOmniverseSessionsByUser(userId: number): Promise<OmniverseSession[]> {
    return await db.select().from(omniverseSessions).where(eq(omniverseSessions.userId, userId)).orderBy(desc(omniverseSessions.updatedAt));
  }

  async createOmniverseSession(session: InsertOmniverseSession): Promise<OmniverseSession> {
    const [createdSession] = await db.insert(omniverseSessions).values(session).returning();
    return createdSession;
  }

  async updateOmniverseSession(id: string, updates: Partial<InsertOmniverseSession>): Promise<OmniverseSession | undefined> {
    const [session] = await db.update(omniverseSessions).set({ ...updates, updatedAt: new Date() }).where(eq(omniverseSessions.id, id)).returning();
    return session || undefined;
  }

  async deleteOmniverseSession(id: string): Promise<boolean> {
    const result = await db.delete(omniverseSessions).where(eq(omniverseSessions.id, id));
    return result.rowCount > 0;
  }

  // Omniverse Interaction operations
  async getOmniverseInteraction(id: number): Promise<OmniverseInteraction | undefined> {
    const [interaction] = await db.select().from(omniverseInteractions).where(eq(omniverseInteractions.id, id));
    return interaction || undefined;
  }

  async getOmniverseInteractions(sessionId: string): Promise<OmniverseInteraction[]> {
    return await db.select().from(omniverseInteractions).where(eq(omniverseInteractions.sessionId, sessionId)).orderBy(omniverseInteractions.timestamp);
  }

  async createOmniverseInteraction(interaction: InsertOmniverseInteraction): Promise<OmniverseInteraction> {
    const [createdInteraction] = await db.insert(omniverseInteractions).values(interaction).returning();
    return createdInteraction;
  }

  async deleteOmniverseInteraction(id: number): Promise<boolean> {
    const result = await db.delete(omniverseInteractions).where(eq(omniverseInteractions.id, id));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();

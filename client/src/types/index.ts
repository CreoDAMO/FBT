// Global type definitions for FastBite Pro

// Re-export database types
export type {
  User,
  InsertUser,
  Restaurant,
  InsertRestaurant,
  MenuItem,
  InsertMenuItem,
  Order,
  InsertOrder,
  OrderItem,
  InsertOrderItem,
  Driver,
  InsertDriver,
  Campaign,
  InsertCampaign,
  Investment,
  InsertInvestment,
  SmartContract,
  InsertSmartContract,
  Token,
  InsertToken,
  UserTokenBalance,
  InsertUserTokenBalance,
  Metric,
  InsertMetric,
} from "@shared/schema";

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Authentication Types
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  walletAddress?: string;
  kycStatus?: string;
  isActive: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  phone?: string;
}

// Web3 Types
export interface WalletConnection {
  address: string;
  chainId: number;
  balance: string;
  isConnected: boolean;
}

export interface ContractDeployment {
  name: string;
  symbol?: string;
  contractType: string;
  network: string;
  totalSupply?: string;
  constructorArgs?: any[];
  metadata?: Record<string, any>;
}

export interface DeployedContract {
  id: number;
  name: string;
  contractType: string;
  network: string;
  contractAddress: string;
  deploymentTxHash: string;
  verified: boolean;
  status: string;
  createdAt: string;
}

export interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: string;
  contractAddress?: string;
  price?: number;
  marketCap?: number;
}

// Dashboard Types
export interface DashboardMetrics {
  totalOrders: number;
  activeDrivers: number;
  revenue: string;
  fbtStaked: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Order Management Types
export interface OrderWithDetails extends Order {
  customer: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'phone'>;
  restaurant: Pick<Restaurant, 'id' | 'name' | 'address' | 'phone'>;
  driver?: Pick<User, 'id' | 'firstName' | 'lastName' | 'phone'>;
  items: (OrderItem & {
    menuItem: Pick<MenuItem, 'id' | 'name' | 'price' | 'imageUrl'>;
  })[];
}

export interface OrderTracking {
  orderId: number;
  status: string;
  estimatedTime: string;
  driverLocation?: {
    lat: number;
    lng: number;
  };
  timeline: Array<{
    status: string;
    timestamp: string;
    description: string;
  }>;
}

// Driver Types
export interface DriverStats {
  deliveriesToday: number;
  todayEarnings: string;
  rating: number;
  fbtEarned: number;
  onlineTime: string;
  totalDeliveries: number;
  totalEarnings: string;
}

export interface DriverLocation {
  driverId: number;
  lat: number;
  lng: number;
  heading?: number;
  timestamp: string;
}

export interface RouteOptimization {
  totalDistance: number;
  estimatedTime: number;
  fuelSavings: number;
  waypoints: Array<{
    lat: number;
    lng: number;
    address: string;
    type: 'pickup' | 'delivery';
    orderId?: number;
  }>;
}

// Investment Types
export interface InvestmentTier {
  id: string;
  name: string;
  minAmount: number;
  maxAmount?: number;
  benefits: string[];
  popular?: boolean;
}

export interface InvestmentDetails extends Investment {
  campaign: Pick<Campaign, 'id' | 'title' | 'description' | 'goalAmount'>;
  investor: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
}

export interface CampaignProgress {
  campaignId: number;
  raisedAmount: string;
  goalAmount: string;
  investorCount: number;
  daysLeft: number;
  progressPercentage: number;
}

// Analytics Types
export interface MetricData {
  type: string;
  value: number;
  period: string;
  date: string;
  change?: number;
  changePercentage?: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }>;
}

// Restaurant Types
export interface RestaurantWithDetails extends Restaurant {
  owner: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
  menuItems: MenuItem[];
  totalOrders?: number;
  averageOrderValue?: number;
  customerRating?: number;
}

export interface MenuCategory {
  name: string;
  description?: string;
  items: MenuItem[];
}

// Notification Types
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// WebSocket Types
export interface WebSocketMessage {
  type: string;
  payload?: any;
  timestamp?: string;
  userId?: number;
  sessionId?: string;
}

export interface WebSocketEvent {
  type: string;
  handler: (message: WebSocketMessage) => void;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'file' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  options?: Array<{ value: string; label: string }>;
  defaultValue?: any;
}

export interface FormErrors {
  [fieldName: string]: string | undefined;
}

// File Upload Types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  distance?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
}

// Navigation Types
export interface SidebarSection {
  title: string;
  items: Array<{
    id: string;
    label: string;
    icon: any; // Lucide icon component
    path: string;
    badge?: string | number;
    disabled?: boolean;
  }>;
}

export interface PageInfo {
  title: string;
  subtitle: string;
  breadcrumbs?: Array<{
    label: string;
    path?: string;
  }>;
}

// Theme Types
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  fontSize: {
    small: string;
    medium: string;
    large: string;
  };
}

// Configuration Types
export interface AppConfig {
  name: string;
  version: string;
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: {
    crowdfunding: boolean;
    web3: boolean;
    realTimeTracking: boolean;
    aiRouting: boolean;
    daoGovernance: boolean;
  };
  payments: {
    stripe: boolean;
    crypto: boolean;
    bankTransfer: boolean;
  };
  networks: string[];
  defaultNetwork: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  userId?: number;
  action?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Utility Types
export type UserRole = 'customer' | 'driver' | 'merchant' | 'admin' | 'investor' | 'super_admin';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
export type PaymentMethod = 'card' | 'usdc' | 'eth' | 'fbt' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';
export type ContractType = 'token' | 'dao' | 'escrow' | 'rewards' | 'staking';
export type NetworkType = 'base-mainnet' | 'base-sepolia' | 'ethereum' | 'polygon' | 'bsc';
export type KycStatus = 'pending' | 'verified' | 'rejected' | 'expired';

// Generic utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event handler types
export type EventHandler<T = any> = (event: T) => void;
export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;

// API hook types
export interface UseQueryOptions<T> {
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
  cacheTime?: number;
  retry?: boolean | number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseMutationOptions<T, V = any> {
  onSuccess?: (data: T, variables: V) => void;
  onError?: (error: Error, variables: V) => void;
  onSettled?: (data: T | undefined, error: Error | null, variables: V) => void;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

// Modal and Dialog types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
}

export interface ConfirmDialogProps extends ModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

// Chart and Graph types
export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip?: {
      enabled?: boolean;
    };
  };
  scales?: {
    x?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    y?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
  };
}

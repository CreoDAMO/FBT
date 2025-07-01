// FastBite Pro application constants

// API Configuration
export const API_CONFIG = {
  BASE_URL: "/api",
  WEBSOCKET_URL: `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`,
  TIMEOUT: 30000,
} as const;

// Application Routes
export const ROUTES = {
  DASHBOARD: "/dashboard",
  ORDERING: "/ordering",
  DRIVER: "/driver",
  MERCHANT: "/merchant",
  CROWDFUNDING: "/crowdfunding",
  TOKENOMICS: "/tokenomics",
  ADMIN: "/admin",
  CONTRACTS: "/contracts",
  COMPLIANCE: "/compliance",
  ANALYTICS: "/analytics",
  USERS: "/users",
} as const;

// User Roles
export const USER_ROLES = {
  CUSTOMER: "customer",
  DRIVER: "driver",
  MERCHANT: "merchant",
  ADMIN: "admin",
  INVESTOR: "investor",
  SUPER_ADMIN: "super_admin",
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  PICKED_UP: "picked_up",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: "card",
  USDC: "usdc",
  ETH: "eth",
  FBT: "fbt",
  BANK_TRANSFER: "bank_transfer",
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  REFUNDED: "refunded",
  FAILED: "failed",
} as const;

// Campaign Status
export const CAMPAIGN_STATUS = {
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

// Investment Status
export const INVESTMENT_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  REFUNDED: "refunded",
  FAILED: "failed",
} as const;

// Smart Contract Types
export const CONTRACT_TYPES = {
  TOKEN: "token",
  DAO: "dao",
  ESCROW: "escrow",
  REWARDS: "rewards",
  STAKING: "staking",
} as const;

// Blockchain Networks
export const NETWORKS = {
  BASE_MAINNET: "base-mainnet",
  BASE_SEPOLIA: "base-sepolia",
  ETHEREUM: "ethereum",
  POLYGON: "polygon",
  BSC: "bsc",
} as const;

// Contract Status
export const CONTRACT_STATUS = {
  ACTIVE: "active",
  PAUSED: "paused",
  DEPRECATED: "deprecated",
  PENDING: "pending",
} as const;

// KYC Status
export const KYC_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
  EXPIRED: "expired",
} as const;

// Driver Status
export const DRIVER_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
  BUSY: "busy",
  BREAK: "break",
} as const;

// Vehicle Types
export const VEHICLE_TYPES = {
  CAR: "car",
  MOTORCYCLE: "motorcycle",
  BICYCLE: "bicycle",
  SCOOTER: "scooter",
  ELECTRIC_BIKE: "electric_bike",
} as const;

// Restaurant Status
export const RESTAURANT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  PENDING_APPROVAL: "pending_approval",
} as const;

// Cuisine Types
export const CUISINE_TYPES = {
  AMERICAN: "american",
  ITALIAN: "italian",
  CHINESE: "chinese",
  MEXICAN: "mexican",
  INDIAN: "indian",
  JAPANESE: "japanese",
  THAI: "thai",
  MEDITERRANEAN: "mediterranean",
  FAST_FOOD: "fast_food",
  PIZZA: "pizza",
  BURGERS: "burgers",
  SEAFOOD: "seafood",
  VEGETARIAN: "vegetarian",
  VEGAN: "vegan",
  DESSERTS: "desserts",
  COFFEE: "coffee",
  OTHER: "other",
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  ORDER_UPDATE: "order_update",
  PAYMENT_RECEIVED: "payment_received",
  DRIVER_ASSIGNED: "driver_assigned",
  DELIVERY_COMPLETED: "delivery_completed",
  INVESTMENT_CONFIRMED: "investment_confirmed",
  CONTRACT_DEPLOYED: "contract_deployed",
  KYC_APPROVED: "kyc_approved",
  SYSTEM_ALERT: "system_alert",
} as const;

// WebSocket Message Types
export const WS_MESSAGE_TYPES = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  SUBSCRIBE: "subscribe",
  UNSUBSCRIBE: "unsubscribe",
  ORDER_UPDATE: "order_update",
  DRIVER_LOCATION: "driver_location",
  PAYMENT_UPDATE: "payment_update",
  SYSTEM_NOTIFICATION: "system_notification",
  HEARTBEAT: "heartbeat",
} as const;

// Investment Tiers
export const INVESTMENT_TIERS = {
  STARTER: {
    name: "Starter",
    minAmount: 500,
    maxAmount: 2499,
    benefits: [
      "Platform equity",
      "$FBT tokens",
      "Quarterly updates"
    ]
  },
  GROWTH: {
    name: "Growth",
    minAmount: 2500,
    maxAmount: 9999,
    benefits: [
      "All Starter benefits",
      "Monthly calls",
      "DAO voting rights",
      "Beta access"
    ]
  },
  VENTURE: {
    name: "Venture",
    minAmount: 10000,
    maxAmount: null,
    benefits: [
      "All Growth benefits",
      "Advisory board seat",
      "White-label licensing",
      "Revenue sharing"
    ]
  }
} as const;

// Token Information
export const TOKENS = {
  FBT: {
    symbol: "FBT",
    name: "FastBite Token",
    decimals: 18,
    totalSupply: "1000000000", // 1 billion
    description: "Native token for FastBite Pro ecosystem",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    description: "Stablecoin for payments",
  }
} as const;

// Staking Rewards
export const STAKING_CONFIG = {
  MIN_STAKE_AMOUNT: "100", // Minimum FBT to stake
  REWARD_RATE: 0.12, // 12% APY
  LOCK_PERIOD: 30, // 30 days minimum lock
  COMPOUND_FREQUENCY: 7, // Compound weekly
} as const;

// DAO Configuration
export const DAO_CONFIG = {
  VOTING_DELAY: 1, // 1 day
  VOTING_PERIOD: 7, // 7 days
  PROPOSAL_THRESHOLD: "10000", // 10,000 FBT tokens
  QUORUM_PERCENTAGE: 10, // 10% of total supply
} as const;

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_DOCUMENT_TYPES: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
} as const;

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  ETHEREUM_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection and try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  INVALID_CREDENTIALS: "Invalid username or password.",
  WALLET_NOT_CONNECTED: "Please connect your wallet to continue.",
  INSUFFICIENT_BALANCE: "Insufficient balance for this transaction.",
  TRANSACTION_FAILED: "Transaction failed. Please try again.",
  INVALID_ADDRESS: "Invalid Ethereum address format.",
  FILE_TOO_LARGE: "File size exceeds the maximum limit.",
  INVALID_FILE_TYPE: "Invalid file type. Please select a valid file.",
  FORM_VALIDATION_ERROR: "Please correct the errors in the form.",
  KYC_REQUIRED: "KYC verification is required for this action.",
  INVESTMENT_LIMIT_EXCEEDED: "Investment amount exceeds the allowed limit.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Successfully logged in.",
  REGISTRATION_SUCCESS: "Account created successfully.",
  ORDER_PLACED: "Order placed successfully.",
  PAYMENT_CONFIRMED: "Payment confirmed.",
  CONTRACT_DEPLOYED: "Smart contract deployed successfully.",
  INVESTMENT_CONFIRMED: "Investment confirmed.",
  PROFILE_UPDATED: "Profile updated successfully.",
  SETTINGS_SAVED: "Settings saved successfully.",
  FILE_UPLOADED: "File uploaded successfully.",
  KYC_SUBMITTED: "KYC documents submitted for review.",
} as const;

// Theme Colors (matching the design reference)
export const THEME_COLORS = {
  PRIMARY: {
    50: "hsl(214, 100%, 97%)",
    500: "hsl(207, 90%, 54%)",
    600: "hsl(207, 90%, 50%)",
    700: "hsl(207, 89%, 42%)",
    900: "hsl(207, 89%, 25%)",
  },
  ORANGE: {
    400: "hsl(22, 92%, 61%)",
    500: "hsl(20, 91%, 52%)",
    600: "hsl(18, 87%, 45%)",
  },
  GRAY: {
    50: "hsl(0, 0%, 98%)",
    100: "hsl(0, 0%, 96%)",
    200: "hsl(0, 0%, 89%)",
    300: "hsl(0, 0%, 83%)",
    400: "hsl(0, 0%, 64%)",
    500: "hsl(0, 0%, 45%)",
    600: "hsl(0, 0%, 32%)",
    700: "hsl(0, 0%, 25%)",
    800: "hsl(0, 0%, 15%)",
    900: "hsl(0, 0%, 9%)",
  },
} as const;

// Chart Colors for Analytics
export const CHART_COLORS = [
  "hsl(207, 90%, 54%)", // Primary blue
  "hsl(20, 91%, 52%)", // Orange
  "hsl(142, 71%, 45%)", // Green
  "hsl(262, 83%, 58%)", // Purple
  "hsl(48, 96%, 53%)", // Yellow
  "hsl(339, 82%, 52%)", // Pink
  "hsl(200, 98%, 39%)", // Cyan
  "hsl(15, 86%, 55%)", // Red-orange
] as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  INPUT: "yyyy-MM-dd",
  DATETIME: "MMM dd, yyyy 'at' h:mm a",
  TIME: "h:mm a",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: "fastbite_user",
  WALLET: "fastbite_wallet",
  THEME: "fastbite_theme",
  LANGUAGE: "fastbite_language",
  SIDEBAR_STATE: "fastbite_sidebar_state",
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  CROWDFUNDING_ENABLED: true,
  WEB3_ENABLED: true,
  REAL_TIME_TRACKING: true,
  AI_ROUTING: true,
  DAO_GOVERNANCE: true,
  MULTI_LANGUAGE: false,
  DARK_MODE: false,
} as const;

// Admin Wallet Address (from the provided address)
export const ADMIN_WALLET = "0xCc380FD8bfbdF0c020de64075b86C84c2BB0AE79" as const;

// Default values
export const DEFAULTS = {
  CURRENCY: "USD",
  LANGUAGE: "en",
  TIMEZONE: "UTC",
  DELIVERY_RADIUS: 5, // miles
  ORDER_TIMEOUT: 30, // minutes
  DRIVER_TIMEOUT: 10, // minutes
} as const;

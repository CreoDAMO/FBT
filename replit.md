# FastBite Pro - Multi-Platform Food Delivery System

## Overview

FastBite Pro is a comprehensive full-stack food delivery platform featuring a modern React frontend with Express.js backend. The system integrates traditional food delivery services with Web3 tokenomics, crowdfunding capabilities, and smart contract functionality. Built using TypeScript, the application supports multiple user roles (customers, drivers, merchants, admins, investors) and implements a robust database schema with PostgreSQL and Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI with shadcn/ui components
- **Styling**: Tailwind CSS with custom theme variables
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Custom JWT-based authentication system
- **WebSocket**: Real-time communication for order tracking and notifications
- **API Design**: RESTful endpoints with proper error handling

## Key Components

### Database Schema
The application implements a comprehensive database schema with the following key entities:
- **Users**: Multi-role user system (customer, driver, merchant, admin, investor)
- **Restaurants**: Merchant management with operational data
- **Menu Items**: Product catalog with pricing and categorization
- **Orders**: Complete order lifecycle management
- **Campaigns**: Crowdfunding and investment tracking
- **Smart Contracts**: Blockchain contract deployment and management
- **Tokens**: Custom token economics with user balance tracking
- **Metrics**: Platform analytics and KPI tracking

### User Interface Modules
- **Dashboard**: Real-time metrics and platform overview
- **Order System**: Customer ordering interface and management
- **Driver Portal**: Delivery management and earnings tracking
- **Merchant Hub**: Restaurant management and analytics
- **Crowdfunding**: Investment opportunities and funding progress
- **Tokenomics**: $FBT token distribution and DAO governance
- **Smart Contracts**: Contract deployment and management tools
- **Admin Panel**: Platform administration and white-label management
- **Compliance**: KYC/AML verification and regulatory tools
- **Analytics**: Cross-platform metrics and business intelligence

### Web3 Integration
- **Wallet Connection**: MetaMask and Coinbase Wallet support
- **Smart Contracts**: ERC-20 token deployment and DAO governance
- **Network Support**: Base Mainnet and Sepolia testnet
- **Token Economics**: $FBT token with staking and rewards system

## Data Flow

### Order Processing Flow
1. Customer places order through the order system
2. Order stored in PostgreSQL database via Drizzle ORM
3. Real-time notifications sent via WebSocket to merchants and drivers
4. Status updates propagated through the system
5. Payment processing with support for traditional and crypto payments

### Authentication Flow
1. User login/registration through custom auth system
2. JWT token generation and validation
3. Role-based access control for different user types
4. Session persistence with localStorage integration

### Real-time Communication
1. WebSocket connection established on frontend
2. Real-time updates for order status, driver location, and notifications
3. Automatic reconnection logic for connection stability

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Query Management**: TanStack Query for server state
- **Web3**: ethers.js for blockchain interactions
- **Styling**: Tailwind CSS with PostCSS

### Development Tools
- **TypeScript**: Full type safety across the stack
- **Vite**: Fast development server and build tool
- **ESBuild**: Production bundling for server code
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Development Environment
- Vite development server for frontend hot reload
- tsx for TypeScript execution in development
- Replit-specific plugins for enhanced development experience

### Production Build
- Vite builds the React frontend to static assets
- ESBuild bundles the Express server for production
- Database migrations handled via Drizzle Kit
- Environment variables for configuration management

### Database Management
- Drizzle migrations for schema changes
- Connection pooling via Neon serverless
- Environment-based configuration for different deployment stages

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 01, 2025. Initial setup
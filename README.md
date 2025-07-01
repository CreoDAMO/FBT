# 🍽️ FastBite Pro — From Demo to Disruption

**Created by Jacque Antoine DeGraff**

FastBite Pro is the ethical, AI-powered, Web3-enhanced food delivery platform that reimagines logistics through decentralization, transparency, and community empowerment. With a focus on driver prosperity, AI-driven logistics, and Web3 tokenomics, FastBite Pro is the **Shopify of Food Delivery**, enabling white-labeled, branded platforms for restaurants, franchises, and regional operators.

---

## 🌍 Vision: The Human-Augmented Autonomous Logistics Network

FastBite Pro redefines food delivery with:
- 🧑‍🔧 **Fair wages, full benefits, and 100% tips** for drivers
- 🤖 **AI-assisted delivery with human control**, not automation
- 🔗 **On-chain transparency** for orders, wages, and ratings
- 🗳️ **DAO-led governance** for ethical gig work
- 🌐 **White-label PaaS**: Custom tokens, branding, and governance for partners

---

## 📦 Tech Stack

| Layer        | Technologies                                                                 |
|--------------|------------------------------------------------------------------------------|
| **Frontend** | React 19, Next.js 14, Tailwind CSS 4.0, TypeScript 5.0, Apollo Client, Ethers.js, Coinbase Wallet SDK, WebSockets, Mapbox |
| **Backend**  | Node.js 18, Express/Fastify, Apollo Server, PostgreSQL, MongoDB, Redis, Kafka, Hardhat |
| **AI/ML**    | Orion AI (FastAPI, TensorFlow, BigQuery) for routing, demand prediction, fatigue detection |
| **Web3**     | Coinbase AgentKit, Base Appchain (L2), Solidity 0.8.0, Chainlink, OpenZeppelin Contracts |
| **DevOps**   | Docker, Kubernetes, GitHub Actions, Vercel, AWS ECS, Prometheus, Grafana, Sentry, ELK Stack |

---

## 🧠 Core Features

### ✅ Customers
- Seamless food ordering with map-based tracking
- Transparent pricing with blockchain-verified delivery
- Real-time updates via WebSockets
- $FBT rewards for loyalty and referrals

### ✅ Drivers
- AI-powered routing (Orion AI)
- Instant USDC payouts via Coinbase AgentKit
- Guaranteed wage + full benefits dashboard
- DAO voting for platform governance

### ✅ Merchants
- Commission-free SaaS subscription model
- Menu & order dashboard with AI-driven insights
- Smart Hub coordination for efficient delivery
- Branded token and loyalty programs

### ✅ Admins
- **Smart Contract Deployment**: Deploy $FBT tokens, DAOs, payouts, and escrow contracts
- Compliance dashboard with KYC/AML and audit logs
- Real-time alerts for security risks or contract violations
- White-label configurator for branded platforms
- Blockchain explorer integration for transaction transparency

---

## 🛡️ Admin Dashboard: Smart Contract Deployment System

The Admin Panel includes a **Smart Contract Deployment System**, enabling admins to deploy and manage branded smart contracts for white-label instances. This feature transforms FastBite Pro into a **Web3 PaaS**, supporting custom tokens, DAOs, and payout systems.

### Features
- **Smart Contract Wizard**: Step-by-step UI for deploying:
  - ERC-20 tokens (e.g., $FBT or $PARTNER_TOKEN)
  - DAO governance contracts (OpenZeppelin Governor)
  - Payout contracts (USDC, multi-currency)
  - Escrow contracts (order payments)
  - Loyalty rewards contracts
- **White-Label Configurator**: Customize tokenomics, branding (logo, colors), and social links
- **Real-Time Deployment Dashboard**: Track transaction status, gas usage, and verification
- **Security & Compliance**:
  - RBAC (super_admin only)
  - Multi-sig wallet (Gnosis Safe) for production
  - Audit logging to MongoDB
  - KYC/AML via Persona/Sumsub
  - Slither/MythX vulnerability scanning
- **Multi-Network Support**: Base Mainnet/Testnet, Ethereum, Polygon, BSC
- **Analytics**: Monitor contract usage, TVL, staking, and DAO participation

### Example Workflow
1. **Select Contract Type**: Choose Token, DAO, or Payout
2. **Configure Parameters**:
   - Token: Name, symbol, supply, allocations (drivers, merchants, customers)
   - Branding: Platform name, logo URI, website
   - DAO: Voting threshold, proposal period
3. **Select Network**: Base Mainnet, Testnet, or others
4. **Deploy**: Connect wallet (Coinbase/Metamask), estimate gas, and deploy
5. **Verify & Save**: Auto-verify on Basescan; store metadata in MongoDB

---

## 💰 Tokenomics: `$FBT`

The FastBite Token ($FBT) powers loyalty, governance, and rewards:
- **Use Cases**: DAO voting, staking, tipping, gamified rewards
- **Supply**: 1B capped, 0.5% quarterly burn
- **Distribution**:
  - 50% Drivers
  - 20% Customers
  - 15% Merchants
  - 10% Ecosystem Growth
  - 5% DAO Treasury
- **White-Label Tokens**: Partners can deploy branded tokens (e.g., $PIZZAPALACE) with custom allocations
- **Compliance**: KYC/AML via Persona, Reg CF/D friendly
- **Oracles**: Chainlink for real-time ETH/USD/USDC conversions

---

## 🧱 Microservice Architecture

| Service                  | Purpose                                              |
|--------------------------|------------------------------------------------------|
| `user-service`           | Auth, RBAC, KYC/AML, user profiles                  |
| `driver-service`         | Scheduling, earnings, benefits, location tracking    |
| `order-service`          | Order lifecycle, WebSocket updates, AI recommendations |
| `payment-service`        | Stripe, USDC payouts, Web3 escrow                    |
| `web3-service`           | Smart contract deployment, Appchain logging, wallet sync |
| `ai-logistics-service`   | Orion AI routing, demand prediction, fatigue detection |
| `admin-service`          | Admin dashboard, compliance, audit tools, contract deployment |
| `restaurant-service`     | Menu management, order prep, analytics               |
| `websocket-service`      | Real-time updates for customers, drivers, admins     |
| `tenant-service`         | White-label config management, branding              |
| `monitoring-service`     | Contract performance, TVL, DAO analytics             |

**Databases**:
- PostgreSQL: Structured data (users, orders, payments)
- MongoDB: Flexible schemas (menus, contract metadata)
- Redis: Caching, sessions, queues
- InfluxDB: Time-series (location, AI logs)
- BigQuery: Analytics warehouse

---

## 🧠 Orion AI System

- **Routing**: Optimizes delivery paths with crime/weather awareness
- **Demand Prediction**: Forecasts order volume for Smart Hub prep
- **Fatigue Detection**: Monitors driver workload for safety
- **Failover**: Redis + CRON with Appchain replay for reliability
- **Receipts**: AI-generated delivery confirmations and updates

---

## 🏗️ Smart Hubs

- **Physical**: EV charging, driver lounges, robotic pre-staging
- **Virtual**: Real-time coordination for lockers and drop-offs
- **Customization**: Language, food filters, cultural preferences
- **B2B**: Shared logistics for local businesses (FastBite Local)

---

## 📈 Business Model

- **Consumer**: Prime-style membership for zero delivery fees
- **Merchant**: Flat-rate SaaS, no commissions
- **B2B**: Micro-logistics for last-mile delivery
- **White-Label**: Licensing kits for regional cooperatives
- **SaaS Revenue**: Setup fees ($5K-$10K), monthly subscriptions ($500-$2K), transaction fees (1-2%)

---

## 📢 Crowdfunding Portal

A dedicated app for VC and public investment:
- **Tech**: React, Next.js, Tailwind, Framer Motion
- **Payments**: Stripe, USDC, ETH, BTC via Coinbase Commerce
- **Compliance**: Persona KYC, Reg CF/D forms
- **Features**: Real-time raise bar, pitch deck, investor dashboard
- **Location**: `/crowdfunding-app`

---

## 🛠 Developer Setup

### Prerequisites
- Node.js 18+
- Yarn or pnpm
- Docker & docker-compose
- PostgreSQL 15+, MongoDB 6+, Redis 7+, InfluxDB
- API keys: Coinbase (Appchain, AgentKit), Stripe, Persona, Twilio, SendGrid, Etherscan
- Hardhat for smart contract development

### Replit Setup
1. **Fork the Project**:
   - Import `https://github.com/CreoDAMO/FastBite_Pro.git` into Replit
2. **Configure .replit**:
   ```bash
   run = "pnpm install && pnpm dev"
   [env]
   DATABASE_URL="postgresql://user:pass@localhost:5432/fastbite"
   REDIS_URL="redis://localhost:6379"
   COINBASE_APP_ID="your-app-id"
   COINBASE_AGENTKIT_KEY="your-agentkit-key"
   NEXT_PUBLIC_BASE_RPC="https://base.mainnet.rpc"
   ```
3. **Install Dependencies**:
   ```bash
   pnpm install
   ```
4. **Start Databases**:
   - Use Replit’s database integrations or Docker:
     ```bash
     docker-compose up -d
     ```
5. **Run Migrations**:
   ```bash
   cd backend && pnpm migrate
   ```
6. **Start Dev Server**:
   ```bash
   pnpm dev
   ```
7. **Access**:
   - Frontend: `http://localhost:3000` (or Replit URL)
   - Admin Panel: `http://localhost:3000/admin`
   - GraphQL: `http://localhost:4000/graphql`

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/fastbitepro/crowdfunding
   cd fastbite-pro
   ```
2. Install dependencies:
   ```bash
   cd frontend && pnpm install
   cd ../backend && pnpm install
   ```
3. Copy `.env.example` to `.env` and configure keys:
   ```bash
   cp .env.example .env
   ```
4. Start databases:
   ```bash
   docker-compose up -d
   ```
5. Run migrations:
   ```bash
   cd backend && pnpm migrate
   ```
6. Start backend:
   ```bash
   pnpm dev
   ```
7. Start frontend:
   ```bash
   cd ../frontend && pnpm dev
   ```
8. Run tests:
   ```bash
   pnpm test
   ```

### Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
EXPOSE 4000
CMD ["pnpm", "start"]
```

### Testing
- **Unit**: Jest, React Testing Library
- **Integration**: Supertest, Apollo Client
- **Smart Contracts**: Hardhat
- **E2E**: Cypress
```bash
pnpm test
```

---

## 🛣 Roadmap

| Phase | Features | Timeline |
|-------|----------|----------|
| **MVP** | Frontend, microservices, Orion AI, compliance dashboard | Completed |
| **Smart Contract Deployment** | Admin panel wizard, white-label tokenomics, multi-network | Jul 1 - Aug 24, 2025 |
| **Smart Hubs & DAO** | Physical/virtual hubs, DAO launch | Q3 2025 |
| **Crowdfunding & $FBT Sale** | Public sale, Reg CF/D compliance | Q4 2025 |
| **Pilot Launch** | Miami, Austin, or Amsterdam | Q1 2026 |
| **Global Expansion** | White-label scaling, multi-region hubs | 2026 |

---

## 🧩 Folder Structure

```
fastbite-pro/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── SmartContractService.ts
│   │   │   ├── TenantService.ts
│   │   │   ├── MonitoringService.ts
│   │   │   ├── UserService.ts
│   │   │   ├── OrderService.ts
│   │   │   └── ...
│   │   ├── graphql/
│   │   │   ├── schema.graphql
│   │   │   └── resolvers.ts
│   │   ├── contracts/
│   │   │   ├── CustomToken.sol
│   │   │   ├── ContractFactory.sol
│   │   │   └── ...
│   │   ├── migrations/
│   │   ├── __tests__/
│   │   └── utils/
│   ├── Dockerfile
│   ├── .env.example
│   ├── hardhat.config.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── admin/page.tsx
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── SmartContractWizard.tsx
│   │   │   ├── DeploymentProgress.tsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── Web3Service.ts
│   │   │   └── ...
│   │   ├── __tests__/
│   │   └── types/
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── package.json
├── crowdfunding-app/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── ...
│   ├── README.md
│   └── package.json
├── docker-compose.yml
├── .replit
├── Grimoire.md
├── RecommendedTools.md
├── PatchNotes.md
└── README.md
```

---

## 🌐 Additional Resources

- **The Creation Of FastBite Pro.md**: Vision and technical blueprint
- **docs/The Creation Of FastBite Pro From Simple Demo To The Ultimate Game Changer Frontend & Backend By- Jacque Antoine DeGraff.md**: Prompt codex for AI agents
- **RecommendedTools.md**: Developer tool recommendations
- **ReplitDeployInstructions.md**: Replit-specific setup guide
- **PatchNotes.md**: Version history and updates
- **Docs**:
  - [Coinbase AgentKit](https://docs.coinbase.com/agentkit)
  - [Base Appchain](https://base.org)
  - [OpenZeppelin Contracts](https://docs.openzeppelin.com)
  - [Replit Agent](https://replit.com/docs/agents)

---

## 🤝 Contributing

We welcome ethical developers aligned with our mission to disrupt the gig economy. Please:
1. Review `Grimoire.md` for coding standards
2. Submit issues before major PRs
3. Follow Apache 2.0 License guidelines

---

## 📄 License

Apache 2.0 License © 2025 Jacque Antoine DeGraff

---

## 1. `.replit` File

This file configures the Replit environment to run the FastBite Pro backend and frontend, including the smart contract deployment setup.

```plaintext
# .replit
run = "pnpm install && pnpm --filter backend dev & pnpm --filter frontend dev & pnpm --filter crowdfunding-app dev & wait"
[env]
NODE_ENV = "development"
DATABASE_URL = "postgresql://user:pass@localhost:5432/fastbite"
MONGO_URL = "mongodb://localhost:27017/fastbite"
REDIS_URL = "redis://localhost:6379"
COINBASE_APP_ID = "your-coinbase-app-id"
COINBASE_AGENTKIT_KEY = "your-agentkit-key"
NEXT_PUBLIC_BASE_RPC = "https://base-sepolia-rpc.com"
ETHERSCAN_API_KEY = "your-etherscan-api-key"
PERSONA_API_KEY = "your-persona-api-key"
STRIPE_API_KEY = "your-stripe-api-key"
TWILIO_SID = "your-twilio-sid"
TWILIO_AUTH_TOKEN = "your-twilio-auth-token"
SENDGRID_API_KEY = "your-sendgrid-api-key"
ADMIN_WALLET = "0xCc380FD8bfbdF0c020de64075b86C84c2BB0AE79"

[packages]
nodejs = "18.x"
pnpm = "8.x"

[commands]
migrate = "cd backend && pnpm migrate"
test = "pnpm test"
build = "pnpm build"
deploy-contracts = "cd backend && npx hardhat run scripts/deploy.ts --network baseSepolia"

[[ports]]
localPort = 3000
externalPort = 3000
protocol = "tcp"

[[ports]]
localPort = 4000
externalPort = 4000
protocol = "tcp"
```

**Notes**:
- The `run` command starts the backend, frontend, and crowdfunding app concurrently.
- Environment variables include the provided `ADMIN_WALLET` address.
- The `deploy-contracts` command runs the Hardhat deployment script.
- Ports 3000 (frontend) and 4000 (backend) are exposed for Replit’s web interface.

---

## 2. `ReplitDeployInstructions.md`

This guide provides detailed instructions for setting up and deploying FastBite Pro on Replit, with a focus on the Smart Contract Deployment System.

```markdown
# Replit Deployment Instructions for FastBite Pro

This guide explains how to set up, run, and deploy **FastBite Pro** on Replit, including the Admin Panel’s **Smart Contract Deployment System**. The project uses a monorepo structure with backend, frontend, and crowdfunding app components.

## Prerequisites

- **Replit Account**: Sign up at [replit.com](https://replit.com).
- **API Keys**:
  - Coinbase (Appchain, AgentKit)
  - Etherscan (for contract verification)
  - Persona (KYC/AML)
  - Stripe, Twilio, SendGrid
- **Base Sepolia Testnet Wallet**: Fund with testnet ETH (e.g., via [Base Faucet](https://base.org/faucet)).
- **Node.js 18+**, **pnpm 8+**, and **Docker** (handled by Replit).

## Setup Steps

1. **Fork the Repository**
   - Import the project from `https://github.com/CreoDAMO/FastBite_Pro.git` into Replit.
   - Alternatively, create a new Replit project and upload the project files.

2. **Configure `.replit`**
   - Ensure the `.replit` file is present in the root directory (see below for contents).
   - Update environment variables in the Replit Secrets tab:
     ```plaintext
     DATABASE_URL="postgresql://user:pass@localhost:5432/fastbite"
     MONGO_URL="mongodb://localhost:27017/fastbite"
     REDIS_URL="redis://localhost:6379"
     COINBASE_APP_ID="your-coinbase-app-id"
     COINBASE_AGENTKIT_KEY="your-agentkit-key"
     NEXT_PUBLIC_BASE_RPC="https://base-sepolia-rpc.com"
     ETHERSCAN_API_KEY="your-etherscan-api-key"
     PERSONA_API_KEY="your-persona-api-key"
     STRIPE_API_KEY="your-stripe-api-key"
     TWILIO_SID="your-twilio-sid"
     TWILIO_AUTH_TOKEN="your-twilio-auth-token"
     SENDGRID_API_KEY="your-sendgrid-api-key"
     ADMIN_WALLET="0xCc380FD8bfbdF0c020de64075b86C84c2BB0AE79"
     ```

3. **Install Dependencies**
   - Run the following in the Replit Shell:
     ```bash
     pnpm install
     ```

4. **Set Up Databases**
   - Replit doesn’t natively support PostgreSQL/MongoDB/Redis. Use external services or Replit’s Docker support:
     ```bash
     docker-compose up -d
     ```
   - Alternatively, use managed services (e.g., MongoDB Atlas, Supabase) and update `DATABASE_URL`, `MONGO_URL`, `REDIS_URL`.

5. **Run Migrations**
   - Initialize database schemas:
     ```bash
     cd backend && pnpm migrate
     ```

6. **Start the Application**
   - Run the project:
     ```bash
     pnpm dev
     ```
   - Access:
     - Frontend: `http://<repl-id>.repl.co:3000`
     - Admin Panel: `http://<repl-id>.repl.co:3000/admin`
     - GraphQL: `http://<repl-id>.repl.co:4000/graphql`

7. **Deploy Smart Contracts**
   - Use the Hardhat CLI to deploy contracts to Base Sepolia:
     ```bash
     cd backend && npx hardhat run scripts/deploy.ts --network baseSepolia
     ```
   - Alternatively, use the Admin Panel’s Smart Contract Wizard (see `admin/README.md`).

8. **Test the Application**
   - Run unit, integration, and E2E tests:
     ```bash
     pnpm test
     ```

## Smart Contract Deployment

- **Admin Panel**: Navigate to `/admin/contracts` and use the **Smart Contract Wizard** to deploy tokens, DAOs, or payout contracts.
- **CLI**: Use the Hardhat script (`backend/scripts/deploy.ts`) for programmatic deployments.
- **Network**: Default is Base Sepolia; configure `hardhat.config.ts` for other networks (e.g., Base Mainnet, Ethereum).
- **Verification**: Contracts are auto-verified on Basescan using the Etherscan API.

## Troubleshooting

- **Dependency Issues**: Clear Replit’s cache and rerun `pnpm install`.
- **Database Connection**: Ensure `DATABASE_URL`, `MONGO_URL`, and `REDIS_URL` are correct.
- **Web3 Errors**: Verify `NEXT_PUBLIC_BASE_RPC` and `ADMIN_WALLET` are set, and the wallet has testnet ETH.
- **Port Conflicts**: Check Replit’s port settings (3000 for frontend, 4000 for backend).

## Deployment to Production

- **Vercel**: Deploy frontend to Vercel:
  ```bash
  cd frontend && vercel
  ```
- **AWS ECS**: Deploy backend microservices using Docker:
  ```bash
  cd backend && docker build -t fastbite-backend . && docker push
  ```
- **Contracts**: Deploy to Base Mainnet after testing:
  ```bash
  npx hardhat run scripts/deploy.ts --network baseMainnet
  ```

## Support

- **Docs**: See `docs/The Creation Of FastBite Pro From Simple Demo To The Ultimate Game Changer Frontend & Backend By- Jacque Antoine DeGraff.md`, `admin/README.md`, and `crowdfunding-app/README.md`.
- **Issues**: File bugs at `https://github.com/fastbitepro/crowdfunding/issues`.
- **Contact**: Reach out to the team via Discord or email.

---

Happy coding! 🚀 Let’s disrupt food delivery with Web3!
```

---

## 3. `admin/README.md`

This file documents the Admin Panel, with a focus on the Smart Contract Deployment System.

```markdown
# FastBite Pro Admin Panel

The **FastBite Pro Admin Panel** (`/frontend/src/app/admin`) provides a centralized interface for platform administrators to manage users, orders, compliance, and the **Smart Contract Deployment System**. This README focuses on the smart contract features, enabling admins to deploy and customize Web3 components for white-label instances.

## Features

- **Smart Contract Wizard**: Deploy and configure:
  - **ERC-20 Tokens**: Customizable $FBT or branded tokens (e.g., $PIZZAPALACE).
  - **DAO Governance**: OpenZeppelin Governor-based contracts for driver/merchant voting.
  - **Payout Contracts**: USDC-based driver payouts with escrow.
  - **Loyalty Rewards**: Customer and merchant reward systems.
- **White-Label Configurator**: Set branding (logo, colors, social links) and tokenomics (supply, allocations).
- **Real-Time Deployment Dashboard**: Monitor transaction status, gas usage, and contract verification.
- **Compliance Dashboard**: Exportable audit logs, KYC/AML integration (Persona), and regulatory reports.
- **Security**:
  - Role-Based Access Control (RBAC) via JWT/Auth0 (`super_admin` role).
  - Multi-sig wallet (Gnosis Safe) for production deployments.
  - Slither/MythX vulnerability scanning.
  - Audit logging to MongoDB.
- **Multi-Network Support**: Base Mainnet/Testnet, Ethereum, Polygon, BSC.
- **Analytics**: Track contract usage, total value locked (TVL), staking, and DAO participation.

## Setup

1. **Navigate to Admin Panel**:
   - URL: `http://localhost:3000/admin` (or Replit/Vercel URL).
   - Login: Requires `super_admin` role (configured via `user-service`).

2. **Dependencies**:
   - Frontend: React 19, Next.js 14, Apollo Client, Ethers.js, Coinbase Wallet SDK.
   - Backend: Node.js 18, Apollo Server, Hardhat, MongoDB.

3. **Environment Variables**:
   - Add to `frontend/.env` and `backend/.env`:
     ```plaintext
     NEXT_PUBLIC_BASE_RPC="https://base-sepolia-rpc.com"
     ETHERSCAN_API_KEY="your-etherscan-api-key"
     ADMIN_WALLET="0xCc380FD8bfbdF0c020de64075b86C84c2BB0AE79"
     ```

4. **Run the Admin Panel**:
   - Start frontend:
     ```bash
     cd frontend && pnpm dev
     ```
   - Start backend:
     ```bash
     cd backend && pnpm dev
     ```

## Smart Contract Deployment Workflow

1. **Access the Wizard**:
   - Navigate to `/admin/contracts` and click "Deploy New Contract".
2. **Select Contract Type**:
   - Options: Token, DAO, Payout, Escrow, Rewards.
3. **Configure Parameters**:
   - **Token**: Name, symbol, supply, allocations (drivers, merchants, customers).
   - **Branding**: Platform name, logo URI, website, social links.
   - **DAO**: Voting threshold, proposal period, timelock.
4. **Select Network**:
   - Default: Base Sepolia (testnet).
   - Production: Base Mainnet (requires multi-sig).
5. **Deploy**:
   - Connect wallet (Coinbase/Metamask) or use `ADMIN_WALLET`.
   - Review gas estimate and confirm.
6. **Monitor**:
   - View real-time progress (compiling, deploying, verifying).
   - Check contract address and Basescan link.
7. **Save Tenant Config**:
   - Store white-label branding and contract metadata via `tenant-service`.

## Key Components

- **SmartContractWizard.tsx**: React component for step-by-step deployment.
- **DeploymentProgress.tsx**: Real-time transaction status display.
- **SmartContractService.ts**: Backend service for compilation, deployment, and verification.
- **TenantService.ts**: Manages white-label configurations.
- **MonitoringService.ts**: Tracks contract performance and analytics.

## Security & Compliance

- **RBAC**: Only `super_admin` can deploy contracts (enforced via `requireRole`).
- **Multi-Sig**: Production deployments require Gnosis Safe approvals.
- **Audit Logging**: All actions logged to MongoDB (`contracts` and `audit_logs` collections).
- **KYC/AML**: Admins must pass Persona checks for mainnet deployments.
- **Vulnerability Scanning**: Slither/MythX integration for pre-deployment checks.
- **Gas Limits**: Enforced to prevent abuse; estimates shown in UI.

## Testing

- **Unit Tests**: Jest for `SmartContractService.ts` and React components.
- **Integration Tests**: Apollo Client for GraphQL mutations.
- **E2E Tests**: Cypress for deployment workflow.
- **Contract Tests**: Hardhat for Solidity contracts.
  ```bash
  pnpm test
  ```

## Deployment

- **Frontend**: Deploy to Vercel:
  ```bash
  cd frontend && vercel
  ```
- **Backend**: Deploy to AWS ECS:
  ```bash
  cd backend && docker build -t fastbite-backend . && docker push
  ```
- **Contracts**: Deploy via Hardhat (see `backend/scripts/deploy.ts`).

## Troubleshooting

- **Wallet Issues**: Ensure `ADMIN_WALLET` has testnet ETH.
- **Network Errors**: Verify `NEXT_PUBLIC_BASE_RPC` and network settings in `hardhat.config.ts`.
- **GraphQL Errors**: Check Apollo Server logs (`http://localhost:4000/graphql`).

## Resources

- **docs/The Creation Of FastBite Pro From Simple Demo To The Ultimate Game Changer Frontend & Backend By- Jacque Antoine DeGraff.md**: Coding standards and AI agent prompts.
- **backend/contracts/**: Solidity templates (`CustomToken.sol`, `ContractFactory.sol`).
- **Coinbase AgentKit Docs**: [docs.coinbase.com/agentkit](https://docs.coinbase.com/agentkit).
- **Base Appchain**: [base.org](https://base.org).

---

Happy administrating! 🚀
```

---

## 4. `crowdfunding-app/README.md`

This file documents the crowdfunding portal for FastBite Pro’s public and VC investment.

```markdown
# FastBite Pro Crowdfunding Portal

The **Crowdfunding Portal** (`/crowdfunding-app`) is a standalone Next.js application for raising funds via public and VC investment, supporting FastBite Pro’s $FBT token sale and equity offerings. It integrates with Stripe, Coinbase Commerce, and Persona for compliance.

## Features

- **Investment Options**:
  - $FBT token purchase (USDC, ETH, BTC).
  - Equity investment (Reg CF/D compliant).
- **Real-Time Raise Bar**: Displays funds raised with Framer Motion animations.
- **Pitch Deck**: Interactive deck with platform vision and financials.
- **Compliance**:
  - KYC/AML via Persona.
  - Reg CF/D form generation.
  - Audit logging for investor transparency.
- **Investor Dashboard**: Tracks investments, $FBT balances, and rewards.
- **Payments**:
  - Fiat: Stripe (credit card, ACH).
  - Crypto: Coinbase Commerce (USDC, ETH, BTC).

## Setup

1. **Navigate to Crowdfunding App**:
   - Directory: `/crowdfunding-app`.
   - URL: `http://localhost:3001` (or Replit/Vercel URL).

2. **Dependencies**:
   - Next.js 14, React 19, Tailwind CSS 4.0, Framer Motion, Apollo Client, Ethers.js.

3. **Environment Variables**:
   - Add to `crowdfunding-app/.env`:
     ```plaintext
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-key"
     STRIPE_SECRET_KEY="your-stripe-secret-key"
     COINBASE_COMMERCE_API_KEY="your-coinbase-commerce-key"
     PERSONA_API_KEY="your-persona-api-key"
     NEXT_PUBLIC_BASE_RPC="https://base-sepolia-rpc.com"
     ADMIN_WALLET="0xCc380FD8bfbdF0c020de64075b86C84c2BB0AE79"
     ```

4. **Run the App**:
   ```bash
   cd crowdfunding-app && pnpm dev
   ```

## Key Components

- **RaiseBar.tsx**: Animated progress bar for funds raised.
- **InvestmentForm.tsx**: Form for fiat/crypto investments.
- **PitchDeck.tsx**: Interactive deck with platform details.
- **InvestorDashboard.tsx**: Displays user investments and $FBT balances.
- **ComplianceService.ts**: Handles KYC/AML and regulatory reporting.

## Workflow

1. **Access Portal**:
   - URL: `http://<repl-id>.repl.co:3001` or `crowdfunding.fastbitepro.com`.
2. **Complete KYC**:
   - Users submit identity via Persona.
3. **Invest**:
   - Choose fiat (Stripe) or crypto (Coinbase Commerce).
   - Confirm investment amount and sign transaction (if crypto).
4. **View Dashboard**:
   - Track investment status, $FBT allocation, and rewards.
5. **Export Reports**:
   - Admins can download Reg CF/D compliance reports.

## Security & Compliance

- **KYC/AML**: Mandatory Persona verification for all investors.
- **Audit Logging**: Investment actions logged to MongoDB.
- **Secure Payments**: Stripe for fiat, Coinbase Commerce for crypto.
- **RBAC**: Admin-only access to compliance reports (`super_admin`).

## Testing

- **Unit Tests**: Jest for React components and services.
- **Integration Tests**: Supertest for API endpoints.
- **E2E Tests**: Cypress for investment flow.
  ```bash
  cd crowdfunding-app && pnpm test
  ```

## Deployment

- **Vercel**:
  ```bash
  cd crowdfunding-app && vercel
  ```
- **Contracts**: $FBT sale contracts deployed via Admin Panel or Hardhat (see `backend/scripts/deploy.ts`).

## Troubleshooting

- **Payment Issues**: Verify Stripe/Coinbase API keys.
- **KYC Errors**: Check Persona API logs.
- **Wallet Connection**: Ensure `ADMIN_WALLET` is funded and connected.

## Resources

- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs).
- **Coinbase Commerce**: [commerce.coinbase.com](https://commerce.coinbase.com).
- **Persona**: [withpersona.com/docs](https://withpersona.com/docs).
- **docs/The Creation Of FastBite Pro From Simple Demo To The Ultimate Game Changer Frontend & Backend By- Jacque Antoine DeGraff.md**: Project-wide coding standards.

---

Fund the future of food delivery! 🚀
```

---

## 5. Hardhat Deployment Script

This script (`backend/scripts/deploy.ts`) enables CLI-based deployment of smart contracts to Base Sepolia or Mainnet, using the provided admin wallet address.

```typescript
// backend/scripts/deploy.ts
import { ethers } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { MongoClient } from 'mongodb';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const adminWallet = process.env.ADMIN_WALLET || '0xCc380FD8bfbdF0c020de64075b86C84c2BB0AE79';
  const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017/fastbite';

  // Contract configuration
  const config = {
    name: 'FastBite Token',
    symbol: 'FBT',
    initialSupply: ethers.utils.parseEther('1000000000'), // 1B tokens
    driverAllocation: 50, // 50%
    merchantAllocation: 15, // 15%
    customerAllocation: 20, // 20%
    platformName: 'FastBite Pro',
    logoUri: 'https://ipfs.io/ipfs/Qm...',
    websiteUrl: 'https://fastbitepro.com',
    stakingRate: 500, // 5% APY
    votingThreshold: 1000, // Min tokens for voting
  };

  // Deploy ContractFactory
  const factory = await deploy('ContractFactory', {
    from: deployer,
    log: true,
    autoMine: true,
  });

  // Deploy CustomToken via Factory
  const contractFactory = await ethers.getContractAt('ContractFactory', factory.address);
  const tx = await contractFactory.deployToken(
    config.name,
    config.symbol,
    config.initialSupply,
    adminWallet,
    config.driverAllocation,
    config.merchantAllocation,
    config.customerAllocation
  );
  const receipt = await tx.wait();

  const tokenAddress = receipt.events?.find(e => e.event === 'ContractDeployed')?.args?.contractAddress;

  console.log(`Token deployed at: ${tokenAddress}`);
  console.log(`Transaction hash: ${receipt.transactionHash}`);

  // Store metadata in MongoDB
  const mongo = new MongoClient(mongoUri);
  await mongo.connect();
  await mongo.db('fastbite').collection('contracts').insertOne({
    type: 'token',
    address: tokenAddress,
    abi: (await ethers.getContractFactory('CustomToken')).interface.format(),
    config,
    deployedBy: deployer,
    transactionHash: receipt.transactionHash,
    timestamp: new Date(),
    verificationStatus: 'pending',
  });
  await mongo.close();

  // Verify contract on Basescan
  try {
    await hre.run('verify:verify', {
      address: tokenAddress,
      constructorArguments: [
        config.name,
        config.symbol,
        config.initialSupply,
        adminWallet,
        config.driverAllocation,
        config.merchantAllocation,
        config.customerAllocation,
      ],
    });
    console.log('Contract verified on Basescan');
  } catch (error) {
    console.error('Verification failed:', error);
  }
};

export default func;
func.tags = ['CustomToken', 'ContractFactory'];
```

**Usage**:
1. Configure `hardhat.config.ts`:
   ```typescript
   import { HardhatUserConfig } from 'hardhat/config';
   import '@nomiclabs/hardhat-ethers';
   import '@nomiclabs/hardhat-etherscan';
   import 'hardhat-deploy';

   const config: HardhatUserConfig = {
     solidity: '0.8.0',
     namedAccounts: {
       deployer: {
         default: 0, // First account
       },
     },
     networks: {
       baseSepolia: {
         url: process.env.NEXT_PUBLIC_BASE_RPC || 'https://base-sepolia-rpc.com',
         accounts: [process.env.PRIVATE_KEY || ''],
       },
       baseMainnet: {
         url: 'https://base-mainnet-rpc.com',
         accounts: [process.env.PRIVATE_KEY || ''],
       },
     },
     etherscan: {
       apiKey: process.env.ETHERSCAN_API_KEY,
     },
   };

   export default config;
   ```
2. Run the deployment:
   ```bash
   cd backend
   npx hardhat run scripts/deploy.ts --network baseSepolia
   ```

---

## Integration with Deployment Address

The provided address (`0xCc380FD8bfbdF0c020de64075b86C84c2BB0AE79`) is set as the default `ADMIN_WALLET` in:
- `.replit`
- `frontend/.env` and `backend/.env`
- Hardhat deployment script
- Admin Panel’s Smart Contract Wizard

This wallet will:
- Own deployed contracts (e.g., `CustomToken`).
- Be used for multi-sig approvals in production (via Gnosis Safe).
- Receive initial token allocations and treasury funds.

**Note**: Ensure this wallet is funded with testnet ETH for Base Sepolia deployments (use [Base Faucet](https://base.org/faucet)).

---
# FastBite Pro - Ethical Food Delivery Platform

FastBite Pro is a revolutionary food delivery platform that combines blockchain transparency, AI optimization, and ethical driver treatment to create the future of food logistics.

## 🌟 Features

- **Blockchain Verified Transactions**: Every order recorded on-chain for complete transparency
- **Driver-First Ethics**: Guaranteed living wages and comprehensive benefits
- **AI-Powered Optimization**: Orion AI maximizes efficiency while prioritizing driver earnings
- **Instant Crypto Payouts**: Drivers receive earnings instantly in USDC
- **Zero Delivery Fees**: Sustainable flat-rate subscription model for restaurants
- **Smart Hubs**: Physical infrastructure supporting driver efficiency and well-being

## 🏗️ Architecture

### Frontend (Next.js 14 + React 19)
- Modern React with TypeScript
- Tailwind CSS 4.0 for styling
- Apollo Client for GraphQL
- Real-time WebSocket connections
- Coinbase SDK integration

### Backend (Node.js + Express)
- Microservices architecture
- GraphQL API with Apollo Server
- MongoDB + PostgreSQL + Redis
- WebSocket for real-time features
- Comprehensive authentication & authorization

### Blockchain Integration
- Smart contracts on Base network
- Coinbase AgentKit for payments
- FBT token for loyalty and governance
- DAO for driver council voting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB
- PostgreSQL
- Redis
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd fastbite-pro
```

2. **Install dependencies**
```bash
# Install dependencies for all services
npm run setup
```

3. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

4. **Database Setup**
```bash
# Run database migrations
npm run migrate
```

5. **Start Development Servers**
```bash
# Start all services in development mode
npm run dev
```

This will start:
- Frontend: http://0.0.0.0:3000
- Backend API: http://0.0.0.0:4000
- Crowdfunding App: http://0.0.0.0:3002

## 📱 Services

### Main Application (Port 3000)
- Customer ordering interface
- Driver dashboard
- Merchant management
- Admin panel
- Compliance monitoring

### Backend API (Port 4000)
- GraphQL endpoint: `/graphql`
- REST API: `/api/*`
- WebSocket connection
- Health check: `/health`

### Crowdfunding App (Port 3002)
- Investment platform
- Supporter tiers
- Progress tracking
- Community features

## 🛠️ Development

### Available Scripts

```bash
# Setup all dependencies
npm run setup

# Start all services
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Deploy smart contracts
npm run deploy-contracts

# Run database migrations
npm run migrate

# Lint code
npm run lint
```

### Project Structure

```
fastbite-pro/
├── frontend/                 # Main React application
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # React components
│   │   └── utils/           # Utility functions
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── routes/          # Express routes
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── utils/           # Utility functions
├── crowdfunding-app/        # Crowdfunding platform
├── contracts/               # Smart contracts
├── docs/                    # Documentation
└── scripts/                 # Deployment scripts
```

## 🔧 Configuration

### Environment Variables

Key environment variables to configure:

- `MONGODB_URI`: MongoDB connection string
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret for JWT tokens
- `COINBASE_APP_ID`: Coinbase application ID
- `STRIPE_SECRET_KEY`: Stripe secret key
- `OPENAI_API_KEY`: OpenAI API key

See `.env.example` for complete list.

### Database Setup

1. **MongoDB**: Document storage for flexible data
2. **PostgreSQL**: Relational data with ACID compliance
3. **Redis**: Caching and session management

### Blockchain Configuration

1. Deploy smart contracts to Base network
2. Configure Coinbase AgentKit integration
3. Set up wallet connections

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && npm test

# Run integration tests
npm run test:integration
```

## 🚀 Deployment

### Replit Deployment

This project is optimized for Replit deployment:

1. Import repository to Replit
2. Configure environment variables in Secrets
3. Run setup command
4. Deploy using Replit's deployment feature

### Production Deployment

1. **Build applications**
```bash
npm run build
```

2. **Deploy backend**
```bash
cd backend && npm start
```

3. **Deploy frontend**
```bash
cd frontend && npm start
```

4. **Deploy smart contracts**
```bash
npm run deploy-contracts
```

## 📊 Monitoring

- Health checks: `/health`
- Metrics: Prometheus integration
- Logging: Winston with structured logs
- Error tracking: Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌍 Vision

FastBite Pro represents the future of ethical technology - where innovation serves humanity, workers are treated with dignity, and transparency builds trust. Join us in revolutionizing the food delivery industry.

## 📞 Support

- Documentation: See `/docs` folder
- Issues: GitHub Issues
- Community: Join our Discord
- Email: support@fastbitepro.com

---

Built with ❤️ by the FastBite Pro team

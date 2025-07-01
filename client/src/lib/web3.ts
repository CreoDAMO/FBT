import { ethers } from "ethers";

// Web3 connection and wallet management
export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private chainId: number | null = null;

  // Base network configuration
  static readonly NETWORKS = {
    BASE_MAINNET: {
      chainId: 8453,
      name: "Base Mainnet",
      rpcUrl: "https://mainnet.base.org",
      blockExplorer: "https://basescan.org",
      currency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
      },
    },
    BASE_SEPOLIA: {
      chainId: 84532,
      name: "Base Sepolia",
      rpcUrl: "https://sepolia.base.org",
      blockExplorer: "https://sepolia.basescan.org",
      currency: {
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
      },
    },
  };

  // Check if MetaMask or compatible wallet is available
  static isWalletAvailable(): boolean {
    return typeof window !== "undefined" && !!window.ethereum;
  }

  // Connect to wallet
  async connectWallet(): Promise<{
    address: string;
    chainId: number;
    balance: string;
  } | null> {
    try {
      if (!Web3Service.isWalletAvailable()) {
        throw new Error("No wallet found. Please install MetaMask or Coinbase Wallet.");
      }

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Get network info
      const network = await this.provider.getNetwork();
      this.chainId = Number(network.chainId);

      // Get address and balance
      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);

      // Set up event listeners
      this.setupEventListeners();

      return {
        address,
        chainId: this.chainId,
        balance: ethers.formatEther(balance),
      };
    } catch (error) {
      console.error("Wallet connection failed:", error);
      return null;
    }
  }

  // Disconnect wallet
  disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.chainId = null;
  }

  // Switch to specific network
  async switchNetwork(chainId: number): Promise<boolean> {
    try {
      if (!window.ethereum) return false;

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });

      return true;
    } catch (error: any) {
      // If network not added, try to add it
      if (error.code === 4902) {
        return await this.addNetwork(chainId);
      }
      console.error("Failed to switch network:", error);
      return false;
    }
  }

  // Add network to wallet
  async addNetwork(chainId: number): Promise<boolean> {
    try {
      if (!window.ethereum) return false;

      const network = Object.values(Web3Service.NETWORKS).find(n => n.chainId === chainId);
      if (!network) return false;

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: network.name,
            rpcUrls: [network.rpcUrl],
            blockExplorerUrls: [network.blockExplorer],
            nativeCurrency: network.currency,
          },
        ],
      });

      return true;
    } catch (error) {
      console.error("Failed to add network:", error);
      return false;
    }
  }

  // Get current account info
  async getAccountInfo(): Promise<{
    address: string;
    balance: string;
    chainId: number;
  } | null> {
    try {
      if (!this.provider || !this.signer) return null;

      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);
      const network = await this.provider.getNetwork();

      return {
        address,
        balance: ethers.formatEther(balance),
        chainId: Number(network.chainId),
      };
    } catch (error) {
      console.error("Failed to get account info:", error);
      return null;
    }
  }

  // Deploy smart contract
  async deployContract(
    contractBytecode: string,
    abi: any[],
    constructorArgs: any[] = []
  ): Promise<{
    contract: ethers.Contract;
    deploymentTx: ethers.TransactionResponse;
  } | null> {
    try {
      if (!this.signer) throw new Error("Wallet not connected");

      const contractFactory = new ethers.ContractFactory(abi, contractBytecode, this.signer);
      const contract = await contractFactory.deploy(...constructorArgs);
      const deploymentTx = contract.deploymentTransaction();

      if (!deploymentTx) throw new Error("Deployment transaction not found");

      return { contract, deploymentTx };
    } catch (error) {
      console.error("Contract deployment failed:", error);
      return null;
    }
  }

  // Interact with existing contract
  getContract(address: string, abi: any[]): ethers.Contract | null {
    try {
      if (!this.signer) throw new Error("Wallet not connected");
      return new ethers.Contract(address, abi, this.signer);
    } catch (error) {
      console.error("Failed to get contract:", error);
      return null;
    }
  }

  // Send transaction
  async sendTransaction(
    to: string,
    value: string,
    data?: string
  ): Promise<ethers.TransactionResponse | null> {
    try {
      if (!this.signer) throw new Error("Wallet not connected");

      const tx = await this.signer.sendTransaction({
        to,
        value: ethers.parseEther(value),
        data: data || "0x",
      });

      return tx;
    } catch (error) {
      console.error("Transaction failed:", error);
      return null;
    }
  }

  // Estimate gas for transaction
  async estimateGas(
    to: string,
    value: string = "0",
    data?: string
  ): Promise<bigint | null> {
    try {
      if (!this.provider) throw new Error("Provider not available");

      const gasEstimate = await this.provider.estimateGas({
        to,
        value: ethers.parseEther(value),
        data: data || "0x",
      });

      return gasEstimate;
    } catch (error) {
      console.error("Gas estimation failed:", error);
      return null;
    }
  }

  // Setup event listeners for wallet changes
  private setupEventListeners(): void {
    if (!window.ethereum) return;

    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        // Account changed, update connection
        this.connectWallet();
      }
    });

    window.ethereum.on("chainChanged", (chainId: string) => {
      this.chainId = parseInt(chainId, 16);
      // Network changed, update provider
      if (this.provider) {
        this.provider = new ethers.BrowserProvider(window.ethereum);
      }
    });
  }

  // Get current provider
  getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }

  // Get current signer
  getSigner(): ethers.JsonRpcSigner | null {
    return this.signer;
  }

  // Get current chain ID
  getChainId(): number | null {
    return this.chainId;
  }

  // Format address for display
  static formatAddress(address: string): string {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Validate address
  static isValidAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }

  // Convert Wei to Ether
  static weiToEther(wei: string | bigint): string {
    return ethers.formatEther(wei);
  }

  // Convert Ether to Wei
  static etherToWei(ether: string): bigint {
    return ethers.parseEther(ether);
  }
}

// Create singleton instance
export const web3Service = new Web3Service();

// Contract ABIs for FastBite Pro smart contracts
export const CONTRACT_ABIS = {
  ERC20: [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address, uint256) returns (bool)",
    "function approve(address, uint256) returns (bool)",
    "function allowance(address, address) view returns (uint256)",
    "function transferFrom(address, address, uint256) returns (bool)",
    "event Transfer(address indexed, address indexed, uint256)",
    "event Approval(address indexed, address indexed, uint256)"
  ],
  
  DAO_GOVERNOR: [
    "function propose(address[], uint256[], bytes[], string) returns (uint256)",
    "function castVote(uint256, uint8) returns (uint256)",
    "function execute(address[], uint256[], bytes[], bytes32) returns (uint256)",
    "function getVotes(address, uint256) view returns (uint256)",
    "function state(uint256) view returns (uint8)",
    "function proposalThreshold() view returns (uint256)",
    "function votingDelay() view returns (uint256)",
    "function votingPeriod() view returns (uint256)",
    "event ProposalCreated(uint256, address, address[], uint256[], string[], bytes[], uint256, uint256, string)",
    "event VoteCast(address indexed, uint256, uint8, uint256, string)"
  ],

  ESCROW: [
    "function createOrder(bytes32, address, address, uint256) payable returns (uint256)",
    "function completeOrder(uint256) returns (bool)",
    "function cancelOrder(uint256) returns (bool)",
    "function getOrder(uint256) view returns (tuple(bytes32, address, address, address, uint256, uint8, uint256))",
    "event OrderCreated(uint256 indexed, bytes32 indexed, address indexed, address, uint256)",
    "event OrderCompleted(uint256 indexed)",
    "event OrderCancelled(uint256 indexed)"
  ]
};

// Extend window object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

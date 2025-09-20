import { useState } from "react";
import { Menu, Bell, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopHeaderProps {
  title: string;
  subtitle: string;
  onToggleSidebar: () => void;
}

export default function TopHeader({ title, subtitle, onToggleSidebar }: TopHeaderProps) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("0xCc38...AE79");

  const handleWalletConnect = () => {
    // In a real implementation, this would connect to Coinbase Wallet
    setWalletConnected(!walletConnected);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden touch-target"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </Button>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 truncate">{title}</h2>
            <p className="text-xs md:text-sm text-gray-500 truncate">{subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Web3 Wallet Connection */}
          <Button
            onClick={handleWalletConnect}
            className="flex items-center space-x-2 fastbite-gradient text-white px-2 md:px-4 py-2 rounded-lg hover:shadow-lg transition-all touch-target"
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">
              {walletConnected ? walletAddress : 'Connect Wallet'}
            </span>
            <span className="sm:hidden">
              {walletConnected ? '0x...AE79' : 'Connect'}
            </span>
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2 rounded-full hover:bg-gray-100 touch-target">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>
    </header>
  );
}

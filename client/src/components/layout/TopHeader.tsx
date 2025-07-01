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
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Web3 Wallet Connection */}
          <Button
            onClick={handleWalletConnect}
            className="flex items-center space-x-2 fastbite-gradient text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            <Wallet className="w-4 h-4" />
            <span>
              {walletConnected ? walletAddress : 'Connect Wallet'}
            </span>
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2 rounded-full hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>
    </header>
  );
}

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import AuthLayout from "./AuthLayout";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import Dashboard from "@/pages/Dashboard";
import OrderSystem from "@/pages/OrderSystem";
import DriverPortal from "@/pages/DriverPortal";
import MerchantHub from "@/pages/MerchantHub";
import Crowdfunding from "@/pages/Crowdfunding";
import Tokenomics from "@/pages/Tokenomics";
import AdminPanel from "@/pages/AdminPanel";
import SmartContracts from "@/pages/SmartContracts";
import Compliance from "@/pages/Compliance";
import Analytics from "@/pages/Analytics";
import UserManagement from "@/pages/UserManagement";
import InvestorDashboard from "@/pages/InvestorDashboard";
import AIStudio from "@/pages/AIStudio";
import Omniverse from "@/pages/Omniverse";

const sections = {
  dashboard: { 
    component: Dashboard, 
    title: "Dashboard", 
    subtitle: "Platform overview and key metrics" 
  },
  ordering: { 
    component: OrderSystem, 
    title: "Order System", 
    subtitle: "Manage food orders and delivery tracking" 
  },
  driver: { 
    component: DriverPortal, 
    title: "Driver Portal", 
    subtitle: "Driver management and route optimization" 
  },
  merchant: { 
    component: MerchantHub, 
    title: "Merchant Hub", 
    subtitle: "Restaurant and merchant management" 
  },
  crowdfunding: { 
    component: Crowdfunding, 
    title: "Crowdfunding", 
    subtitle: "Investment opportunities and funding rounds" 
  },
  tokenomics: { 
    component: Tokenomics, 
    title: "$FBT Tokenomics", 
    subtitle: "FastBite Token ecosystem and staking" 
  },
  admin: { 
    component: AdminPanel, 
    title: "Admin Panel", 
    subtitle: "Platform administration and Web3 integrations" 
  },
  contracts: { 
    component: SmartContracts, 
    title: "Smart Contracts", 
    subtitle: "Blockchain contract deployment and management" 
  },
  compliance: { 
    component: Compliance, 
    title: "Compliance", 
    subtitle: "Regulatory compliance and audit trails" 
  },
  analytics: { 
    component: Analytics, 
    title: "Analytics", 
    subtitle: "Business intelligence and performance metrics" 
  },
  users: { 
    component: UserManagement, 
    title: "User Management", 
    subtitle: "User roles, permissions, and account management" 
  },
  investor: { 
    component: InvestorDashboard, 
    title: "Investor Dashboard", 
    subtitle: "Investment tracking and portfolio management" 
  },
  "ai-studio": { 
    component: AIStudio, 
    title: "AI Studio", 
    subtitle: "Advanced AI capabilities with multiple providers" 
  },
  omniverse: { 
    component: Omniverse, 
    title: "Omniverse", 
    subtitle: "Immersive virtual experiences and metaverse integration" 
  },
};

type SectionKey = keyof typeof sections;

export default function MainLayout() {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState<SectionKey>("dashboard");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const path = location.substring(1) || "dashboard";
    if (path in sections) {
      setCurrentSection(path as SectionKey);
    }
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const CurrentComponent = sections[currentSection].component;
  const { title, subtitle } = sections[currentSection];

  return (
    <AuthLayout>
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          currentSection={currentSection}
          onSectionChange={(section: string) => setCurrentSection(section as SectionKey)}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopHeader 
            title={title}
            subtitle={subtitle}
            onToggleSidebar={toggleSidebar}
          />

          <main className="flex-1 overflow-auto bg-gray-50">
            <CurrentComponent />
          </main>
        </div>
      </div>
    </AuthLayout>
  );
}
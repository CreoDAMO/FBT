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

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAuthenticated } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get current section from location
  const currentSection = location.substring(1) || "dashboard";

  // Map sections to titles
  const sectionTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: "Dashboard", subtitle: "Overview of your FastBite Pro operations" },
    orders: { title: "Order Management", subtitle: "Track and manage customer orders" },
    driver: { title: "Driver Portal", subtitle: "Driver management and tracking" },
    merchant: { title: "Merchant Hub", subtitle: "Restaurant and merchant management" },
    crowdfunding: { title: "Crowdfunding", subtitle: "Investment and funding management" },
    tokenomics: { title: "Tokenomics", subtitle: "Token economics and blockchain features" },
    "smart-contracts": { title: "Smart Contracts", subtitle: "Deploy and manage blockchain contracts" },
    admin: { title: "Admin Panel", subtitle: "System administration and settings" },
    compliance: { title: "Compliance", subtitle: "Regulatory compliance and KYC" },
    analytics: { title: "Analytics", subtitle: "Business intelligence and reporting" },
    users: { title: "User Management", subtitle: "Manage system users and permissions" },
    investor: { title: "Investor Dashboard", subtitle: "Investment tracking and portfolio management" },
    "ai-studio": { title: "AI Studio", subtitle: "AI-powered tools and automation" }
  };

  const { title, subtitle } = sectionTitles[currentSection] || { title: "FastBite Pro", subtitle: "Multi-Platform Food Delivery System" };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        currentSection={currentSection}
        onSectionChange={() => {}}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader
          title={title}
          subtitle={subtitle}
          onToggleSidebar={toggleSidebar}
        />

        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
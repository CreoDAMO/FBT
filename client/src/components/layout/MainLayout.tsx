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

const sections = {
  dashboard: { 
    component: Dashboard, 
    title: "Dashboard Overview", 
    subtitle: "Real-time platform metrics and insights" 
  },
  ordering: { 
    component: OrderSystem, 
    title: "Order System", 
    subtitle: "Customer ordering interface and order tracking" 
  },
  driver: { 
    component: DriverPortal, 
    title: "Driver Portal", 
    subtitle: "Delivery management and earnings tracking" 
  },
  merchant: { 
    component: MerchantHub, 
    title: "Merchant Hub", 
    subtitle: "Restaurant management and analytics" 
  },
  crowdfunding: { 
    component: Crowdfunding, 
    title: "Crowdfunding Portal", 
    subtitle: "Investment opportunities and funding progress" 
  },
  tokenomics: { 
    component: Tokenomics, 
    title: "$FBT Tokenomics", 
    subtitle: "Token distribution, staking rewards, and DAO governance" 
  },
  admin: { 
    component: AdminPanel, 
    title: "Admin Panel", 
    subtitle: "Platform administration and white-label management" 
  },
  contracts: { 
    component: SmartContracts, 
    title: "Smart Contracts", 
    subtitle: "Deploy and manage blockchain contracts" 
  },
  compliance: { 
    component: Compliance, 
    title: "Compliance Dashboard", 
    subtitle: "KYC/AML verification, audit logs, and regulatory compliance" 
  },
  analytics: { 
    component: Analytics, 
    title: "Analytics Dashboard", 
    subtitle: "Cross-platform metrics and business intelligence" 
  },
  users: { 
    component: UserManagement, 
    title: "User Management", 
    subtitle: "Authentication, profiles, and role-based access control" 
  },
  investor: { 
    component: InvestorDashboard, 
    title: "Investor Dashboard", 
    subtitle: "White label business metrics and client management" 
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

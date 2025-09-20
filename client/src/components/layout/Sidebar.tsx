
import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Store,
  Truck,
  Users,
  BarChart3,
  Brain,
  TrendingUp,
  Coins,
  Settings,
  Shield,
  FileText,
  Menu,
  X,
  ChevronRight,
  Building2,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  adminOnly?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    description: "Overview and key metrics"
  },
  {
    label: "Merchant Hub",
    path: "/merchant",
    icon: Store,
    description: "Restaurant management portal"
  },
  {
    label: "Driver Portal",
    path: "/driver",
    icon: Truck,
    description: "Driver dashboard and orders"
  },
  {
    label: "Order System",
    path: "/orders",
    icon: Building2,
    description: "Order management and tracking"
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
    description: "Business intelligence and insights"
  },
  {
    label: "AI Studio",
    path: "/ai",
    icon: Brain,
    description: "AI-powered features and automation"
  },
  {
    label: "Tokenomics",
    path: "/tokenomics",
    icon: Coins,
    description: "Token economics and rewards"
  },
  {
    label: "Crowdfunding",
    path: "/crowdfunding",
    icon: TrendingUp,
    description: "Investment opportunities"
  },
  {
    label: "Investor Dashboard",
    path: "/investor",
    icon: Wallet,
    description: "Investment portfolio and analytics"
  },
  {
    label: "Smart Contracts",
    path: "/contracts",
    icon: FileText,
    description: "Blockchain contract management"
  },
  {
    label: "User Management",
    path: "/users",
    icon: Users,
    description: "User accounts and permissions",
    adminOnly: true
  },
  {
    label: "Admin Panel",
    path: "/admin",
    icon: Shield,
    description: "System administration",
    adminOnly: true
  },
  {
    label: "Compliance",
    path: "/compliance",
    icon: Settings,
    description: "Regulatory compliance tools",
    adminOnly: true
  },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const filteredItems = navigationItems.filter(item => !item.adminOnly || isAdmin);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FB</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">FastBite Pro</h2>
              <p className="text-xs text-muted-foreground">Multi-Platform System</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex"
        >
          {isCollapsed ? <ChevronRight /> : <X />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden"
        >
          <X />
        </Button>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user.firstName?.[0] || user.username[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.username}
              </p>
              <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path || 
              (item.path !== "/" && location.startsWith(item.path));

            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start h-auto p-3",
                    isActive && "bg-primary/10 text-primary border-primary/20",
                    isCollapsed && "px-2 justify-center"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </div>
                      )}
                    </div>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        {!isCollapsed && (
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">FastBite Pro v2.0</p>
            <p>Production Ready Platform</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-background border-r transition-all duration-300",
          isCollapsed ? "w-16" : "w-80",
          className
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 h-full w-80 bg-background border-r z-50 transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}

import { Link } from "wouter";
import { 
  Home, 
  ShoppingCart, 
  Truck, 
  Store, 
  TrendingUp, 
  Coins, 
  Settings, 
  File, 
  Shield, 
  BarChart3, 
  Users,
  Utensils,
  Bot,
  Brain
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  currentSection: string;
  onSectionChange: (section: string) => void;
  onClose?: () => void;
}

const navigationSections = [
  {
    title: "Main Platform",
    items: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "ordering", label: "Order System", icon: ShoppingCart },
      { id: "driver", label: "Driver Portal", icon: Truck },
      { id: "merchant", label: "Merchant Hub", icon: Store },
    ]
  },
  {
    title: "Investment",
    items: [
      { id: "crowdfunding", label: "Crowdfunding", icon: TrendingUp },
      { id: "tokenomics", label: "$FBT Tokenomics", icon: Coins },
      { id: "investor", label: "Investor Dashboard", icon: BarChart3 },
    ]
  },
  {
    title: "Administration",
    items: [
      { id: "admin", label: "Admin Panel", icon: Settings },
      { id: "contracts", label: "Smart Contracts", icon: File },
      { id: "compliance", label: "Compliance", icon: Shield },
    ]
  },
  {
    title: "AI & Advanced",
    items: [
      { id: "ai-studio", label: "AI Studio", icon: Bot },
      { id: "omniverse", label: "Omniverse", icon: Brain },
    ]
  },
  {
    title: "Analytics",
    items: [
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "users", label: "User Management", icon: Users },
    ]
  }
];

export default function Sidebar({ isOpen, currentSection, onSectionChange, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => onClose && onClose()}
        />
      )}
      
      <div className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:w-0 md:translate-x-0'
      } h-screen overflow-y-auto fixed md:relative z-50 md:z-auto flex flex-col`}>
      {/* Logo Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 fastbite-gradient rounded-lg flex items-center justify-center">
            <Utensils className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FastBite Pro</h1>
            <p className="text-xs text-gray-500">Unified Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationSections.map((section) => (
          <div key={section.title} className="sidebar-section mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                
                return (
                  <Link
                    key={item.id}
                    href={`/${item.id}`}
                    onClick={() => onSectionChange(item.id)}
                  >
                    <button
                      className={`nav-item flex items-center w-full p-3 text-left rounded-lg hover:bg-gray-100 transition-colors touch-target ${
                        isActive ? 'active bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Jacque DeGraff</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

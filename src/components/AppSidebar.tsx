import { Link, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Map,
  FileCheck,
  Shield,
  Link2,
  AlertTriangle,
  Wheat,
  Sprout,
  FileText,
  Camera,
  DollarSign,
  TrendingUp,
  BarChart3,
  HistoryIcon,
  Leaf,
  BookOpen,
  PiggyBank,
  Settings,
  Briefcase,
  CheckCircle2,
  TrendingDown,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  // Petani
  { label: "Profil Petani", path: "/profile", icon: Users, roles: ["petani"] },
  { label: "Catatan Pertanian", path: "/catatan-pertanian", icon: BookOpen, roles: ["petani"] },
  { label: "Program Subsidi", path: "/program-subsidi", icon: Wheat, roles: ["petani"] },
  { label: "Pengajuan Subsidi", path: "/pengajuan-subsidi", icon: FileText, roles: ["petani"] },
  { label: "Pengajuan KUR", path: "/pengajuan-KUR", icon: PiggyBank, roles: ["petani"] },
  { label: "Proposal Pendanaan", path: "/pengajuan-proposal", icon: Briefcase, roles: ["petani"] },
  { label: "Rekomendasi Komoditas", path: "/rekomendasi-komoditas", icon: Sprout, roles: ["petani"] },
  
  // Investor
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["investor"] },
  { label: "Daftar Proposal", path: "/daftar-proposals", icon: Briefcase, roles: ["investor"] },
  { label: "Analisis Proposal", path: "/analisis-proposals", icon: BarChart3, roles: ["investor"] },
  { label: "Portofolio Investasi", path: "/investor-portfolio", icon: TrendingUp, roles: ["investor"] },
  { label: "Riwayat Investasi", path: "/riwayat-investasi", icon: HistoryIcon, roles: ["investor"] },
  
  // Bank
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["bank"] },
  { label: "Pengajuan KUR", path: "/bank-kur-analysis", icon: DollarSign, roles: ["bank"] },
  { label: "Analisis Kelayakan", path: "/bank-kelayakan", icon: CheckCircle2, roles: ["bank"] },
  { label: "Prediksi Risiko", path: "/risk-bank", icon: TrendingDown, roles: ["bank"] },
  { label: "Monitoring Pembiayaan", path: "/bank-monitoring-pembiayaan", icon: BarChart3, roles: ["bank"] },
  
  // Kementerian
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["kementerian"] },
  { label: "Peta Potensi", path: "/peta-potensi", icon: Map, roles: ["kementerian"] },
  { label: "Monitoring Subsidi", path: "/kementerian-monitoring", icon: Shield, roles: ["kementerian"] },
  { label: "Deteksi Fraud", path: "/fraud", icon: AlertTriangle, roles: ["kementerian"] },
  { label: "Blockchain Audit", path: "/blockchain", icon: Link2, roles: ["kementerian"] },
  { label: "Prediksi Risiko", path: "/risk-kementerian", icon: TrendingDown, roles: ["kementerian"] },
  { label: "Kontrol Program", path: "/program-control", icon: Settings, roles: ["kementerian"] },
];

const roleLabels: Record<UserRole, string> = {
  petani: "Petani",
  investor: "Investor",
  bank: "Bank",
  kementerian: "Kementerian Pertanian",
};

interface AppSidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function AppSidebar({ collapsed: externalCollapsed, onCollapsedChange }: AppSidebarProps) {
  const { role } = useAuth();
  const location = useLocation();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  
  const handleCollapsedChange = (newValue: boolean) => {
    if (onCollapsedChange) {
      onCollapsedChange(newValue);
    } else {
      setInternalCollapsed(newValue);
    }
  };

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        "h-screen flex flex-col transition-all duration-300 gradient-hero",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-5 border-b border-sidebar-border">
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <h2 className="text-xs font-bold text-sidebar-foreground uppercase tracking-wide">Menu</h2>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="animate-fade-in">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-2 pb-4 border-t border-sidebar-border/50 pt-3">
      </div>
    </aside>
  );
}

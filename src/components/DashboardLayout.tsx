import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import AppSidebar from "./AppSidebar";
import ErrorBoundary from "./ErrorBoundary";
import { useAuth } from "@/hooks/useAuth";
import { Menu, LogOut, Wheat } from "lucide-react";

export default function DashboardLayout() {
  const { logout, userName, role } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const roleLabels: Record<string, string> = {
    petani: "Petani",
    investor: "Investor",
    standby_buyer: "Standby Buyer",
    kementerian: "Kementerian Pertanian",
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Bar */}
      <div className="h-16 border-b border-border bg-white shadow-sm flex items-center justify-between px-6">
        {/* Logo + Toggle Button (Left) */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Wheat className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-foreground">TaniLink</h1>
            <p className="text-[10px] text-muted-foreground leading-tight">Sistem & Subsidi</p>
          </div>
          
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground ml-2"
            title={sidebarCollapsed ? "Perluas sidebar" : "Perkecil sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* User Info & Logout (Right) */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-foreground">{userName}</p>
            <p className="text-[10px] text-muted-foreground">{roleLabels[role]}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
            title="Keluar"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
        <main className="flex-1 overflow-y-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

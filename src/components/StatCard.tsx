import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  variant?: "default" | "primary" | "success" | "warning" | "accent" | "destructive";
}

const variantStyles = {
  default: "bg-card shadow-card",
  primary: "gradient-primary text-primary-foreground",
  success: "gradient-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  accent: "gradient-accent text-accent-foreground",
  destructive: "bg-red-500 text-white",
};

const iconBg = {
  default: "bg-muted",
  primary: "bg-primary-foreground/10",
  success: "bg-success-foreground/10",
  warning: "bg-warning-foreground/10",
  accent: "bg-accent-foreground/10",
};

export default function StatCard({ title, value, subtitle, icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div className={cn("rounded-xl p-5 transition-all duration-200 hover:scale-[1.02]", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={cn("text-xs font-medium uppercase tracking-wider", variant === "default" ? "text-muted-foreground" : "opacity-80")}>
            {title}
          </p>
          <p className="text-2xl font-bold font-display">{value}</p>
          {subtitle && <p className={cn("text-xs", variant === "default" ? "text-muted-foreground" : "opacity-70")}>{subtitle}</p>}
          {trend && (
            <p className={cn("text-xs font-medium", trend.value >= 0 ? "text-success" : "text-destructive")}>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg", iconBg[variant])}>{icon}</div>
      </div>
    </div>
  );
}

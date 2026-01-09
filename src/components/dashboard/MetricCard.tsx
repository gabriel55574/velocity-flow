import { GlassCard } from "@/components/ui/glass-card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  status?: "ok" | "warn" | "risk" | "neutral";
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  status = "neutral",
}: MetricCardProps) {
  const TrendIcon = change === undefined 
    ? Minus 
    : change >= 0 
      ? TrendingUp 
      : TrendingDown;

  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <p className={cn(
            "text-2xl font-bold tracking-tight",
            status === "ok" && "text-ok",
            status === "warn" && "text-warn",
            status === "risk" && "text-risk"
          )}>
            {value}
          </p>
          {change !== undefined && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              change >= 0 ? "text-ok" : "text-risk"
            )}>
              <TrendIcon className="h-3 w-3" />
              <span>{change >= 0 ? "+" : ""}{change}%</span>
              {changeLabel && (
                <span className="text-muted-foreground font-normal">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            "p-2.5 rounded-xl",
            status === "ok" && "bg-ok/10 text-ok",
            status === "warn" && "bg-warn/10 text-warn",
            status === "risk" && "bg-risk/10 text-risk",
            status === "neutral" && "bg-primary/10 text-primary"
          )}>
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

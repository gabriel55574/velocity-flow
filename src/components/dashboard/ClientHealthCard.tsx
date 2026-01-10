import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ChevronRight, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientHealthCardProps {
  id?: string;
  name: string;
  niche: string;
  phase: string;
  health: "ok" | "warn" | "risk";
  blockedGates: number;
  pendingApprovals: number;
  owner: string;
  onClick?: () => void;
}

const healthLabels = {
  ok: "Saudável",
  warn: "Atenção",
  risk: "Em Risco",
};

export function ClientHealthCard({
  name,
  niche,
  phase,
  health,
  blockedGates,
  pendingApprovals,
  owner,
  onClick,
}: ClientHealthCardProps) {
  return (
    <GlassCard hover className="p-4 group" onClick={onClick}>
      <div className="flex items-center gap-4">
        <div className={cn(
          "h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0",
          health === "ok" && "bg-ok/15 text-ok",
          health === "warn" && "bg-warn/15 text-warn",
          health === "risk" && "bg-risk/15 text-risk"
        )}>
          {name.slice(0, 2).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">{name}</h3>
            <StatusBadge status={health} size="sm">
              {healthLabels[health]}
            </StatusBadge>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="truncate">{niche}</span>
            <span className="text-border">•</span>
            <span className="font-medium text-foreground/80">{phase}</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {blockedGates > 0 && (
              <span className="flex items-center gap-1 text-risk">
                <AlertCircle className="h-3 w-3" />
                {blockedGates} gate{blockedGates > 1 ? 's' : ''}
              </span>
            )}
            {pendingApprovals > 0 && (
              <span className="flex items-center gap-1 text-warn">
                <Clock className="h-3 w-3" />
                {pendingApprovals} aprovação{pendingApprovals > 1 ? 'ões' : ''}
              </span>
            )}
            {blockedGates === 0 && pendingApprovals === 0 && (
              <span className="flex items-center gap-1 text-ok">
                <CheckCircle className="h-3 w-3" />
                Em dia
              </span>
            )}
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end gap-1 text-xs text-muted-foreground shrink-0">
          <span>Owner:</span>
          <span className="font-medium text-foreground">{owner}</span>
        </div>

        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
    </GlassCard>
  );
}

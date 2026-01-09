import { ChevronRight, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  priority: number;
  title: string;
  client: string;
  type: "gate" | "sla" | "approval" | "task";
  status: "risk" | "warn" | "ok" | "blocked";
  dueTime?: string;
  onClick?: () => void;
}

const typeIcons = {
  gate: AlertTriangle,
  sla: Clock,
  approval: CheckCircle2,
  task: CheckCircle2,
};

const typeLabels = {
  gate: "Gate Bloqueado",
  sla: "SLA",
  approval: "Aprovação",
  task: "Tarefa",
};

export function ActionCard({
  priority,
  title,
  client,
  type,
  status,
  dueTime,
  onClick,
}: ActionCardProps) {
  const Icon = typeIcons[type];

  return (
    <GlassCard 
      hover 
      className="p-4 group"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-sm",
          status === "risk" && "bg-risk/15 text-risk",
          status === "warn" && "bg-warn/15 text-warn",
          status === "ok" && "bg-ok/15 text-ok",
          status === "blocked" && "bg-blocked/15 text-blocked"
        )}>
          {priority}
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <StatusBadge status={status} size="sm">
              <Icon className="h-3 w-3" />
              {typeLabels[type]}
            </StatusBadge>
            {dueTime && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {dueTime}
              </span>
            )}
          </div>
          
          <h3 className="font-medium text-sm leading-tight truncate">{title}</h3>
          <p className="text-xs text-muted-foreground">{client}</p>
        </div>
        
        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
    </GlassCard>
  );
}

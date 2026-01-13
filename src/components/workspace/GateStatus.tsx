import { StatusBadge } from "@/components/ui/status-badge";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import type { Database } from "@/types/database";
import type { ElementType } from "react";

interface GateStatusProps {
    title: string;
    status: Database["public"]["Enums"]["gate_status"] | null;
    conditions?: string[];
}

const statusMap: Record<
    NonNullable<GateStatusProps["status"]>,
    { label: string; badge: "ok" | "warn" | "risk"; icon: ElementType; bg: string; border: string; iconColor: string }
> = {
    pending: {
        label: "Pendente",
        badge: "warn",
        icon: Clock,
        bg: "bg-amber-500/5",
        border: "border-amber-500/20",
        iconColor: "text-amber-500",
    },
    passed: {
        label: "Aprovado",
        badge: "ok",
        icon: CheckCircle2,
        bg: "bg-emerald-500/5",
        border: "border-emerald-500/20",
        iconColor: "text-emerald-500",
    },
    failed: {
        label: "Reprovado",
        badge: "risk",
        icon: XCircle,
        bg: "bg-red-500/5",
        border: "border-red-500/20",
        iconColor: "text-red-500",
    },
    blocked: {
        label: "Bloqueado",
        badge: "risk",
        icon: AlertTriangle,
        bg: "bg-red-500/5",
        border: "border-red-500/20",
        iconColor: "text-red-500",
    },
};

export function GateStatus({ title, status, conditions = [] }: GateStatusProps) {
    const gateStatus = status || "pending";
    const config = statusMap[gateStatus];
    const Icon = config.icon;

    return (
        <div
            className={`p-4 rounded-xl border ${config.bg} ${config.border}`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${config.iconColor}`} />
                    <span className="font-medium text-sm">{title}</span>
                </div>
                <StatusBadge status={config.badge} size="sm">
                    {config.label}
                </StatusBadge>
            </div>

            <div className="space-y-1">
                {conditions.length > 0 ? (
                    conditions.map((condition, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            <span>{condition}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-muted-foreground">Nenhuma condição definida.</p>
                )}
            </div>
        </div>
    );
}

import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { GateStatus } from "./GateStatus";
import {
    CheckCircle2,
    Clock,
    AlertTriangle,
    Circle,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import { useState } from "react";

interface ModuleCardProps {
    module: any;
    isActive?: boolean;
}

const statusConfig = {
    not_started: {
        icon: Circle,
        color: "text-muted-foreground",
        bgColor: "bg-muted/50",
        label: "Não iniciado"
    },
    in_progress: {
        icon: Clock,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        label: "Em andamento"
    },
    blocked: {
        icon: AlertTriangle,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        label: "Bloqueado"
    },
    done: {
        icon: CheckCircle2,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        label: "Concluído"
    },
};

export function ModuleCard({ module, isActive = false }: ModuleCardProps) {
    const [isExpanded, setIsExpanded] = useState(isActive);
    const status = module.status || 'not_started';
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;
    const StatusIcon = config.icon;
    const steps = module.steps || [];
    const title = module.name || module.title || 'Módulo';
    const progress = module.progress || 0;

    return (
        <div
            className={`rounded-2xl border transition-all ${isActive
                    ? "border-primary/50 bg-primary/5 shadow-lg"
                    : "border-border/50 bg-card/50 hover:bg-card/80"
                }`}
        >
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center gap-4"
            >
                <div className={`p-2 rounded-xl ${config.bgColor}`}>
                    <StatusIcon className={`h-5 w-5 ${config.color}`} />
                </div>

                <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{title}</h3>
                        <StatusBadge
                            status={status === "done" ? "ok" : status === "blocked" ? "risk" : "warn"}
                            size="sm"
                        >
                            {config.label}
                        </StatusBadge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <Progress value={progress} className="h-1.5 flex-1 max-w-32" />
                        <span className="text-xs text-muted-foreground">{progress}%</span>
                    </div>
                </div>

                {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                    {/* Steps */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Etapas ({steps.length})
                        </h4>
                        {steps.map((step: any) => {
                            const status = step.status || 'pending';
                            const stepConfig = {
                                pending: { icon: Circle, color: "text-muted-foreground" },
                                backlog: { icon: Circle, color: "text-muted-foreground" },
                                todo: { icon: Circle, color: "text-muted-foreground" },
                                in_progress: { icon: Clock, color: "text-blue-500" },
                                doing: { icon: Clock, color: "text-blue-500" },
                                review: { icon: Clock, color: "text-blue-500" },
                                done: { icon: CheckCircle2, color: "text-emerald-500" },
                                blocked: { icon: AlertTriangle, color: "text-red-500" },
                            }[status] || { icon: Circle, color: "text-muted-foreground" };
                            const StepIcon = stepConfig.icon;

                            return (
                                <div
                                    key={step.id}
                                    className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30"
                                >
                                    <StepIcon className={`h-4 w-4 ${stepConfig.color}`} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{step.name || step.title}</p>
                                        {step.description && (
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {step.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Gate */}
                    {module.gate && (
                        <GateStatus
                            title={module.gate.title}
                            status={module.gate.status}
                            conditions={module.gate.conditions}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

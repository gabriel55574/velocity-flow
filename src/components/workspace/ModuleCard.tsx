import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { GateStatus } from "./GateStatus";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    CheckCircle2,
    Clock,
    AlertTriangle,
    Circle,
    ChevronDown,
    ChevronRight,
    Trash2,
    Plus
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDeleteModule, useDeleteStep, useUpdateGateStatus, useUpdateStepStatus } from "@/hooks/useWorkflows";
import type { Database } from "@/types/database";
import { CreateStepDialog } from "@/components/dialogs/steps/CreateStepDialog";

interface ModuleCardProps {
    module: any;
    isActive?: boolean;
    agencyId?: string;
}

type Step = Database["public"]["Tables"]["steps"]["Row"];
type Gate = Database["public"]["Tables"]["gates"]["Row"];
type TaskStatus = Database["public"]["Enums"]["task_status"];
type GateStatusType = Database["public"]["Enums"]["gate_status"];

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

export function ModuleCard({ module, isActive = false, agencyId }: ModuleCardProps) {
    const [isExpanded, setIsExpanded] = useState(isActive);
    const [isCreateStepOpen, setIsCreateStepOpen] = useState(false);
    const updateStepStatus = useUpdateStepStatus();
    const deleteStep = useDeleteStep();
    const deleteModule = useDeleteModule();
    const updateGateStatus = useUpdateGateStatus();

    const status = module.status || 'not_started';
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;
    const StatusIcon = config.icon;
    const steps = (module.steps || []) as Step[];
    const gates = (module.gates || []) as Gate[];
    const title = module.name || module.title || 'Módulo';
    const progress = module.progress || 0;
    const nextStepOrder = useMemo(() => {
        if (!steps.length) return 0;
        const maxOrder = Math.max(...steps.map((s) => s.order_index ?? 0));
        return maxOrder + 1;
    }, [steps]);

    const handleDeleteModule = async () => {
        if (!module?.id) return;
        const confirmed = window.confirm("Excluir módulo? Essa ação não pode ser desfeita.");
        if (!confirmed) return;
        await deleteModule.mutateAsync(module.id);
    };

    const handleDeleteStep = async (stepId: string) => {
        const confirmed = window.confirm("Excluir esta etapa?");
        if (!confirmed) return;
        await deleteStep.mutateAsync(stepId);
    };

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

                <div className="flex-1 text-left space-y-2">
                    <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm">{title}</h3>
                            <StatusBadge
                                status={status === "done" ? "ok" : status === "blocked" ? "risk" : "warn"}
                                size="sm"
                            >
                                {config.label}
                            </StatusBadge>
                        </div>
                        <div className="hidden sm:flex gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="gap-1"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCreateStepOpen(true);
                                }}
                            >
                                <Plus className="h-4 w-4" />
                                Novo Step
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="gap-1 text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteModule();
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                                Excluir
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                    <div className="flex sm:hidden gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1 flex-1"
                            onClick={() => setIsCreateStepOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            Novo Step
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="gap-1 text-destructive"
                            onClick={handleDeleteModule}
                        >
                            <Trash2 className="h-4 w-4" />
                            Excluir
                        </Button>
                    </div>

                    {/* Steps */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Etapas ({steps.length})
                        </h4>
                        {steps.length === 0 && (
                            <div className="p-3 rounded-lg border border-dashed text-xs text-muted-foreground">
                                Nenhuma etapa cadastrada neste módulo.
                            </div>
                        )}
                        {steps.map((step: Step) => {
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

                            const selectValue = (step.status || 'todo') as TaskStatus;

                            return (
                                <div
                                    key={step.id}
                                    className="flex flex-col gap-2 p-3 rounded-lg bg-secondary/30 sm:flex-row sm:items-center"
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <StepIcon className={`h-4 w-4 ${stepConfig.color}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{step.name || step.title}</p>
                                            {step.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                    {step.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                        <Select
                                            value={selectValue}
                                            onValueChange={(value) => updateStepStatus.mutateAsync({
                                                id: step.id,
                                                status: value as TaskStatus
                                            })}
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="backlog">Backlog</SelectItem>
                                                <SelectItem value="todo">To do</SelectItem>
                                                <SelectItem value="doing">Doing</SelectItem>
                                                <SelectItem value="review">Review</SelectItem>
                                                <SelectItem value="done">Done</SelectItem>
                                                <SelectItem value="blocked">Blocked</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive"
                                            onClick={() => handleDeleteStep(step.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Gates / DoD */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Gates / Definition of Done ({gates.length})
                        </h4>
                        {gates.length === 0 && (
                            <div className="p-3 rounded-lg border border-dashed text-xs text-muted-foreground">
                                Nenhum gate configurado para este módulo.
                            </div>
                        )}
                        {gates.map((gate: Gate) => {
                            const conditions = Array.isArray(gate.conditions)
                                ? (gate.conditions as string[])
                                : [];
                            return (
                                <div key={gate.id} className="space-y-2">
                                    <GateStatus
                                        title={gate.name || "Gate"}
                                        status={(gate.status as GateStatusType) || "pending"}
                                        conditions={conditions}
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateGateStatus.mutateAsync({ id: gate.id, status: "passed" })}
                                        >
                                            Marcar como aprovado
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateGateStatus.mutateAsync({ id: gate.id, status: "failed" })}
                                        >
                                            Marcar como reprovado
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateGateStatus.mutateAsync({ id: gate.id, status: "blocked" })}
                                        >
                                            Bloquear
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => updateGateStatus.mutateAsync({ id: gate.id, status: "pending" })}
                                        >
                                            Resetar para pendente
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {module?.id && (
                <CreateStepDialog
                    open={isCreateStepOpen}
                    onOpenChange={setIsCreateStepOpen}
                    moduleId={module.id}
                    nextOrder={nextStepOrder}
                    agencyId={agencyId}
                />
            )}
        </div>
    );
}

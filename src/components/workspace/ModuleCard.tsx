import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/ui/status-badge";
import { GateStatus } from "./GateStatus";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
import { useDeleteChecklistItem, useDeleteModule, useDeleteStep, useToggleChecklistItem, useUpdateGateStatus, useUpdateStepStatus, useCreateChecklistItem } from "@/hooks/useWorkflows";
import type { Database } from "@/types/database";
import { CreateStepDialog } from "@/components/dialogs/steps/CreateStepDialog";
import { useCurrentUser } from "@/hooks/useUsers";
import { validateGate } from "@/lib/workflowEngine";
import { useToast } from "@/hooks/use-toast";

interface ModuleCardProps {
    module: any;
    isActive?: boolean;
    agencyId?: string;
    onAdvanceModule?: () => Promise<void>;
    nextModuleName?: string;
}

type Step = Database["public"]["Tables"]["steps"]["Row"];
type Gate = Database["public"]["Tables"]["gates"]["Row"];
type ChecklistItem = Database["public"]["Tables"]["checklist_items"]["Row"];
type TaskStatus = Database["public"]["Enums"]["task_status"];
type GateStatusType = Database["public"]["Enums"]["gate_status"];
type StepWithChecklist = Step & { checklist_items?: ChecklistItem[] };

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

export function ModuleCard({
    module,
    isActive = false,
    agencyId,
    onAdvanceModule,
    nextModuleName,
}: ModuleCardProps) {
    const [isExpanded, setIsExpanded] = useState(isActive);
    const [isCreateStepOpen, setIsCreateStepOpen] = useState(false);
    const [newChecklistItem, setNewChecklistItem] = useState<Record<string, string>>({});
    const { data: currentUser } = useCurrentUser();
    const { toast } = useToast();
    const updateStepStatus = useUpdateStepStatus();
    const deleteStep = useDeleteStep();
    const deleteModule = useDeleteModule();
    const updateGateStatus = useUpdateGateStatus();
    const toggleChecklistItem = useToggleChecklistItem();
    const deleteChecklistItem = useDeleteChecklistItem();
    const createChecklistItem = useCreateChecklistItem();

    const status = module.status || 'not_started';
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;
    const StatusIcon = config.icon;
    const steps = (module.steps || []) as StepWithChecklist[];
    const gates = (module.gates || []) as Gate[];
    const title = module.name || module.title || 'Módulo';
    const progress = module.progress || 0;
    const gateValidations = gates.map((gate) => ({
        gate,
        validation: validateGate(steps, { currentStatus: gate.status as GateStatusType | null }),
    }));
    const canAdvance = gates.length === 0 || gateValidations.every((item) => item.validation.status === "passed");
    const advanceBlockedGate = gateValidations.find(
        (item) => item.validation.status === "failed" || item.validation.status === "blocked"
    );
    const advanceIssues = gateValidations.flatMap((item) => item.validation.issues);
    const advanceMessage = advanceBlockedGate
        ? "Gate reprovado ou bloqueado. Resolva as pendências para avançar."
        : advanceIssues.length > 0
            ? `Pendência: ${advanceIssues[0]}`
            : null;
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

    const handleAddChecklistItem = async (stepId: string) => {
        const name = newChecklistItem[stepId]?.trim();
        if (!name) return;

        await createChecklistItem.mutateAsync({
            step_id: stepId,
            name,
            is_completed: false,
        });

        setNewChecklistItem((prev) => ({ ...prev, [stepId]: "" }));
    };

    const handleCompleteStep = async (step: Step, checklistItems: ChecklistItem[]) => {
        const incomplete = checklistItems.some((item) => !item.is_completed);
        if (incomplete) {
            toast({
                title: "Checklist incompleto",
                description: "Complete todos os itens antes de concluir o step.",
                variant: "destructive",
            });
            return;
        }

        await updateStepStatus.mutateAsync({
            id: step.id,
            status: "done",
            completedBy: currentUser?.id ?? null,
        });

        const nextSteps: StepWithChecklist[] = steps.map((item) =>
            item.id === step.id ? { ...item, status: "done" as TaskStatus } : item
        );

        for (const gate of gates) {
            const validation = validateGate(nextSteps, { currentStatus: gate.status as GateStatusType | null });
            if (validation.status !== gate.status) {
                await updateGateStatus.mutateAsync({
                    id: gate.id,
                    status: validation.status,
                });
            }
        }
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
                        {steps.map((step) => {
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

                            const checklistItems = step.checklist_items || [];
                            const checklistDone = checklistItems.filter((item) => item.is_completed).length;

                            return (
                                <div
                                    key={step.id}
                                    className="flex flex-col gap-3 p-3 rounded-lg bg-secondary/30"
                                >
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3 w-full">
                                        <StepIcon className={`h-4 w-4 ${stepConfig.color}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{step.name || "Etapa"}</p>
                                            {step.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                    {step.description}
                                                </p>
                                            )}
                                            {checklistItems.length > 0 && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Checklist: {checklistDone}/{checklistItems.length} concluído
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                        <Select
                                            value={selectValue}
                                            onValueChange={(value) => {
                                                const nextStatus = value as TaskStatus;
                                                return updateStepStatus.mutateAsync({
                                                    id: step.id,
                                                    status: nextStatus,
                                                    completedBy: nextStatus === "done" ? (currentUser?.id ?? null) : null,
                                                });
                                            }}
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
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleCompleteStep(step, checklistItems)}
                                            disabled={checklistItems.some((item) => !item.is_completed)}
                                        >
                                            Concluir
                                        </Button>
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

                                    <div className="w-full space-y-2">
                                        {checklistItems.length > 0 && (
                                            <div className="space-y-2">
                                                {checklistItems.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center justify-between gap-2 rounded-lg bg-background/60 px-3 py-2"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                checked={item.is_completed || false}
                                                                onCheckedChange={(checked) => {
                                                                    toggleChecklistItem.mutateAsync({
                                                                        id: item.id,
                                                                        is_completed: Boolean(checked),
                                                                        completed_by: Boolean(checked) ? currentUser?.id : undefined,
                                                                    });
                                                                }}
                                                            />
                                                            <span className="text-xs text-muted-foreground">{item.name}</span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive"
                                                            onClick={() => deleteChecklistItem.mutateAsync(item.id)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                            <Input
                                                placeholder="Adicionar checklist"
                                                value={newChecklistItem[step.id] || ""}
                                                onChange={(event) =>
                                                    setNewChecklistItem((prev) => ({
                                                        ...prev,
                                                        [step.id]: event.target.value,
                                                    }))
                                                }
                                            />
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleAddChecklistItem(step.id)}
                                                disabled={createChecklistItem.isPending}
                                            >
                                                Adicionar
                                            </Button>
                                        </div>
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
                        {gateValidations.map(({ gate, validation }) => {
                            const conditions = Array.isArray(gate.conditions)
                                ? (gate.conditions as string[])
                                : [];
                            const issuesToShow = validation.issues.slice(0, 4);
                            return (
                                <div key={gate.id} className="space-y-2">
                                    <GateStatus
                                        title={gate.name || "Gate"}
                                        status={(gate.status as GateStatusType) || "pending"}
                                        conditions={conditions}
                                    />
                                    {issuesToShow.length > 0 && (
                                        <div className="rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
                                            <p className="font-medium text-amber-600">Pendências</p>
                                            <ul className="mt-1 space-y-1">
                                                {issuesToShow.map((issue, idx) => (
                                                    <li key={`${gate.id}-issue-${idx}`}>{issue}</li>
                                                ))}
                                                {validation.issues.length > issuesToShow.length && (
                                                    <li>+ {validation.issues.length - issuesToShow.length} pendências</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                updateGateStatus.mutateAsync({
                                                    id: gate.id,
                                                    status: validation.status,
                                                })
                                            }
                                        >
                                            Recalcular gate
                                        </Button>
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
                        {isActive && onAdvanceModule && (
                            <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="space-y-1">
                                        <p className="font-medium text-primary">Avançar módulo</p>
                                        <p>
                                            {canAdvance
                                                ? `Próximo: ${nextModuleName || "Módulo seguinte"}`
                                                : advanceMessage || "Gate pendente. Recalcule após concluir as evidências."}
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="gap-2"
                                        onClick={onAdvanceModule}
                                        disabled={!canAdvance}
                                    >
                                        Avançar
                                    </Button>
                                </div>
                            </div>
                        )}
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

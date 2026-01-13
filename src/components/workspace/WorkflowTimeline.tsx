import { ModuleCard } from "./ModuleCard";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { GitBranch, CheckCircle2, Clock, AlertTriangle, Loader2, Plus, Trash2 } from "lucide-react";
import { useClient } from "@/hooks/useClients";
import { useClientDefaultWorkspace } from "@/hooks/useWorkspaces";
import { useDeleteWorkflow, useUpdateModule, useWorkflows } from "@/hooks/useWorkflows";
import { CreateWorkflowDialog } from "@/components/dialogs/workflows/CreateWorkflowDialog";
import { CreateModuleDialog } from "@/components/dialogs/modules/CreateModuleDialog";
import { useMemo, useState } from "react";
import type { Database } from "@/types/database";

interface WorkflowTimelineProps {
    clientId: string;
}

type ModuleStatus = "not_started" | "in_progress" | "blocked" | "done";
type Step = Database["public"]["Tables"]["steps"]["Row"];
type Gate = Database["public"]["Tables"]["gates"]["Row"];
type Module = Database["public"]["Tables"]["modules"]["Row"] & {
    steps?: Step[];
    gates?: Gate[];
    progress?: number;
    status?: ModuleStatus;
};
type Workflow = Database["public"]["Tables"]["workflows"]["Row"] & {
    modules?: Module[];
};
type EnrichedModule = Module & { progress: number; status: ModuleStatus };

export function WorkflowTimeline({ clientId }: WorkflowTimelineProps) {
    const { data: client } = useClient(clientId);
    const agencyId = client?.agency_id || undefined;
    const { data: workspace, isLoading: workspaceLoading, error: workspaceError } = useClientDefaultWorkspace(clientId);
    const workspaceId = workspace?.id || "";
    const { data: workflows, isLoading: workflowsLoading, error: workflowsError } = useWorkflows(workspaceId);
    const deleteWorkflow = useDeleteWorkflow();
    const updateModule = useUpdateModule();
    const [createWorkflowOpen, setCreateWorkflowOpen] = useState(false);
    const [createModuleOpen, setCreateModuleOpen] = useState(false);

    const activeWorkflow = (workflows?.[0] ?? undefined) as Workflow | undefined;
    const modules = useMemo(() => activeWorkflow?.modules || [], [activeWorkflow?.modules]);
    const isLoading = workspaceLoading || workflowsLoading;
    const hasError = Boolean(workspaceError || workflowsError);

    const enriched: EnrichedModule[] = (modules || []).map((module) => {
        const steps = module?.steps || [];
        const totalSteps = steps.length || 0;
        const doneSteps = steps.filter((step) => step.status === "done").length;
        const blockedSteps = steps.some((step) => step.status === "blocked");
        const progress = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;

        const status =
            blockedSteps ? "blocked"
                : progress === 0 ? "not_started"
                    : progress === 100 ? "done"
                        : "in_progress";

        return {
            ...module,
            progress,
            status,
        };
    });

    const totalProgress = enriched.length > 0
        ? Math.round(enriched.reduce((acc, module) => acc + (module.progress || 0), 0) / enriched.length)
        : 0;

    const statusCounts = {
        done: enriched.filter((module) => module.status === "done").length,
        in_progress: enriched.filter((module) => module.status === "in_progress").length,
        blocked: enriched.filter((module) => module.status === "blocked").length,
        not_started: enriched.filter((module) => module.status === "not_started").length,
    };

    const orderedModules = useMemo(
        () => [...enriched].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)),
        [enriched]
    );
    const activeModule =
        orderedModules.find((module) => module.is_active) ||
        orderedModules.find((m) => m.status === "in_progress" || m.status === "blocked") ||
        orderedModules[0];
    const nextModuleOrder = useMemo(() => {
        if (!modules.length) return 0;
        const maxOrder = Math.max(...modules.map((module) => module.order_index ?? 0));
        return maxOrder + 1;
    }, [modules]);

    const handleDeleteWorkflow = async () => {
        if (!activeWorkflow) return;
        const confirmed = window.confirm("Excluir workflow? Essa ação não pode ser desfeita.");
        if (!confirmed) return;
        await deleteWorkflow.mutateAsync(activeWorkflow.id);
    };

    const handleAdvanceModule = async (currentId: string, nextId: string) => {
        await updateModule.mutateAsync({ id: currentId, is_active: false });
        await updateModule.mutateAsync({ id: nextId, is_active: true });
    };

    return (
        <div className="space-y-6">
            {isLoading && (
                <GlassCard>
                    <GlassCardContent className="p-6 flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Carregando workflow...
                    </GlassCardContent>
                </GlassCard>
            )}
            {hasError && (
                <GlassCard>
                    <GlassCardContent className="p-6 text-center text-muted-foreground">
                        <p>Erro ao carregar workflow. Tente novamente.</p>
                    </GlassCardContent>
                </GlassCard>
            )}
            {!isLoading && !activeWorkflow && (
                <GlassCard>
                    <GlassCardContent className="p-6 text-center text-muted-foreground">
                        <p>Nenhum workflow encontrado para este cliente.</p>
                        <Button className="mt-4 gap-2" onClick={() => setCreateWorkflowOpen(true)}>
                            <Plus className="h-4 w-4" />
                            Criar Workflow
                        </Button>
                    </GlassCardContent>
                </GlassCard>
            )}
            {/* Summary Card */}
            {activeWorkflow && (
                <GlassCard>
                <GlassCardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <GlassCardTitle className="flex items-center gap-2 text-base">
                            <GitBranch className="h-5 w-5 text-primary" />
                            {activeWorkflow.name || "Progresso do Workflow"}
                        </GlassCardTitle>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => setCreateModuleOpen(true)}>
                                <Plus className="h-4 w-4" />
                                Novo Módulo
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2" onClick={() => setCreateWorkflowOpen(true)}>
                                <Plus className="h-4 w-4" />
                                Novo Workflow
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2 text-destructive" onClick={handleDeleteWorkflow}>
                                <Trash2 className="h-4 w-4" />
                                Excluir
                            </Button>
                        </div>
                    </div>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Progresso Geral</span>
                                <span className="text-lg font-bold">{totalProgress}%</span>
                            </div>
                            <Progress value={totalProgress} className="h-3" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 rounded-xl bg-emerald-500/10">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
                            <p className="text-lg font-bold">{statusCounts.done}</p>
                            <p className="text-xs text-muted-foreground">Concluídos</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-blue-500/10">
                            <Clock className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                            <p className="text-lg font-bold">{statusCounts.in_progress}</p>
                            <p className="text-xs text-muted-foreground">Em Andamento</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-red-500/10">
                            <AlertTriangle className="h-5 w-5 text-red-500 mx-auto mb-1" />
                            <p className="text-lg font-bold">{statusCounts.blocked}</p>
                            <p className="text-xs text-muted-foreground">Bloqueados</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-muted/50">
                            <div className="h-5 w-5 mx-auto mb-1 flex items-center justify-center">
                                <div className="h-3 w-3 rounded-full border-2 border-muted-foreground" />
                            </div>
                            <p className="text-lg font-bold">{statusCounts.not_started}</p>
                            <p className="text-xs text-muted-foreground">Não Iniciados</p>
                        </div>
                    </div>
                </GlassCardContent>
            </GlassCard>
            )}

            {/* Timeline */}
            {activeWorkflow && (
                <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="text-base">
                        Módulos do Workflow ({enriched.length})
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-3">
                    {orderedModules.map((module, index) => {
                        const nextModule = orderedModules[index + 1];
                        const isActive = activeModule?.id === module.id;
                        return (
                            <ModuleCard
                                key={module.id}
                                module={module}
                                isActive={isActive}
                                agencyId={agencyId}
                                nextModuleName={nextModule?.name}
                                onAdvanceModule={
                                    isActive && nextModule
                                        ? () => handleAdvanceModule(module.id, nextModule.id)
                                        : undefined
                                }
                            />
                        );
                    })}
                </GlassCardContent>
            </GlassCard>
            )}

            {workspaceId && (
                <CreateWorkflowDialog
                    open={createWorkflowOpen}
                    onOpenChange={setCreateWorkflowOpen}
                    workspaceId={workspaceId}
                />
            )}

            {activeWorkflow?.id && (
                <CreateModuleDialog
                    open={createModuleOpen}
                    onOpenChange={setCreateModuleOpen}
                    workflowId={activeWorkflow.id}
                    nextOrder={nextModuleOrder}
                />
            )}
        </div>
    );
}

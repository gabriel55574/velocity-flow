import { ModuleCard } from "./ModuleCard";
import { mockWorkflowModules } from "@/data/mockData";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { GitBranch, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export function WorkflowTimeline() {
    const modules = mockWorkflowModules;

    // Calculate overall progress
    const totalProgress = Math.round(
        modules.reduce((acc, m) => acc + m.progress, 0) / modules.length
    );

    // Count by status
    const statusCounts = {
        done: modules.filter(m => m.status === "done").length,
        in_progress: modules.filter(m => m.status === "in_progress").length,
        blocked: modules.filter(m => m.status === "blocked").length,
        not_started: modules.filter(m => m.status === "not_started").length,
    };

    // Find current active module
    const activeModule = modules.find(m => m.status === "in_progress" || m.status === "blocked");

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2 text-base">
                        <GitBranch className="h-5 w-5 text-primary" />
                        Progresso do Workflow
                    </GlassCardTitle>
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

                    <div className="grid grid-cols-4 gap-4">
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

            {/* Timeline */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="text-base">
                        Módulos do Workflow ({modules.length})
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-3">
                    {modules.map((module) => (
                        <ModuleCard
                            key={module.id}
                            module={module}
                            isActive={activeModule?.id === module.id}
                        />
                    ))}
                </GlassCardContent>
            </GlassCard>
        </div>
    );
}

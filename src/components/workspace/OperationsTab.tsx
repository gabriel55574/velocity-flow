import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockTasks, mockUsers, Task } from "@/data/mockData";
import { Play, CheckCircle2, Clock, AlertTriangle, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
    task: Task;
}

function TaskCard({ task }: TaskCardProps) {
    const priorityColors = {
        low: "bg-slate-100 text-slate-600",
        medium: "bg-blue-100 text-blue-600",
        high: "bg-amber-100 text-amber-600",
        urgent: "bg-red-100 text-red-600",
    };

    return (
        <div className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-medium line-clamp-2">{task.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                    {task.priority}
                </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{task.owner.name}</span>
                </div>
                <span>Vence: {new Date(task.dueAt).toLocaleDateString('pt-BR')}</span>
            </div>
        </div>
    );
}

interface KanbanColumnProps {
    title: string;
    status: 'todo' | 'doing' | 'done' | 'blocked';
    tasks: Task[];
    icon: React.ElementType;
    color: string;
}

function KanbanColumn({ title, status, tasks, icon: Icon, color }: KanbanColumnProps) {
    return (
        <div className="flex-1 min-w-[280px]">
            <div className={`flex items-center gap-2 p-3 rounded-t-xl ${color}`}>
                <Icon className="h-4 w-4" />
                <span className="font-semibold text-sm">{title}</span>
                <span className="ml-auto text-xs bg-white/50 px-2 py-0.5 rounded-full">
                    {tasks.length}
                </span>
            </div>
            <div className="p-3 rounded-b-xl bg-secondary/30 min-h-[300px] space-y-2">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
                {tasks.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                        Nenhuma tarefa
                    </div>
                )}
            </div>
        </div>
    );
}

export function OperationsTab() {
    // Get tasks for the first client
    const clientTasks = mockTasks;

    const columns = [
        {
            title: "A Fazer",
            status: "todo" as const,
            icon: Clock,
            color: "bg-slate-200"
        },
        {
            title: "Em Andamento",
            status: "doing" as const,
            icon: Play,
            color: "bg-blue-200"
        },
        {
            title: "Concluído",
            status: "done" as const,
            icon: CheckCircle2,
            color: "bg-emerald-200"
        },
        {
            title: "Bloqueado",
            status: "blocked" as const,
            icon: AlertTriangle,
            color: "bg-red-200"
        },
    ];

    return (
        <div className="space-y-6">
            {/* Sprint Header */}
            <GlassCard>
                <GlassCardHeader>
                    <div className="flex items-center justify-between">
                        <GlassCardTitle className="flex items-center gap-2 text-base">
                            <Play className="h-5 w-5 text-primary" />
                            Sprint Semanal - 06 a 12 Jan 2026
                        </GlassCardTitle>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nova Tarefa
                        </Button>
                    </div>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold">{clientTasks.length}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-500">
                                {clientTasks.filter(t => t.status === "done").length}
                            </p>
                            <p className="text-xs text-muted-foreground">Concluídas</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-500">
                                {clientTasks.filter(t => t.status === "doing").length}
                            </p>
                            <p className="text-xs text-muted-foreground">Em Andamento</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-red-500">
                                {clientTasks.filter(t => t.status === "blocked").length}
                            </p>
                            <p className="text-xs text-muted-foreground">Bloqueadas</p>
                        </div>
                    </div>
                </GlassCardContent>
            </GlassCard>

            {/* Kanban Board */}
            <div className="overflow-x-auto">
                <div className="flex gap-4 min-w-max">
                    {columns.map((col) => (
                        <KanbanColumn
                            key={col.status}
                            title={col.title}
                            status={col.status}
                            tasks={clientTasks.filter(t => t.status === col.status)}
                            icon={col.icon}
                            color={col.color}
                        />
                    ))}
                </div>
            </div>

            {/* Weekly Routine Checklist */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="text-base">
                        Rotina Semanal
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { title: "Revisão de métricas", day: "Segunda", done: true },
                            { title: "Planejamento de sprint", day: "Segunda", done: true },
                            { title: "Criação de conteúdo", day: "Terça-Quarta", done: false },
                            { title: "Otimização de campanhas", day: "Quarta", done: false },
                            { title: "Follow-up CRM", day: "Diário", done: true },
                            { title: "Report semanal", day: "Sexta", done: false },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                                {item.done ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                ) : (
                                    <Clock className="h-5 w-5 text-amber-500" />
                                )}
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">{item.day}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCardContent>
            </GlassCard>

            {/* Sprint History */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="text-base">
                        Histórico de Sprints
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="space-y-3">
                        {[
                            { week: "30 Dez - 05 Jan", done: 8, total: 10, status: "ok" },
                            { week: "23 - 29 Dez", done: 7, total: 8, status: "ok" },
                            { week: "16 - 22 Dez", done: 5, total: 9, status: "warn" },
                            { week: "09 - 15 Dez", done: 9, total: 10, status: "ok" },
                        ].map((sprint, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30">
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{sprint.week}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {sprint.done} de {sprint.total} tarefas ({Math.round((sprint.done / sprint.total) * 100)}%)
                                    </p>
                                </div>
                                <StatusBadge status={sprint.status as "ok" | "warn" | "risk"} size="sm">
                                    {sprint.status === "ok" ? "Bom" : "Atenção"}
                                </StatusBadge>
                            </div>
                        ))}
                    </div>
                </GlassCardContent>
            </GlassCard>
        </div>
    );
}

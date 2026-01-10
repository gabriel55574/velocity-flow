import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Play, CheckCircle2, Clock, AlertTriangle, Plus, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { useUsers } from "@/hooks/useUsers";
import { Database } from "@/types/database";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface TaskCardProps {
    task: any; // Using any for now to handle the joined user data from useTasks
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
                <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium}`}>
                    {task.priority || 'medium'}
                </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{task.owner?.full_name || "Desconhecido"}</span>
                </div>
                <span>Vence: {task.due_at ? new Date(task.due_at).toLocaleDateString('pt-BR') : 'N/A'}</span>
            </div>
        </div>
    );
}

interface KanbanColumnProps {
    title: string;
    status: 'todo' | 'doing' | 'done' | 'blocked';
    tasks: any[];
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

interface OperationsTabProps {
    clientId: string;
}

export function OperationsTab({ clientId }: OperationsTabProps) {
    const { data: tasks, isLoading: tasksLoading } = useTasks({ client_id: clientId });

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

    if (tasksLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Carregando operações...</p>
            </div>
        );
    }

    const clientTasks = tasks || [];

    return (
        <div className="space-y-6">
            {/* Sprint Header */}
            <GlassCard>
                <GlassCardHeader>
                    <div className="flex items-center justify-between">
                        <GlassCardTitle className="flex items-center gap-2 text-base">
                            <Play className="h-5 w-5 text-primary" />
                            Sprint Semanal
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

            {/* Weekly Routine Checklist - Static for now */}
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
        </div>
    );
}

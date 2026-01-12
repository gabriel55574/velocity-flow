import { useMemo, useState } from "react";
import type { ElementType } from "react";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Play, CheckCircle2, Clock, AlertTriangle, Plus, User, Loader2, Inbox, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { useClient } from "@/hooks/useClients";
import { useTeamMembers } from "@/hooks/useUsers";
import { CreateTaskDialog, EditTaskDialog } from "@/components/dialogs";
import type { Database } from "@/types/database";

type Task = Database["public"]["Tables"]["tasks"]["Row"];
type TaskStatus = Database["public"]["Enums"]["task_status"];
type TaskWithStatus = Task & { status: TaskStatus };

interface TaskCardProps {
    task: Task;
    assigneeName?: string;
    onClick?: () => void;
}

function TaskCard({ task, assigneeName, onClick }: TaskCardProps) {
    const priorityColors: Record<NonNullable<Task["priority"]>, string> = {
        low: "bg-slate-100 text-slate-600",
        medium: "bg-blue-100 text-blue-600",
        high: "bg-amber-100 text-amber-600",
        urgent: "bg-red-100 text-red-600",
    };
    const priority = task.priority || "medium";
    const dueDateLabel = task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR') : 'N/A';

    return (
        <div
            className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    onClick?.();
                }
            }}
        >
            <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-medium line-clamp-2">{task.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[priority]}`}>
                    {priority}
                </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{assigneeName || "Sem responsavel"}</span>
                </div>
                <span>Vence: {dueDateLabel}</span>
            </div>
        </div>
    );
}

interface KanbanColumnProps {
    title: string;
    status: TaskStatus;
    tasks: TaskWithStatus[];
    icon: ElementType;
    color: string;
    onSelectTask: (task: Task) => void;
    getAssigneeName: (assigneeId?: string | null) => string | undefined;
}

function KanbanColumn({ title, status, tasks, icon: Icon, color, onSelectTask, getAssigneeName }: KanbanColumnProps) {
    return (
        <div className="min-w-0">
            <div className={`flex items-center gap-2 p-3 rounded-t-xl ${color}`}>
                <Icon className="h-4 w-4" />
                <span className="font-semibold text-sm">{title}</span>
                <span className="ml-auto text-xs bg-white/50 px-2 py-0.5 rounded-full">
                    {tasks.length}
                </span>
            </div>
            <div className="p-3 rounded-b-xl bg-secondary/30 min-h-[300px] space-y-2">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        assigneeName={getAssigneeName(task.assignee_id)}
                        onClick={() => onSelectTask(task)}
                    />
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
    const { data: tasks, isLoading: tasksLoading, error: tasksError } = useTasks({ client_id: clientId });
    const { data: client } = useClient(clientId);
    const agencyId = client?.agency_id || undefined;
    const { data: teamMembers } = useTeamMembers(agencyId);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const assigneeNameById = useMemo(() => {
        return new Map(teamMembers?.map((member) => [member.id, member.full_name]) || []);
    }, [teamMembers]);

    const normalizedTasks = useMemo(() => {
        return (tasks || []).map((task) => ({
            ...task,
            status: task.status || "backlog",
        })) as TaskWithStatus[];
    }, [tasks]);

    const columns = [
        {
            title: "Backlog",
            status: "backlog" as const,
            icon: Inbox,
            color: "bg-slate-200"
        },
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
            title: "Revisao",
            status: "review" as const,
            icon: Eye,
            color: "bg-purple-200"
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

    if (tasksError) {
        return (
            <GlassCard>
                <GlassCardContent className="p-6 text-center text-muted-foreground">
                    <p>Erro ao carregar tarefas. Tente novamente.</p>
                </GlassCardContent>
            </GlassCard>
        );
    }

    const clientTasks = normalizedTasks;
    const getAssigneeName = (assigneeId?: string | null) => {
        if (!assigneeId) return undefined;
        return assigneeNameById.get(assigneeId);
    };

    return (
        <div className="space-y-6">
            {/* Sprint Header */}
            <GlassCard>
                <GlassCardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <GlassCardTitle className="flex items-center gap-2 text-base">
                            <Play className="h-5 w-5 text-primary" />
                            Sprint Semanal
                        </GlassCardTitle>
                        <Button size="sm" className="gap-2" onClick={() => setIsCreateOpen(true)}>
                            <Plus className="h-4 w-4" />
                            Nova Tarefa
                        </Button>
                    </div>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
                {columns.map((col) => (
                    <KanbanColumn
                        key={col.status}
                        title={col.title}
                        status={col.status}
                        tasks={clientTasks.filter(t => t.status === col.status)}
                        icon={col.icon}
                        color={col.color}
                        onSelectTask={(task) => {
                            setSelectedTask(task);
                            setIsEditOpen(true);
                        }}
                        getAssigneeName={getAssigneeName}
                    />
                ))}
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

            <CreateTaskDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                clientId={clientId}
                agencyId={agencyId}
            />
            <EditTaskDialog
                open={isEditOpen}
                onOpenChange={(open) => {
                    setIsEditOpen(open);
                    if (!open) setSelectedTask(null);
                }}
                task={selectedTask}
                agencyId={agencyId}
            />
        </div>
    );
}

import { PageHeader } from "@/components/layout/PageHeader";
import { ActionCard } from "./ActionCard";
import { MetricCard } from "./MetricCard";
import { ClientHealthCard } from "./ClientHealthCard";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  CheckCircle2,
  Plus,
  Sparkles,
  Calendar,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useBlockedGates } from "@/hooks/useWorkflows";
import { usePendingApprovals } from "@/hooks/useApprovals";
import { useTasks } from "@/hooks/useTasks";
import { useNavigate } from "react-router-dom";

// Convert health_score (0-100) to health status
function getHealthStatus(score: number | null): "ok" | "warn" | "risk" {
  if (score === null) return "ok";
  if (score >= 80) return "ok";
  if (score >= 50) return "warn";
  return "risk";
}

// Map status to display labels
const statusLabels: Record<string, string> = {
  lead: "Lead",
  onboarding: "Onboarding",
  active: "Ativo",
  paused: "Pausado",
  churned: "Churned",
};

export function TodayDashboard() {
  const navigate = useNavigate();
  const { data: clients, isLoading: clientsLoading, error: clientsError } = useClients();
  const { data: blockedGates, isLoading: gatesLoading, error: gatesError } = useBlockedGates();
  const { data: pendingApprovals, isLoading: approvalsLoading, error: approvalsError } = usePendingApprovals();
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useTasks();

  const isLoading = clientsLoading || gatesLoading || approvalsLoading || tasksLoading;
  const hasError = Boolean(clientsError || gatesError || approvalsError || tasksError);

  // Calculate metrics
  const activeClients = clients?.filter(c => c.status === 'active').length || 0;
  const blockedGatesCount = blockedGates?.length || 0;
  const pendingApprovalsCount = pendingApprovals?.length || 0;
  const completedToday = tasks?.filter(t => {
    if (t.status !== 'done') return false;
    const refDate = t.updated_at || t.created_at;
    if (!refDate) return false;
    const date = new Date(refDate);
    const now = new Date();
    return date.toDateString() === now.toDateString();
  }).length || 0;

  // Get at-risk clients (health_score < 80)
  const clientsAtRisk = (clients || [])
    .filter(c => getHealthStatus(c.health_score) !== 'ok')
    .slice(0, 3);

  const clientsById = new Map((clients || []).map((client) => [client.id, client.name]));
  const getClientName = (clientId?: string | null) => {
    if (!clientId) return "Cliente";
    return clientsById.get(clientId) || "Cliente";
  };

  const getDueLabel = (dueDate?: string | null) => {
    if (!dueDate) return undefined;
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return `Atrasado ${Math.abs(diffDays)}d`;
    if (diffDays === 0) return "Vence hoje";
    if (diffDays === 1) return "Vence amanhã";
    return `Vence em ${diffDays}d`;
  };

  const getDueStatus = (dueDate?: string | null) => {
    if (!dueDate) return "ok";
    const due = new Date(dueDate);
    const diffHours = (due.getTime() - Date.now()) / (1000 * 60 * 60);
    if (diffHours < 0) return "risk";
    if (diffHours <= 24) return "warn";
    return "ok";
  };

  const approvalsSorted = [...(pendingApprovals || [])].sort((a, b) => {
    const aDue = a.due_date ? new Date(a.due_date).getTime() : Number.MAX_SAFE_INTEGER;
    const bDue = b.due_date ? new Date(b.due_date).getTime() : Number.MAX_SAFE_INTEGER;
    return aDue - bDue;
  });

  const taskPriorityRank: Record<string, number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  const tasksSorted = [...(tasks || [])]
    .filter((task) => task.status !== "done")
    .sort((a, b) => {
      const aPriority = taskPriorityRank[a.priority || "medium"] ?? 2;
      const bPriority = taskPriorityRank[b.priority || "medium"] ?? 2;
      if (aPriority !== bPriority) return aPriority - bPriority;
      const aDue = a.due_date ? new Date(a.due_date).getTime() : Number.MAX_SAFE_INTEGER;
      const bDue = b.due_date ? new Date(b.due_date).getTime() : Number.MAX_SAFE_INTEGER;
      return aDue - bDue;
    });

  const actionCandidates: Array<{
    title: string;
    client: string;
    type: "approval" | "gate" | "sla" | "task";
    status: "risk" | "blocked" | "warn" | "ok";
    dueTime?: string;
    onClick?: () => void;
  }> = [];

  approvalsSorted.slice(0, 2).forEach((approval) => {
    actionCandidates.push({
      title: approval.title,
      client: getClientName(approval.client_id),
      type: "approval",
      status: getDueStatus(approval.due_date),
      dueTime: getDueLabel(approval.due_date),
      onClick: () => approval.client_id && navigate(`/clients/${approval.client_id}`),
    });
  });

  (blockedGates || []).slice(0, 2).forEach((gate) => {
    const gateClient = gate.module?.workflow?.workspace?.client;
    actionCandidates.push({
      title: `Gate bloqueado: ${gate.name}`,
      client: gateClient?.name || "Cliente",
      type: "gate",
      status: "blocked",
      onClick: () => gateClient?.id && navigate(`/clients/${gateClient.id}`),
    });
  });

  tasksSorted.slice(0, 3).forEach((task) => {
    actionCandidates.push({
      title: task.title,
      client: getClientName(task.client_id),
      type: "task",
      status: task.priority === "urgent" ? "risk" : task.priority === "high" ? "warn" : getDueStatus(task.due_date),
      dueTime: getDueLabel(task.due_date),
      onClick: () => task.client_id && navigate(`/clients/${task.client_id}`),
    });
  });

  const topActions = actionCandidates.slice(0, 5).map((action, index) => ({
    ...action,
    priority: index + 1,
  }));

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-full">
        <PageHeader 
          title="Today" 
          subtitle="Carregando..."
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col min-h-full">
        <PageHeader
          title="Today"
          subtitle="Erro ao carregar"
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <GlassCard className="p-8 text-center max-w-md">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold mb-2">Não foi possível carregar o dashboard</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Verifique sua sessão e tente novamente.
            </p>
            <Button onClick={() => window.location.reload()}>
              Recarregar
            </Button>
          </GlassCard>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader 
        title="Today" 
        subtitle="Foco nas ações que destravam resultados"
        actions={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova Ação</span>
          </Button>
        }
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Clientes Ativos"
            value={activeClients}
            icon={<Users className="h-5 w-5" />}
          />
          <MetricCard
            title="Gates Bloqueados"
            value={blockedGatesCount}
            status={blockedGatesCount > 0 ? "risk" : undefined}
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <MetricCard
            title="Aprovações Pendentes"
            value={pendingApprovalsCount}
            status={pendingApprovalsCount > 0 ? "warn" : undefined}
            icon={<Clock className="h-5 w-5" />}
          />
          <MetricCard
            title="Concluídos Hoje"
            value={completedToday}
            status="ok"
            icon={<CheckCircle2 className="h-5 w-5" />}
          />
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Top 5 Actions */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Top 5 Ações</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                Ver todas
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-3 stagger-children">
              {topActions.length > 0 ? (
                topActions.map((action) => (
                  <ActionCard key={action.priority} {...action} />
                ))
              ) : (
                <GlassCard className="p-8 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto text-ok/50 mb-4" />
                  <h3 className="font-semibold mb-2">Tudo em dia!</h3>
                  <p className="text-sm text-muted-foreground">
                    Nenhuma ação pendente no momento
                  </p>
                </GlassCard>
              )}
            </div>
          </div>

          {/* Clients at Risk + Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <GlassCard className="p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Ações Rápidas
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1.5 text-xs">
                  <Calendar className="h-4 w-4" />
                  Criar Sprint
                </Button>
                <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1.5 text-xs">
                  <CheckCircle2 className="h-4 w-4" />
                  Solicitar Aprovação
                </Button>
              </div>
            </GlassCard>

            {/* Clients at Risk */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-risk" />
                  Clientes em Atenção
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-muted-foreground"
                  onClick={() => navigate('/clients')}
                >
                  Ver todos
                </Button>
              </div>
              
              <div className="space-y-3 stagger-children">
                {clientsAtRisk.length > 0 ? (
                  clientsAtRisk.map((client) => (
                    <ClientHealthCard 
                      key={client.id}
                      id={client.id}
                      name={client.name}
                      niche={client.niche || "Sem nicho"}
                      phase={statusLabels[client.status || "active"] || "Ativo"}
                      health={getHealthStatus(client.health_score)}
                      blockedGates={0}
                      pendingApprovals={0}
                      owner="—"
                      onClick={() => navigate(`/clients/${client.id}`)}
                    />
                  ))
                ) : (
                  <GlassCard className="p-6 text-center">
                    <CheckCircle2 className="h-8 w-8 mx-auto text-ok/50 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Todos os clientes estão saudáveis
                    </p>
                  </GlassCard>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

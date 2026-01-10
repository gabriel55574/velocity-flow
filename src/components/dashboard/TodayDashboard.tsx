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
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: blockedGates, isLoading: gatesLoading } = useBlockedGates();
  const { data: pendingApprovals, isLoading: approvalsLoading } = usePendingApprovals();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  const isLoading = clientsLoading || gatesLoading || approvalsLoading || tasksLoading;

  // Calculate metrics
  const activeClients = clients?.filter(c => c.status === 'active').length || 0;
  const blockedGatesCount = blockedGates?.length || 0;
  const pendingApprovalsCount = pendingApprovals?.length || 0;
  const completedToday = tasks?.filter(t => t.status === 'done').length || 0;

  // Get at-risk clients (health_score < 80)
  const clientsAtRisk = (clients || [])
    .filter(c => getHealthStatus(c.health_score) !== 'ok')
    .slice(0, 3);

  // Build top actions from real data
  const topActions: Array<{
    priority: number;
    title: string;
    client: string;
    type: "approval" | "gate" | "sla" | "task";
    status: "risk" | "blocked" | "warn" | "ok";
    dueTime?: string;
  }> = [];

  // Add pending approvals as actions
  pendingApprovals?.slice(0, 2).forEach((approval, index) => {
    topActions.push({
      priority: topActions.length + 1,
      title: approval.title,
      client: "Cliente",
      type: "approval",
      status: "warn",
      dueTime: approval.due_date ? `Vence ${new Date(approval.due_date).toLocaleDateString('pt-BR')}` : undefined,
    });
  });

  // Add blocked gates as actions
  blockedGates?.slice(0, 2).forEach((gate) => {
    topActions.push({
      priority: topActions.length + 1,
      title: `Gate bloqueado: ${gate.name}`,
      client: "Cliente",
      type: "gate",
      status: "blocked",
    });
  });

  // Add urgent tasks
  tasks?.filter(t => t.priority === 'urgent' && t.status !== 'done').slice(0, 1).forEach((task) => {
    topActions.push({
      priority: topActions.length + 1,
      title: task.title,
      client: "Cliente",
      type: "task",
      status: "risk",
      dueTime: task.due_date ? `Vence ${new Date(task.due_date).toLocaleDateString('pt-BR')}` : undefined,
    });
  });

  // Fill remaining slots with regular tasks
  const remainingSlots = 5 - topActions.length;
  tasks?.filter(t => t.status !== 'done').slice(0, remainingSlots).forEach((task) => {
    topActions.push({
      priority: topActions.length + 1,
      title: task.title,
      client: "Cliente",
      type: "task",
      status: task.priority === 'high' ? 'warn' : 'ok',
      dueTime: task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR') : undefined,
    });
  });

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

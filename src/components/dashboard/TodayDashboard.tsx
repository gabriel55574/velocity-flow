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
  ArrowRight
} from "lucide-react";

// Mock data - will be replaced with real data from Supabase
const topActions = [
  {
    priority: 1,
    title: "Aprovar criativos da campanha de Janeiro",
    client: "Visage Face",
    type: "approval" as const,
    status: "risk" as const,
    dueTime: "Vence em 2h",
  },
  {
    priority: 2,
    title: "Gate Go-Live bloqueado: UTMs pendentes",
    client: "Clínica Dermato+",
    type: "gate" as const,
    status: "blocked" as const,
  },
  {
    priority: 3,
    title: "Relatório semanal atrasado",
    client: "Studio Estética",
    type: "sla" as const,
    status: "warn" as const,
    dueTime: "Atrasado 1 dia",
  },
  {
    priority: 4,
    title: "Revisar copy do WhatsApp",
    client: "Visage Face",
    type: "task" as const,
    status: "warn" as const,
    dueTime: "Hoje às 18h",
  },
  {
    priority: 5,
    title: "Configurar eventos do Pixel",
    client: "Centro Médico SP",
    type: "task" as const,
    status: "ok" as const,
    dueTime: "Amanhã",
  },
];

const clientsAtRisk = [
  {
    name: "Visage Face",
    niche: "Harmonização Facial",
    phase: "Operação",
    health: "risk" as const,
    blockedGates: 2,
    pendingApprovals: 3,
    owner: "Maria CS",
  },
  {
    name: "Clínica Dermato+",
    niche: "Dermatologia",
    phase: "Setup",
    health: "warn" as const,
    blockedGates: 1,
    pendingApprovals: 0,
    owner: "João CS",
  },
  {
    name: "Studio Estética",
    niche: "Estética Geral",
    phase: "Go-Live",
    health: "warn" as const,
    blockedGates: 0,
    pendingApprovals: 2,
    owner: "Maria CS",
  },
];

export function TodayDashboard() {
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
            value={12}
            icon={<Users className="h-5 w-5" />}
          />
          <MetricCard
            title="Gates Bloqueados"
            value={4}
            status="risk"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <MetricCard
            title="SLAs Vencendo"
            value={3}
            status="warn"
            icon={<Clock className="h-5 w-5" />}
          />
          <MetricCard
            title="Concluídos Hoje"
            value={7}
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
              {topActions.map((action) => (
                <ActionCard key={action.priority} {...action} />
              ))}
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
                  Clientes em Risco
                </h2>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                  Ver todos
                </Button>
              </div>
              
              <div className="space-y-3 stagger-children">
                {clientsAtRisk.map((client) => (
                  <ClientHealthCard key={client.name} {...client} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

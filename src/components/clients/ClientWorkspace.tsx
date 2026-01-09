import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  WorkflowTimeline,
  StrategyTab,
  OperationsTab,
  CRMTab,
  ContentTab,
  MediaTab,
  DataTab,
  ApprovalsTab,
  AssetsTab,
  NotesTab
} from "@/components/workspace";
import {
  ArrowLeft,
  LayoutDashboard,
  GitBranch,
  Target,
  Play,
  MessageSquare,
  Image,
  BarChart3,
  Database,
  CheckSquare,
  FolderOpen,
  FileText,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar
} from "lucide-react";

// Mock client data
const clientData = {
  id: "1",
  name: "Visage Face",
  niche: "Harmonização Facial",
  phase: "Operação",
  health: "risk" as const,
  progress: 68,
  owner: "Maria CS",
  lastMBR: "15/12/2024",
  nextMBR: "15/01/2025",
  kpis: {
    leads: { value: 156, change: 12 },
    appointments: { value: 89, change: -5 },
    showRate: { value: "72%", change: 3 },
    conversion: { value: "34%", change: 8 },
  },
  blockedGates: [
    { name: "Gate Tracking", reason: "UTMs não configurados" },
    { name: "Gate CRM", reason: "Scripts pendentes de revisão" },
  ],
  pendingApprovals: [
    { title: "Criativos Janeiro", type: "creative", dueIn: "2h" },
    { title: "Copy WhatsApp", type: "copy", dueIn: "1 dia" },
    { title: "Plano Mídia Q1", type: "plan", dueIn: "3 dias" },
  ],
  tasks: [
    { title: "Revisar métricas semanais", status: "doing", owner: "Analyst" },
    { title: "Criar 3 novos criativos", status: "todo", owner: "Editor" },
    { title: "Otimizar campanhas", status: "done", owner: "Media" },
  ],
};

const workspaceTabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "workflows", label: "Workflows", icon: GitBranch },
  { id: "strategy", label: "Estratégia", icon: Target },
  { id: "operations", label: "Operações", icon: Play },
  { id: "crm", label: "CRM", icon: MessageSquare },
  { id: "content", label: "Conteúdo", icon: Image },
  { id: "media", label: "Mídia", icon: BarChart3 },
  { id: "data", label: "Dados", icon: Database },
  { id: "approvals", label: "Aprovações", icon: CheckSquare },
  { id: "assets", label: "Ativos", icon: FolderOpen },
  { id: "notes", label: "Notas", icon: FileText },
];

export function ClientWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title={clientData.name}
        subtitle={`${clientData.niche} • ${clientData.phase}`}
        actions={
          <Button variant="ghost" size="sm" onClick={() => navigate("/clients")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        }
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <GlassCard className="p-4 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Health</span>
              <StatusBadge status={clientData.health}>
                {clientData.health === "risk" ? "Em Risco" : clientData.health === "warn" ? "Atenção" : "Saudável"}
              </StatusBadge>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>Progresso</span>
                <span className="font-semibold">{clientData.progress}%</span>
              </div>
              <Progress value={clientData.progress} className="h-2" />
            </div>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <p className="text-2xl font-bold">{clientData.kpis.leads.value}</p>
            <p className="text-xs text-muted-foreground">Leads (30d)</p>
            <p className="text-xs text-ok">+{clientData.kpis.leads.change}%</p>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <p className="text-2xl font-bold">{clientData.kpis.showRate.value}</p>
            <p className="text-xs text-muted-foreground">Show Rate</p>
            <p className="text-xs text-ok">+{clientData.kpis.showRate.change}%</p>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <p className="text-2xl font-bold">{clientData.kpis.conversion.value}</p>
            <p className="text-xs text-muted-foreground">Conversão</p>
            <p className="text-xs text-ok">+{clientData.kpis.conversion.change}%</p>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Próximo MBR</span>
            </div>
            <p className="font-semibold">{clientData.nextMBR}</p>
          </GlassCard>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex h-auto p-1 bg-secondary/50">
              {workspaceTabs.slice(0, 6).map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="gap-2 px-4 py-2 data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-4">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Blocked Gates */}
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="h-5 w-5 text-risk" />
                    Gates Bloqueados
                  </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-3">
                  {clientData.blockedGates.length > 0 ? (
                    clientData.blockedGates.map((gate, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-risk/5 border border-risk/10">
                        <div>
                          <p className="font-medium text-sm">{gate.name}</p>
                          <p className="text-xs text-muted-foreground">{gate.reason}</p>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs">
                          Resolver
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-ok" />
                      <p className="text-sm">Nenhum gate bloqueado</p>
                    </div>
                  )}
                </GlassCardContent>
              </GlassCard>

              {/* Pending Approvals */}
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-5 w-5 text-warn" />
                    Aprovações Pendentes
                  </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-3">
                  {clientData.pendingApprovals.map((approval, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                      <div>
                        <p className="font-medium text-sm">{approval.title}</p>
                        <p className="text-xs text-muted-foreground">Vence em {approval.dueIn}</p>
                      </div>
                      <StatusBadge status={approval.dueIn.includes("h") ? "risk" : "warn"} size="sm">
                        {approval.type}
                      </StatusBadge>
                    </div>
                  ))}
                </GlassCardContent>
              </GlassCard>
            </div>

            {/* Current Tasks */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2 text-base">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  Tarefas do Sprint
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  {["todo", "doing", "done"].map((status) => (
                    <div key={status} className="space-y-2">
                      <h4 className="text-xs font-medium uppercase text-muted-foreground tracking-wide">
                        {status === "todo" ? "A Fazer" : status === "doing" ? "Em Andamento" : "Concluído"}
                      </h4>
                      <div className="space-y-2">
                        {clientData.tasks
                          .filter((t) => t.status === status)
                          .map((task, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-xl bg-secondary/50 border border-border/50"
                            >
                              <p className="text-sm font-medium">{task.title}</p>
                              <p className="text-xs text-muted-foreground">{task.owner}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows" className="space-y-6 mt-4">
            <WorkflowTimeline />
          </TabsContent>

          {/* Strategy Tab */}
          <TabsContent value="strategy" className="space-y-6 mt-4">
            <StrategyTab />
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-6 mt-4">
            <OperationsTab />
          </TabsContent>

          {/* CRM Tab */}
          <TabsContent value="crm" className="space-y-6 mt-4">
            <CRMTab />
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6 mt-4">
            <ContentTab />
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6 mt-4">
            <MediaTab />
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6 mt-4">
            <DataTab />
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6 mt-4">
            <ApprovalsTab />
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="space-y-6 mt-4">
            <AssetsTab />
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6 mt-4">
            <NotesTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

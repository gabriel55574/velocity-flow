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
  Calendar,
  Loader2
} from "lucide-react";
import { useClient } from "@/hooks/useClients";

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

import { useCampaigns } from "@/hooks/useCampaigns";
import { useLeads } from "@/hooks/useLeads";
import { useState } from "react";
import {
  Users,
  DollarSign,
  Activity,
  ChevronLeft,
  LayoutDashboard as Layout,
  Share2,
  Settings,
  ArrowLeft
} from "lucide-react";

export function ClientWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: client, isLoading: clientLoading, error: clientError } = useClient(id || "");
  const { data: campaigns, isLoading: campaignsLoading, error: campaignsError } = useCampaigns({ client_id: id || "" });
  const { data: leads, isLoading: leadsLoading, error: leadsError } = useLeads({ client_id: id || "" });

  const [activeTab, setActiveTab] = useState("overview");

  if (clientLoading || campaignsLoading || leadsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Sincronizando Workspace...</p>
      </div>
    );
  }

  const isAuthError = [clientError, campaignsError, leadsError].some(
    (e: any) => e?.status === 401 || e?.message?.includes("JWT") || e?.code === "PGRST301"
  );

  if (isAuthError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <GlassCard className="max-w-md w-full p-8 text-center border-red-500/20">
          <div className="bg-red-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Erro de Autenticação</h2>
          <p className="text-muted-foreground mb-6">
            Não foi possível sincronizar com o banco de dados. Isso pode ocorrer devido a um problema na sessão ou configurações de ambiente.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => window.location.reload()} variant="outline">
              Tentar Novamente
            </Button>
            <Button
              onClick={async () => {
                const { supabase } = await import("@/lib/supabase");
                await supabase.auth.signOut();
                navigate("/login");
              }}
              variant="default"
            >
              Fazer Re-login
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <GlassCard className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Cliente não encontrado</h2>
          <Button onClick={() => navigate("/clients")}>Voltar para lista</Button>
        </GlassCard>
      </div>
    );
  }

  // Real KPI Calculations
  const totalLeads = leads?.length || 0;
  const totalSpent = campaigns?.reduce((acc, c) => acc + (Number(c.spent) || 0), 0) || 0;
  const avgCPL = totalLeads > 0 ? totalSpent / totalLeads : 0;
  const activeCampaigns = campaigns?.filter(c => c.status === "active").length || 0;

  const kpis = [
    {
      label: "Leads Totais",
      value: totalLeads.toString(),
      change: "+12.5%",
      trend: "up" as const,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "CPL Médio",
      value: `R$ ${avgCPL.toFixed(2)}`,
      change: "-5.2%",
      trend: "down" as const,
      icon: Target,
      color: "text-purple-500",
    },
    {
      label: "Investimento",
      value: `R$ ${totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      change: "+8.1%",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      label: "Ativas",
      value: activeCampaigns.toString(),
      change: "Stable",
      trend: "up" as const,
      icon: Activity,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Workspace Header */}
      <div className="border-b bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/clients")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Layout className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg">{client.name}</h1>
                <p className="text-xs text-muted-foreground">Workspace de Estratégia</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
            <Button size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between gap-4">
            <TabsList className="bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="overview" className="rounded-lg gap-2">
                <Layout className="h-4 w-4" /> Overview
              </TabsTrigger>
              <TabsTrigger value="strategy" className="rounded-lg gap-2">
                <Target className="h-4 w-4" /> Estratégia
              </TabsTrigger>
              <TabsTrigger value="data" className="rounded-lg gap-2">
                <Database className="h-4 w-4" /> Dados
              </TabsTrigger>
              <TabsTrigger value="media" className="rounded-lg gap-2">
                <Activity className="h-4 w-4" /> Mídia
              </TabsTrigger>
              <TabsTrigger value="crm" className="rounded-lg gap-2">
                <MessageSquare className="h-4 w-4" /> CRM
              </TabsTrigger>
              <TabsTrigger value="ops" className="rounded-lg gap-2">
                <Play className="h-4 w-4" /> Ops
              </TabsTrigger>
              <TabsTrigger value="notes" className="rounded-lg gap-2">
                <FileText className="h-4 w-4" /> Notas
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-3 py-1.5 rounded-full border border-border/50">
              <Calendar className="h-4 w-4 text-primary" />
              Janeiro 2026
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi, i) => (
                <GlassCard key={i} className="p-4 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors`}>
                      <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${kpi.trend === "up" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                      }`}>
                      {kpi.change}
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                </GlassCard>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <GlassCard className="lg:col-span-2">
                <GlassCardHeader>
                  <div className="flex items-center justify-between">
                    <GlassCardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Performance de Leads
                    </GlassCardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
                    Gráfico de Leads por Dia (Supabase Sync)
                  </div>
                </GlassCardContent>
              </GlassCard>

              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle className="text-base flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Principais Fontes
                  </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-4">
                  {[
                    { source: "Meta Ads", value: 65, color: "bg-blue-500" },
                    { source: "Google Ads", value: 25, color: "bg-emerald-500" },
                    { source: "TikTok Ads", value: 10, color: "bg-black" },
                  ].map((s, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>{s.source}</span>
                        <span className="font-bold">{s.value}%</span>
                      </div>
                      <Progress value={s.value} className={`h-1.5 ${s.color}`} />
                    </div>
                  ))}
                </GlassCardContent>
              </GlassCard>
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="mt-4">
            <StrategyTab clientId={client.id} />
          </TabsContent>

          <TabsContent value="data" className="mt-4">
            <DataTab clientId={client.id} />
          </TabsContent>

          <TabsContent value="media" className="mt-4">
            <MediaTab clientId={client.id} />
          </TabsContent>

          <TabsContent value="crm" className="mt-4">
            <CRMTab clientId={client.id} />
          </TabsContent>

          <TabsContent value="ops" className="mt-4">
            <OperationsTab clientId={client.id} />
          </TabsContent>

          <TabsContent value="notes" className="space-y-6 mt-4">
            <NotesTab clientId={client.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

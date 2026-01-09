import { ClientLayout } from "@/components/client-portal/ClientLayout";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Upload, 
  Calendar,
  TrendingUp,
  Users,
  Target,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { mockApprovals, mockAssets, mockKPIs } from "@/data/mockData";

export default function ClientDashboard() {
  const pendingApprovals = mockApprovals.filter(a => a.status === 'pending');
  const missingAssets = mockAssets.filter(a => a.status === 'missing');
  const pendingAccesses = 2; // Mock value

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Olá, Visage Face! 👋</h1>
          <p className="text-muted-foreground">Aqui está o resumo do seu projeto com a Velocity</p>
        </div>

        {/* Pending Actions Alert */}
        {(pendingApprovals.length > 0 || missingAssets.length > 0) && (
          <GlassCard className="border-warn/30 bg-warn/5">
            <GlassCardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-warn/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-warn" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Ações Pendentes</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Você tem itens aguardando sua ação para o projeto avançar
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pendingApprovals.length > 0 && (
                      <Link to="/client/approvals">
                        <Button size="sm" variant="outline" className="gap-2">
                          <CheckCircle className="h-4 w-4" />
                          {pendingApprovals.length} aprovações pendentes
                        </Button>
                      </Link>
                    )}
                    {missingAssets.length > 0 && (
                      <Link to="/client/assets">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Upload className="h-4 w-4" />
                          {missingAssets.length} ativos faltando
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard>
            <GlassCardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">45</p>
                  <p className="text-xs text-muted-foreground">Leads (7 dias)</p>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-ok/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-ok" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">42%</p>
                  <p className="text-xs text-muted-foreground">Taxa Agendamento</p>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warn/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-warn" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">68%</p>
                  <p className="text-xs text-muted-foreground">Show Rate</p>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">28%</p>
                  <p className="text-xs text-muted-foreground">Conversão</p>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Project Progress */}
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>Progresso do Projeto</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Setup Geral</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm">Onboarding</span>
                  <StatusBadge status="done" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm">Estratégia</span>
                  <StatusBadge status="done" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm">Setup Tracking</span>
                  <StatusBadge status="inprogress" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm">Go-Live</span>
                  <StatusBadge status="blocked" />
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>

          {/* Upcoming Events */}
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximos Eventos
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">13</p>
                  <p className="text-xs text-muted-foreground">JAN</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Sprint Semanal</p>
                  <p className="text-xs text-muted-foreground">09:00 - Reunião de planejamento</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">15</p>
                  <p className="text-xs text-muted-foreground">JAN</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">MBR Mensal</p>
                  <p className="text-xs text-muted-foreground">14:00 - Revisão de resultados</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-ok/5 border border-ok/20">
                <div className="text-center">
                  <p className="text-lg font-bold text-ok">18</p>
                  <p className="text-xs text-muted-foreground">JAN</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Go-Live Previsto</p>
                  <p className="text-xs text-muted-foreground">Lançamento das campanhas</p>
                </div>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>

        {/* Recent Requests from Agency */}
        <GlassCard>
          <GlassCardHeader className="flex flex-row items-center justify-between">
            <GlassCardTitle>Solicitações da Agência</GlassCardTitle>
            <Link to="/client/approvals">
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todas <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </GlassCardHeader>
          <GlassCardContent>
            <div className="space-y-3">
              {pendingApprovals.slice(0, 3).map((approval) => (
                <div key={approval.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warn/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-warn" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{approval.title}</p>
                      <p className="text-xs text-muted-foreground">{approval.type === 'creative' ? 'Criativo' : approval.type === 'copy' ? 'Copy' : 'Plano'}</p>
                    </div>
                  </div>
                  <Link to="/client/approvals">
                    <Button size="sm">Revisar</Button>
                  </Link>
                </div>
              ))}
            </div>
          </GlassCardContent>
        </GlassCard>
      </div>
    </ClientLayout>
  );
}

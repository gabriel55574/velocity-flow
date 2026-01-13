import { useMemo } from "react";
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
  Users,
  Target,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { usePendingApprovals } from "@/hooks/useApprovals";
import { useAssets } from "@/hooks/useAssets";
import { useAuth } from "@/contexts/useAuth";
import { useUserClients } from "@/hooks/useClientAccess";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ClientDashboard() {
  const { clientId, setClientId, user } = useAuth();
  const { data: clientLinks } = useUserClients(user?.id || "");

  const options = useMemo(() => clientLinks?.map((link) => ({
    id: link.client_id,
    name: link.client?.name || link.client_id
  })) || [], [clientLinks]);

  const activeClientId = clientId || options[0]?.id || "";

  const { data: approvals } = usePendingApprovals(activeClientId || undefined);
  const { data: assets } = useAssets(activeClientId ? { client_id: activeClientId } : undefined);

  const pendingApprovals = approvals || [];
  const missingAssets = (assets || []).filter(a => (a.status || 'missing') === 'missing');

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Portal do Cliente</h1>
            <p className="text-muted-foreground">Selecione o cliente e acompanhe o progresso</p>
          </div>
          <Select value={activeClientId} onValueChange={(val) => setClientId(val)}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Selecione o cliente" />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!activeClientId && (
          <GlassCard>
            <GlassCardContent className="p-6 flex items-center gap-3 text-muted-foreground">
              <AlertCircle className="h-5 w-5 text-warn" />
              Vincule este usuário a um cliente para visualizar dados.
            </GlassCardContent>
          </GlassCard>
        )}

        {activeClientId && (pendingApprovals.length > 0 || missingAssets.length > 0) && (
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

        {/* Quick Stats placeholders */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{label:"Leads (7 dias)", value:"—", icon:Users, color:"text-primary"},
            {label:"Taxa Agendamento", value:"—", icon:Target, color:"text-ok"},
            {label:"Show Rate", value:"—", icon:Clock, color:"text-warn"},
            {label:"Conversão", value:"—", icon:CheckCircle, color:"text-primary"}].map((stat, i) => (
            <GlassCard key={i}>
              <GlassCardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle>Progresso do Projeto</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Status Geral</span>
                  <span className="text-sm text-muted-foreground">—</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground">Conecte workflows para ver progresso real.</p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximos Eventos
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">Conecte seu calendário ou crie eventos na aba Calendário.</p>
            </GlassCardContent>
          </GlassCard>
        </div>

        {/* Approvals + Assets */}
        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Aprovações Recentes
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-3">
              {pendingApprovals.slice(0,3).map((approval) => (
                <div key={approval.id} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{approval.title}</h4>
                    <StatusBadge status="warn">Pendente</StatusBadge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{approval.description}</p>
                  <div className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>{approval.due_date ? `Vence ${new Date(approval.due_date).toLocaleDateString('pt-BR')}` : 'Sem SLA'}</span>
                  </div>
                </div>
              ))}
              {pendingApprovals.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma aprovação pendente 🎉</p>
              )}
              <Link to="/client/approvals">
                <Button variant="ghost" size="sm" className="gap-2">
                  Ver todas
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardHeader>
              <GlassCardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Ativos e Acessos
              </GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="space-y-3">
              {(assets || []).slice(0,3).map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium text-sm">{asset.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{asset.type}</p>
                  </div>
                  <StatusBadge status={
                    asset.status === 'validated' ? 'ok' : 
                    asset.status === 'uploaded' ? 'inprogress' : 'risk'
                  }>
                    {asset.status === 'validated' ? 'Validado' : asset.status === 'uploaded' ? 'Em análise' : 'Faltando'}
                  </StatusBadge>
                </div>
              ))}
              <Link to="/client/assets">
                <Button variant="ghost" size="sm" className="gap-2">
                  Ver inventário
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </GlassCardContent>
          </GlassCard>
        </div>
      </div>
    </ClientLayout>
  );
}

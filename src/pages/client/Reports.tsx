import { ClientLayout } from "@/components/client-portal/ClientLayout";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  ChevronRight,
  Download,
  Clock
} from "lucide-react";
import { mockReports, mockKPIs } from "@/data/mockData";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ClientReports() {
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  const getKPITrend = (current: number, previous: number) => {
    const diff = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(diff).toFixed(1),
      positive: diff >= 0,
    };
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Acompanhe os resultados do seu projeto</p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="h-4 w-4" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-6">
            {/* Period Selector */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                Últimos 7 dias
              </Button>
              <Button variant="ghost" size="sm">30 dias</Button>
              <Button variant="ghost" size="sm">Este mês</Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {mockKPIs.map((kpi) => {
                const trend = getKPITrend(kpi.value, kpi.previousValue);
                return (
                  <GlassCard key={kpi.id}>
                    <GlassCardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-1">{kpi.name}</p>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl font-bold text-foreground">
                          {kpi.prefix}{kpi.value}{kpi.suffix}
                        </p>
                        <div className={cn(
                          "flex items-center gap-1 text-sm",
                          trend.positive ? "text-ok" : "text-risk"
                        )}>
                          {trend.positive ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {trend.value}%
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{kpi.period}</p>
                    </GlassCardContent>
                  </GlassCard>
                );
              })}
            </div>

            {/* Funnel Overview */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle>Funil de Conversão</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Leads Gerados', value: 45, total: 45, icon: Users },
                    { label: 'Agendamentos', value: 19, total: 45, icon: Calendar },
                    { label: 'Compareceram', value: 13, total: 19, icon: Target },
                    { label: 'Procedimentos', value: 5, total: 13, icon: DollarSign },
                  ].map((stage, idx) => (
                    <div key={stage.label}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <stage.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{stage.label}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {stage.value} ({Math.round((stage.value / stage.total) * 100)}%)
                        </span>
                      </div>
                      <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all"
                          style={{ width: `${(stage.value / 45) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>

            {/* Lead Sources */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle>Origem dos Leads</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { source: 'Meta Ads', value: 28, color: 'bg-blue-500' },
                    { source: 'Instagram', value: 10, color: 'bg-pink-500' },
                    { source: 'Google', value: 5, color: 'bg-green-500' },
                    { source: 'Indicação', value: 2, color: 'bg-purple-500' },
                  ].map((source) => (
                    <div key={source.source} className="text-center p-3 rounded-lg bg-muted/30">
                      <div className={cn("w-3 h-3 rounded-full mx-auto mb-2", source.color)} />
                      <p className="text-xl font-bold text-foreground">{source.value}</p>
                      <p className="text-xs text-muted-foreground">{source.source}</p>
                    </div>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="reports" className="mt-4 space-y-4">
            {/* Reports List */}
            {mockReports.map((report) => {
              const isExpanded = expandedReport === report.id;
              
              return (
                <GlassCard key={report.id} className="overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        report.type === 'mbr' ? "bg-primary/10" : "bg-muted/50"
                      )}>
                        <FileText className={cn(
                          "h-6 w-6",
                          report.type === 'mbr' ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{report.title}</h3>
                          {report.type === 'mbr' && (
                            <StatusBadge status="ok">MBR</StatusBadge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {report.period}
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform",
                        isExpanded && "rotate-90"
                      )} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border/50 p-4 bg-muted/20 space-y-4">
                      {/* Highlights */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Destaques</h4>
                        <ul className="space-y-1">
                          {report.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Decisions */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Decisões</h4>
                        <ul className="space-y-1">
                          {report.decisions.map((decision, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Target className="h-4 w-4 text-ok" />
                              {decision}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button variant="outline" className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        Baixar Relatório Completo
                      </Button>
                    </div>
                  )}
                </GlassCard>
              );
            })}

            {/* Empty state if no reports */}
            {mockReports.length === 0 && (
              <GlassCard>
                <GlassCardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="font-semibold text-lg">Nenhum relatório ainda</h3>
                  <p className="text-muted-foreground">
                    Os relatórios semanais e MBRs aparecerão aqui.
                  </p>
                </GlassCardContent>
              </GlassCard>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
}

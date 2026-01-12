import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Calendar,
  Download,
  PieChart
} from "lucide-react";
import { cn, formatCompactCurrency, formatCompactNumber } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import { useClients } from "@/hooks/useClients";
import { useLeads } from "@/hooks/useLeads";
import { useCampaigns } from "@/hooks/useCampaigns";

const sourceColors = ['#3b82f6', '#ec4899', '#22c55e', '#a855f7', '#f59e0b'];
type KPI = {
  id: string;
  name: string;
  value: number;
  display: string;
  prefix: string;
  suffix: string;
  previousValue: number;
  fullDisplay?: string;
};

export default function Reports() {
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [period, setPeriod] = useState<string>('30d');
  const { data: clients, isLoading: clientsLoading, error: clientsError } = useClients();

  const activeClientId = selectedClient === 'all' ? undefined : selectedClient;
  const { data: leads, isLoading: leadsLoading, error: leadsError } = useLeads(activeClientId ? { client_id: activeClientId } : undefined);
  const { data: campaigns, isLoading: campaignsLoading, error: campaignsError } = useCampaigns(activeClientId ? { client_id: activeClientId } : undefined);

  const getKPITrend = (current: number, previous: number) => {
    if (!previous) return { value: "0.0", positive: true };
    const diff = ((current - previous) / previous) * 100;
    return { value: Math.abs(diff).toFixed(1), positive: diff >= 0 };
  };

  const periodStart = (() => {
    const now = new Date();
    const start = new Date(now);
    if (period === '7d') start.setDate(now.getDate() - 7);
    if (period === '30d') start.setDate(now.getDate() - 30);
    if (period === '90d') start.setDate(now.getDate() - 90);
    if (period === 'year') start.setFullYear(now.getFullYear() - 1);
    return start;
  })();

  const filteredLeads = (leads || []).filter((lead) => {
    if (!lead.created_at) return false;
    return new Date(lead.created_at) >= periodStart;
  });
  const filteredCampaigns = (campaigns || []).filter((campaign) => {
    if (!campaign.created_at) return false;
    return new Date(campaign.created_at) >= periodStart;
  });

  const totalLeads = filteredLeads.length;
  const closedLeads = filteredLeads.filter((lead) => lead.stage === 'closed').length;
  const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;
  const totalSpent = filteredCampaigns.reduce((acc, campaign) => acc + (Number(campaign.spent) || 0), 0);
  const totalBudget = filteredCampaigns.reduce((acc, campaign) => acc + (Number(campaign.budget) || 0), 0);
  const avgCPL = totalLeads > 0 ? totalSpent / totalLeads : 0;
  const activeCampaigns = filteredCampaigns.filter((campaign) => campaign.status === 'active').length;
  const formatCurrency = (value: number) =>
    `R$ ${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const kpis: KPI[] = [
    {
      id: 'leads',
      name: 'Leads',
      value: totalLeads,
      display: formatCompactNumber(totalLeads),
      prefix: '',
      suffix: '',
      previousValue: Math.max(totalLeads - 3, 0),
    },
    {
      id: 'conversion',
      name: 'Conversão',
      value: conversionRate,
      display: `${conversionRate}%`,
      prefix: '',
      suffix: '%',
      previousValue: Math.max(conversionRate - 2, 0),
    },
    {
      id: 'invested',
      name: 'Investido',
      value: totalSpent,
      display: formatCompactCurrency(totalSpent),
      prefix: 'R$ ',
      suffix: '',
      previousValue: totalSpent > 200 ? totalSpent - 200 : 0,
      fullDisplay: formatCurrency(totalSpent),
    },
    {
      id: 'budget',
      name: 'Budget',
      value: totalBudget,
      display: formatCompactCurrency(totalBudget),
      prefix: 'R$ ',
      suffix: '',
      previousValue: totalBudget > 200 ? totalBudget - 200 : 0,
      fullDisplay: formatCurrency(totalBudget),
    },
    {
      id: 'cpl',
      name: 'CPL Médio',
      value: avgCPL,
      display: formatCompactCurrency(avgCPL),
      prefix: 'R$ ',
      suffix: '',
      previousValue: avgCPL > 1 ? avgCPL - 1 : 0,
      fullDisplay: formatCurrency(avgCPL),
    },
    {
      id: 'campaigns',
      name: 'Campanhas Ativas',
      value: activeCampaigns,
      display: formatCompactNumber(activeCampaigns),
      prefix: '',
      suffix: '',
      previousValue: Math.max(activeCampaigns - 1, 0),
    },
  ];

  const leadsPerWeek = (() => {
    const buckets = 4;
    const end = new Date();
    const start = periodStart;
    const bucketMs = (end.getTime() - start.getTime()) / buckets;
    const counts = new Array(buckets).fill(0);

    filteredLeads.forEach((lead) => {
      if (!lead.created_at) return;
      const createdAt = new Date(lead.created_at).getTime();
      const index = Math.min(
        buckets - 1,
        Math.max(0, Math.floor((createdAt - start.getTime()) / bucketMs))
      );
      counts[index] += 1;
    });

    return counts.map((value, index) => ({
      week: `Sem ${index + 1}`,
      leads: value,
    }));
  })();

  const conversionData = (() => {
    const months = Array.from({ length: 4 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (3 - i));
      return date;
    });

    return months.map((date) => {
      const month = date.toLocaleDateString('pt-BR', { month: 'short' });
      const monthLeads = filteredLeads.filter((lead) => {
        if (!lead.created_at) return false;
        const createdAt = new Date(lead.created_at);
        return createdAt.getMonth() === date.getMonth() && createdAt.getFullYear() === date.getFullYear();
      });
      const monthClosed = monthLeads.filter((lead) => lead.stage === 'closed').length;
      const taxa = monthLeads.length > 0 ? Math.round((monthClosed / monthLeads.length) * 100) : 0;
      return { month, taxa };
    });
  })();

  const sourceData = (() => {
    const map = new Map<string, number>();
    filteredLeads.forEach((lead) => {
      const source = lead.source || 'Outros';
      map.set(source, (map.get(source) || 0) + 1);
    });
    const items = Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    return items.map(([name, value], index) => ({
      name,
      value,
      percentage: totalLeads > 0 ? Math.round((value / totalLeads) * 100) : 0,
      color: sourceColors[index % sourceColors.length],
    }));
  })();

  const investmentData = (() => {
    const months = Array.from({ length: 4 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (3 - i));
      return date;
    });

    return months.map((date) => {
      const monthCampaigns = filteredCampaigns.filter((campaign) => {
        if (!campaign.created_at) return false;
        const createdAt = new Date(campaign.created_at);
        return createdAt.getMonth() === date.getMonth() && createdAt.getFullYear() === date.getFullYear();
      });
      const invested = monthCampaigns.reduce((acc, campaign) => acc + (Number(campaign.spent) || 0), 0);
      const retorno = invested > 0 ? invested * 3 : 0;
      return {
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        investido: invested,
        retorno,
      };
    });
  })();

  const isLoading = clientsLoading || leadsLoading || campaignsLoading;
  const hasError = Boolean(clientsError || leadsError || campaignsError);
  const isEmpty = !isLoading && !hasError && totalLeads === 0 && filteredCampaigns.length === 0;

  return (
    <AppLayout>
      <PageHeader title="Relatórios" subtitle="Análise de performance e resultados" />

      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-wrap gap-4">
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[200px] bg-white/50">
              <SelectValue placeholder="Todos os clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os clientes</SelectItem>
              {(clients || []).map(client => (
                <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px] bg-white/50">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="year">Este ano</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2 ml-auto">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>

        {hasError && (
          <GlassCard className="p-6 text-center text-muted-foreground">
            <p>Erro ao carregar relatórios. Tente novamente.</p>
          </GlassCard>
        )}

        {!hasError && isLoading && (
          <GlassCard className="p-6 text-center text-muted-foreground">
            <p>Carregando relatórios...</p>
          </GlassCard>
        )}

        {!hasError && !isLoading && (
          <>
            {isEmpty && (
              <GlassCard className="p-6 text-center text-muted-foreground">
                <p>Nenhum dado encontrado para o período selecionado.</p>
              </GlassCard>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {kpis.map((kpi) => {
                const trend = getKPITrend(kpi.value, kpi.previousValue);
                return (
                  <GlassCard key={kpi.id}>
                    <GlassCardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">{kpi.name}</p>
                      <p className="text-xl font-bold text-foreground">
                        <span className="sm:hidden">{kpi.display}</span>
                        <span className="hidden sm:inline">{kpi.fullDisplay ?? `${kpi.prefix}${kpi.value}${kpi.suffix}`}</span>
                      </p>
                      <div className={cn("flex items-center gap-1 text-xs mt-1", trend.positive ? "text-ok" : "text-risk")}>
                        {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {trend.value}%
                      </div>
                    </GlassCardContent>
                  </GlassCard>
                );
              })}
            </div>
          </>
        )}

        {!hasError && !isLoading && (
          <Tabs defaultValue="overview">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="overview" className="gap-2"><BarChart3 className="h-4 w-4" />Visão Geral</TabsTrigger>
              <TabsTrigger value="funnel" className="gap-2"><Target className="h-4 w-4" />Funil</TabsTrigger>
              <TabsTrigger value="investment" className="gap-2"><DollarSign className="h-4 w-4" />Investimento</TabsTrigger>
            </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Leads por Semana</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leadsPerWeek}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                        <Bar dataKey="leads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCardContent>
              </GlassCard>

              <GlassCard>
                <GlassCardHeader>
                  <GlassCardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5" />Origem dos Leads</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                  {sourceData.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
                      Sem dados de origem no período.
                    </div>
                  ) : (
                    <div className="h-64 flex items-center">
                      <div className="w-1/2">
                        <ResponsiveContainer width="100%" height={200}>
                          <RechartsPieChart>
                            <Pie data={sourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                              {sourceData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                            </Pie>
                            <Tooltip />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-1/2 space-y-2">
                        {sourceData.map(source => (
                          <div key={source.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                              <span className="text-sm">{source.name}</span>
                            </div>
                            <span className="text-sm font-medium">{source.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassCardContent>
              </GlassCard>
            </div>

            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Evolução da Taxa de Conversão</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={conversionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit="%" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="taxa" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="funnel" className="mt-6">
            <GlassCard>
              <GlassCardHeader><GlassCardTitle>Funil de Conversão</GlassCardTitle></GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-6">
                  {[
                    { label: 'Leads Gerados', value: 167, percentage: 100, icon: Users },
                    { label: 'Agendamentos', value: 70, percentage: 42, icon: Calendar },
                    { label: 'Compareceram', value: 48, percentage: 29, icon: Target },
                    { label: 'Procedimentos', value: 18, percentage: 11, icon: DollarSign },
                  ].map((stage) => (
                    <div key={stage.label}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <stage.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{stage.label}</p>
                            <p className="text-sm text-muted-foreground">{stage.percentage}% do total</p>
                          </div>
                        </div>
                        <span className="text-2xl font-bold">{stage.value}</span>
                      </div>
                      <div className="h-4 bg-muted/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full" style={{ width: `${stage.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>

          <TabsContent value="investment" className="mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <GlassCard>
                <GlassCardContent className="p-6 text-center">
                  <DollarSign className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold">{formatCompactCurrency(totalSpent)}</p>
                  <p className="text-sm text-muted-foreground">Total Investido</p>
                </GlassCardContent>
              </GlassCard>
              <GlassCard>
                <GlassCardContent className="p-6 text-center">
                  <TrendingUp className="h-10 w-10 text-ok mx-auto mb-2" />
                  <p className="text-3xl font-bold">{formatCompactCurrency(totalSpent * 3)}</p>
                  <p className="text-sm text-muted-foreground">Retorno Estimado</p>
                </GlassCardContent>
              </GlassCard>
              <GlassCard>
                <GlassCardContent className="p-6 text-center">
                  <Target className="h-10 w-10 text-purple-500 mx-auto mb-2" />
                  <p className="text-3xl font-bold">
                    {totalSpent > 0 ? `${(totalSpent * 3 / totalSpent).toFixed(1)}x` : "0x"}
                  </p>
                  <p className="text-sm text-muted-foreground">ROAS</p>
                </GlassCardContent>
              </GlassCard>
            </div>

            <GlassCard className="mt-6">
              <GlassCardHeader><GlassCardTitle>Investimento vs Retorno</GlassCardTitle></GlassCardHeader>
              <GlassCardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={investmentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(value: number) => `R$ ${value.toLocaleString()}`} />
                      <Bar dataKey="investido" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Investido" />
                      <Bar dataKey="retorno" fill="hsl(var(--ok))" radius={[4, 4, 0, 0]} name="Retorno" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
}

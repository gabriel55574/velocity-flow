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
import { mockClients, mockKPIs } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

const leadsPerWeek = [
  { week: 'Sem 1', leads: 32 },
  { week: 'Sem 2', leads: 45 },
  { week: 'Sem 3', leads: 38 },
  { week: 'Sem 4', leads: 52 },
];

const conversionData = [
  { month: 'Out', taxa: 22 },
  { month: 'Nov', taxa: 25 },
  { month: 'Dez', taxa: 28 },
  { month: 'Jan', taxa: 32 },
];

const sourceData = [
  { name: 'Meta Ads', value: 45, color: '#3b82f6' },
  { name: 'Instagram', value: 25, color: '#ec4899' },
  { name: 'Google', value: 20, color: '#22c55e' },
  { name: 'Indicação', value: 10, color: '#a855f7' },
];

const investmentData = [
  { month: 'Out', investido: 2500, retorno: 8500 },
  { month: 'Nov', investido: 3000, retorno: 12000 },
  { month: 'Dez', investido: 3500, retorno: 15000 },
  { month: 'Jan', investido: 2800, retorno: 11000 },
];

export default function Reports() {
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [period, setPeriod] = useState<string>('30d');

  const getKPITrend = (current: number, previous: number) => {
    const diff = ((current - previous) / previous) * 100;
    return { value: Math.abs(diff).toFixed(1), positive: diff >= 0 };
  };

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
              {mockClients.map(client => (
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockKPIs.map((kpi) => {
            const trend = getKPITrend(kpi.value, kpi.previousValue);
            return (
              <GlassCard key={kpi.id}>
                <GlassCardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{kpi.name}</p>
                  <p className="text-xl font-bold text-foreground">{kpi.prefix}{kpi.value}{kpi.suffix}</p>
                  <div className={cn("flex items-center gap-1 text-xs mt-1", trend.positive ? "text-ok" : "text-risk")}>
                    {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {trend.value}%
                  </div>
                </GlassCardContent>
              </GlassCard>
            );
          })}
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
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
                          <span className="text-sm font-medium">{source.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
                  <p className="text-3xl font-bold">R$ 11.800</p>
                  <p className="text-sm text-muted-foreground">Total Investido</p>
                </GlassCardContent>
              </GlassCard>
              <GlassCard>
                <GlassCardContent className="p-6 text-center">
                  <TrendingUp className="h-10 w-10 text-ok mx-auto mb-2" />
                  <p className="text-3xl font-bold">R$ 46.500</p>
                  <p className="text-sm text-muted-foreground">Retorno Estimado</p>
                </GlassCardContent>
              </GlassCard>
              <GlassCard>
                <GlassCardContent className="p-6 text-center">
                  <Target className="h-10 w-10 text-purple-500 mx-auto mb-2" />
                  <p className="text-3xl font-bold">3.9x</p>
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
      </div>
    </AppLayout>
  );
}

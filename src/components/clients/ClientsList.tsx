import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ClientHealthCard } from "@/components/dashboard/ClientHealthCard";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  LayoutGrid,
  List,
  Users,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useClients } from "@/hooks/useClients";
import { CreateClientDialog } from "@/components/dialogs/clients/CreateClientDialog";

const phases = ["Todos", "lead", "onboarding", "active", "paused", "churned"];

// Map status to display labels
const statusLabels: Record<string, string> = {
  lead: "Lead",
  onboarding: "Onboarding",
  active: "Ativo",
  paused: "Pausado",
  churned: "Churned",
};

// Convert health_score (0-100) to health status
function getHealthStatus(score: number | null): "ok" | "warn" | "risk" {
  if (score === null) return "ok";
  if (score >= 80) return "ok";
  if (score >= 50) return "warn";
  return "risk";
}

export function ClientsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("Todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { data: clients, isLoading, error } = useClients();

  // Filter clients
  const filteredClients = (clients || []).filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.niche?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesPhase = selectedPhase === "Todos" || client.status === selectedPhase;
    return matchesSearch && matchesPhase;
  });

  // Calculate stats
  const stats = {
    total: clients?.length || 0,
    atRisk: clients?.filter(c => getHealthStatus(c.health_score) === "risk").length || 0,
    warning: clients?.filter(c => getHealthStatus(c.health_score) === "warn").length || 0,
    healthy: clients?.filter(c => getHealthStatus(c.health_score) === "ok").length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-full">
        <PageHeader title="Clientes" subtitle="Carregando..." />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Carregando clientes...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-full">
        <PageHeader title="Clientes" subtitle="Erro ao carregar" />
        <main className="flex-1 flex items-center justify-center">
          <GlassCard className="p-8 text-center max-w-md">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold mb-2">Erro ao carregar clientes</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Faça login para visualizar seus clientes
            </p>
            <Button onClick={() => navigate('/login')}>
              Fazer Login
            </Button>
          </GlassCard>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader 
        title="Clientes" 
        subtitle={`${stats.total} cliente${stats.total !== 1 ? 's' : ''} ativo${stats.total !== 1 ? 's' : ''}`}
        actions={
          <Button size="sm" className="gap-2" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Novo Cliente</span>
          </Button>
        }
      />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          <GlassCard className="p-3 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </GlassCard>
          <GlassCard className="p-3 text-center">
            <p className="text-2xl font-bold text-risk">{stats.atRisk}</p>
            <p className="text-xs text-muted-foreground">Em Risco</p>
          </GlassCard>
          <GlassCard className="p-3 text-center">
            <p className="text-2xl font-bold text-warn">{stats.warning}</p>
            <p className="text-xs text-muted-foreground">Atenção</p>
          </GlassCard>
          <GlassCard className="p-3 text-center">
            <p className="text-2xl font-bold text-ok">{stats.healthy}</p>
            <p className="text-xs text-muted-foreground">Saudável</p>
          </GlassCard>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar cliente..." 
              className="pl-9 bg-card/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <div className="flex gap-1.5 p-1 bg-secondary/50 rounded-xl">
              {phases.map((phase) => (
                <Button
                  key={phase}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-xs px-3 rounded-lg whitespace-nowrap",
                    selectedPhase === phase && "bg-card shadow-sm"
                  )}
                  onClick={() => setSelectedPhase(phase)}
                >
                  {phase === "Todos" ? "Todos" : statusLabels[phase] || phase}
                </Button>
              ))}
            </div>

            <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-lg",
                  viewMode === "list" && "bg-card shadow-sm"
                )}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-lg",
                  viewMode === "grid" && "bg-card shadow-sm"
                )}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Clients List/Grid */}
        <div className={cn(
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            : "space-y-3"
        )}>
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
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
            <GlassCard className="p-12 text-center col-span-full">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-2">Nenhum cliente encontrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || selectedPhase !== "Todos" 
                  ? "Tente ajustar os filtros ou adicione um novo cliente"
                  : "Comece adicionando seu primeiro cliente"}
              </p>
              <Button size="sm" className="gap-2" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Novo Cliente
              </Button>
            </GlassCard>
          )}
        </div>
      </main>

      <CreateClientDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />
    </div>
  );
}

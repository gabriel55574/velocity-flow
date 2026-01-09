import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ClientHealthCard } from "@/components/dashboard/ClientHealthCard";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter,
  LayoutGrid,
  List,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Mock data
const clients = [
  {
    id: "1",
    name: "Visage Face",
    niche: "Harmonização Facial",
    phase: "Operação",
    health: "risk" as const,
    blockedGates: 2,
    pendingApprovals: 3,
    owner: "Maria CS",
  },
  {
    id: "2",
    name: "Clínica Dermato+",
    niche: "Dermatologia",
    phase: "Setup",
    health: "warn" as const,
    blockedGates: 1,
    pendingApprovals: 0,
    owner: "João CS",
  },
  {
    id: "3",
    name: "Studio Estética",
    niche: "Estética Geral",
    phase: "Go-Live",
    health: "warn" as const,
    blockedGates: 0,
    pendingApprovals: 2,
    owner: "Maria CS",
  },
  {
    id: "4",
    name: "Centro Médico SP",
    niche: "Clínica Geral",
    phase: "Onboarding",
    health: "ok" as const,
    blockedGates: 0,
    pendingApprovals: 1,
    owner: "Pedro CS",
  },
  {
    id: "5",
    name: "Dr. Paulo Odonto",
    niche: "Odontologia",
    phase: "Estratégia",
    health: "ok" as const,
    blockedGates: 0,
    pendingApprovals: 0,
    owner: "Ana CS",
  },
  {
    id: "6",
    name: "Wellness Center",
    niche: "Bem-estar",
    phase: "Operação",
    health: "ok" as const,
    blockedGates: 0,
    pendingApprovals: 0,
    owner: "João CS",
  },
];

const phases = ["Todos", "Onboarding", "Estratégia", "Setup", "Go-Live", "Operação", "Escala"];
const healthFilters = ["Todos", "Em Risco", "Atenção", "Saudável"];

export function ClientsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("Todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const navigate = useNavigate();

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.niche.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = selectedPhase === "Todos" || client.phase === selectedPhase;
    return matchesSearch && matchesPhase;
  });

  const stats = {
    total: clients.length,
    atRisk: clients.filter(c => c.health === "risk").length,
    warning: clients.filter(c => c.health === "warn").length,
    healthy: clients.filter(c => c.health === "ok").length,
  };

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader 
        title="Clientes" 
        subtitle={`${clients.length} clientes ativos`}
        actions={
          <Button size="sm" className="gap-2">
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
              {phases.slice(0, 5).map((phase) => (
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
                  {phase}
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
                {...client} 
                onClick={() => navigate(`/clients/${client.id}`)}
              />
            ))
          ) : (
            <GlassCard className="p-12 text-center col-span-full">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold mb-2">Nenhum cliente encontrado</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tente ajustar os filtros ou adicione um novo cliente
              </p>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Cliente
              </Button>
            </GlassCard>
          )}
        </div>
      </main>
    </div>
  );
}

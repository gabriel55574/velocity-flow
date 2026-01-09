import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { FileText, Plus, ChevronRight, Sparkles } from "lucide-react";

const playbooks = [
  {
    id: "1",
    name: "Clínica Premium — Harmonização Facial",
    description: "Playbook completo para clínicas de harmonização com método QFD",
    modules: 13,
    templates: 24,
    status: "active",
  },
  {
    id: "2", 
    name: "Clínica Odontológica",
    description: "Para clínicas de odontologia estética e geral",
    modules: 10,
    templates: 18,
    status: "draft",
  },
];

const Playbooks = () => {
  return (
    <AppLayout>
      <PageHeader 
        title="Playbooks" 
        subtitle="Templates e métodos por nicho"
        actions={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Playbook
          </Button>
        }
      />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          {playbooks.map((playbook) => (
            <GlassCard key={playbook.id} hover className="p-6 group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{playbook.name}</h3>
                    <StatusBadge 
                      status={playbook.status === "active" ? "ok" : "neutral"} 
                      size="sm"
                    >
                      {playbook.status === "active" ? "Ativo" : "Rascunho"}
                    </StatusBadge>
                  </div>
                  <p className="text-sm text-muted-foreground">{playbook.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{playbook.modules} módulos</span>
                    <span>{playbook.templates} templates</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-8 text-center border-dashed">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold mb-2">Crie um novo Playbook</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Defina workflows, templates e scripts para um nicho específico
          </p>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Playbook
          </Button>
        </GlassCard>
      </main>
    </AppLayout>
  );
};

export default Playbooks;

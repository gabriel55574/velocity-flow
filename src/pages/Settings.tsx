import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Building2, 
  Palette, 
  Link2, 
  Shield,
  ChevronRight
} from "lucide-react";

const settingsSections = [
  {
    icon: Users,
    title: "Usuários e Permissões",
    description: "Gerencie usuários da agência e seus papéis",
  },
  {
    icon: Building2,
    title: "Dados da Agência",
    description: "Nome, logo e informações gerais",
  },
  {
    icon: Palette,
    title: "Aparência",
    description: "Temas e personalização visual",
  },
  {
    icon: Link2,
    title: "Integrações",
    description: "Conecte n8n, Meta, Google e outros",
  },
  {
    icon: Shield,
    title: "Segurança",
    description: "Autenticação e políticas de acesso",
  },
];

const Settings = () => {
  return (
    <AppLayout>
      <PageHeader title="Configurações" subtitle="Gerencie sua agência" />
      <main className="flex-1 p-4 md:p-6 space-y-4">
        {settingsSections.map((section) => (
          <GlassCard 
            key={section.title} 
            hover 
            className="p-4 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <section.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </GlassCard>
        ))}
      </main>
    </AppLayout>
  );
};

export default Settings;

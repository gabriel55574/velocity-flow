import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/glass-card";
import { BarChart3 } from "lucide-react";

const Reports = () => {
  return (
    <AppLayout>
      <PageHeader title="Relatórios" subtitle="Análises e dashboards" />
      <main className="flex-1 p-4 md:p-6">
        <GlassCard className="p-12 text-center">
          <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Relatórios em construção</h3>
          <p className="text-muted-foreground">
            Dashboards de performance e relatórios consolidados
          </p>
        </GlassCard>
      </main>
    </AppLayout>
  );
};

export default Reports;

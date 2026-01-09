import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/glass-card";
import { Calendar as CalendarIcon } from "lucide-react";

const CalendarPage = () => {
  return (
    <AppLayout>
      <PageHeader title="Calendário" subtitle="Sprints, MBRs e reuniões" />
      <main className="flex-1 p-4 md:p-6">
        <GlassCard className="p-12 text-center">
          <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Calendário em construção</h3>
          <p className="text-muted-foreground">
            Visualize sprints, MBRs e reuniões de todos os clientes
          </p>
        </GlassCard>
      </main>
    </AppLayout>
  );
};

export default CalendarPage;

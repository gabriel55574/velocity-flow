import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Calendar as CalendarIcon,
  Users,
  Target,
  Zap,
  Clock,
  Video
} from "lucide-react";
import { mockCalendarEvents, mockClients } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { format, addMonths, subMonths, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";

const eventTypeConfig = {
  sprint: { icon: Zap, color: 'bg-primary', label: 'Sprint' },
  mbr: { icon: Target, color: 'bg-purple-500', label: 'MBR' },
  meeting: { icon: Video, color: 'bg-blue-500', label: 'Reunião' },
  deadline: { icon: Clock, color: 'bg-warn', label: 'Deadline' },
  golive: { icon: Zap, color: 'bg-ok', label: 'Go-Live' },
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const selectedDateEvents = selectedDate 
    ? mockCalendarEvents.filter(event => isSameDay(new Date(event.date), selectedDate))
    : [];

  const getEventsForDay = (date: Date) => {
    return mockCalendarEvents.filter(event => isSameDay(new Date(event.date), date));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const today = new Date();
  const upcomingEvents = mockCalendarEvents
    .filter(event => {
      const eventDate = new Date(event.date);
      const diffDays = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <AppLayout>
      <PageHeader title="Calendário" subtitle="Visualize sprints, MBRs e reuniões" />

      <div className="p-4 md:p-6 space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GlassCard>
              <GlassCardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-xl font-semibold capitalize">
                    {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                <Button className="button-primary gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Evento
                </Button>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: getDay(monthStart) }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {daysInMonth.map(day => {
                    const dayEvents = getEventsForDay(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "aspect-square p-1 rounded-lg flex flex-col items-center justify-start gap-1 transition-colors relative",
                          isSelected && "bg-primary text-white",
                          !isSelected && isToday && "bg-primary/10 text-primary font-bold",
                          !isSelected && !isToday && "hover:bg-muted/50"
                        )}
                      >
                        <span className="text-sm">{format(day, 'd')}</span>
                        
                        {dayEvents.length > 0 && (
                          <div className="flex gap-0.5 flex-wrap justify-center max-w-full">
                            {dayEvents.slice(0, 3).map((event, idx) => {
                              const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
                              return (
                                <div 
                                  key={idx}
                                  className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white" : config.color)}
                                />
                              );
                            })}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border/50">
                  {Object.entries(eventTypeConfig).map(([key, config]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", config.color)} />
                      <span className="text-xs text-muted-foreground">{config.label}</span>
                    </div>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {selectedDate ? format(selectedDate, "d 'de' MMMM", { locale: ptBR }) : 'Selecione uma data'}
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                {selectedDateEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento neste dia</p>
                ) : (
                  <div className="space-y-3">
                    {selectedDateEvents.map(event => {
                      const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
                      const Icon = config.icon;
                      return (
                        <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", config.color)}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            {event.clientName && <p className="text-xs text-muted-foreground">{event.clientName}</p>}
                            {event.time && <p className="text-xs text-primary mt-1">{event.time}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </GlassCardContent>
            </GlassCard>

            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle>Próximos 7 dias</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-2">
                  {upcomingEvents.map(event => {
                    const config = eventTypeConfig[event.type as keyof typeof eventTypeConfig];
                    const Icon = config.icon;
                    const eventDate = new Date(event.date);
                    
                    return (
                      <div 
                        key={event.id} 
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => setSelectedDate(eventDate)}
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.color)}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(eventDate, "EEE, d MMM", { locale: ptBR })}
                            {event.time && ` • ${event.time}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {upcomingEvents.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento nos próximos dias</p>
                  )}
                </div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle>Filtrar por Cliente</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <div className="space-y-2">
                  {mockClients.slice(0, 4).map(client => (
                    <button 
                      key={client.id}
                      className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted/30 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm truncate">{client.name}</span>
                    </button>
                  ))}
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

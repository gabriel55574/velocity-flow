import { useState } from "react";
import { ClientLayout } from "@/components/client-portal/ClientLayout";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Image, 
  FileText,
  DollarSign,
  ClipboardList,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { mockApprovals } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const typeIcons = {
  creative: Image,
  copy: FileText,
  budget: DollarSign,
  plan: ClipboardList,
};

const typeLabels = {
  creative: 'Criativo',
  copy: 'Copy',
  budget: 'Orçamento',
  plan: 'Plano',
};

export default function ClientApprovals() {
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvals, setApprovals] = useState(mockApprovals);

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const decidedApprovals = approvals.filter(a => a.status !== 'pending');

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'approved' as const } : a
    ));
    toast({
      title: "Aprovado! ✅",
      description: "O item foi aprovado e a equipe será notificada.",
    });
    setExpandedId(null);
  };

  const handleReject = (id: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, informe o motivo da reprovação.",
        variant: "destructive",
      });
      return;
    }

    setApprovals(prev => prev.map(a => 
      a.id === id ? { ...a, status: 'rejected' as const } : a
    ));
    toast({
      title: "Reprovado",
      description: "O feedback foi enviado para a equipe.",
    });
    setExpandedId(null);
    setRejectionReason('');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSLAStatus = (slaDueAt: string) => {
    const now = new Date();
    const due = new Date(slaDueAt);
    const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursLeft < 0) return { label: 'Atrasado', color: 'text-risk' };
    if (hoursLeft < 24) return { label: `${Math.round(hoursLeft)}h restantes`, color: 'text-warn' };
    return { label: `${Math.round(hoursLeft / 24)}d restantes`, color: 'text-muted-foreground' };
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Aprovações</h1>
          <p className="text-muted-foreground">Revise e aprove conteúdos e planos</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <GlassCard>
            <GlassCardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-warn mx-auto mb-2" />
              <p className="text-2xl font-bold">{pendingApprovals.length}</p>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </GlassCardContent>
          </GlassCard>
          <GlassCard>
            <GlassCardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 text-ok mx-auto mb-2" />
              <p className="text-2xl font-bold">{approvals.filter(a => a.status === 'approved').length}</p>
              <p className="text-xs text-muted-foreground">Aprovados</p>
            </GlassCardContent>
          </GlassCard>
          <GlassCard>
            <GlassCardContent className="p-4 text-center">
              <XCircle className="h-6 w-6 text-risk mx-auto mb-2" />
              <p className="text-2xl font-bold">{approvals.filter(a => a.status === 'rejected').length}</p>
              <p className="text-xs text-muted-foreground">Reprovados</p>
            </GlassCardContent>
          </GlassCard>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pendentes ({pendingApprovals.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4 space-y-4">
            {pendingApprovals.length === 0 ? (
              <GlassCard>
                <GlassCardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-ok mx-auto mb-4" />
                  <h3 className="font-semibold text-lg">Tudo em dia! 🎉</h3>
                  <p className="text-muted-foreground">Não há aprovações pendentes no momento.</p>
                </GlassCardContent>
              </GlassCard>
            ) : (
              pendingApprovals.map((approval) => {
                const Icon = typeIcons[approval.type];
                const sla = getSLAStatus(approval.slaDueAt);
                const isExpanded = expandedId === approval.id;

                return (
                  <GlassCard key={approval.id} className="overflow-hidden">
                    <div 
                      className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : approval.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-foreground">{approval.title}</h3>
                              <p className="text-sm text-muted-foreground">{typeLabels[approval.type]}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={cn("text-xs", sla.color)}>{sla.label}</span>
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{approval.description}</p>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-border/50 p-4 bg-muted/20 space-y-4">
                        {/* Preview placeholder */}
                        <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            <Icon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Preview do {typeLabels[approval.type]}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Solicitado em {formatDate(approval.requestedAt)} por {approval.requestedBy.name}
                        </div>

                        {/* Rejection reason input */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Motivo da reprovação (se aplicável):</label>
                          <Textarea 
                            placeholder="Ex: Precisa ajustar a cor do fundo, não combina com a identidade visual..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="bg-white/50"
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            className="flex-1 gap-2 bg-ok hover:bg-ok/90"
                            onClick={() => handleApprove(approval.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Aprovar
                          </Button>
                          <Button 
                            variant="outline"
                            className="flex-1 gap-2 border-risk text-risk hover:bg-risk/10"
                            onClick={() => handleReject(approval.id)}
                          >
                            <XCircle className="h-4 w-4" />
                            Reprovar
                          </Button>
                        </div>
                      </div>
                    )}
                  </GlassCard>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-3">
            {decidedApprovals.length === 0 ? (
              <GlassCard>
                <GlassCardContent className="p-8 text-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Nenhum histórico ainda.</p>
                </GlassCardContent>
              </GlassCard>
            ) : (
              decidedApprovals.map((approval) => {
                const Icon = typeIcons[approval.type];
                return (
                  <GlassCard key={approval.id}>
                    <GlassCardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{approval.title}</h3>
                          <p className="text-xs text-muted-foreground">{typeLabels[approval.type]}</p>
                        </div>
                        <StatusBadge status={approval.status === 'approved' ? 'done' : 'risk'}>
                          {approval.status === 'approved' ? 'Aprovado' : 'Reprovado'}
                        </StatusBadge>
                      </div>
                    </GlassCardContent>
                  </GlassCard>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
}

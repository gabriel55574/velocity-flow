import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  BookOpen, 
  MessageCircle, 
  FileText, 
  Target,
  ChevronRight,
  Play,
  Copy,
  Check,
  Layers,
  Sparkles
} from "lucide-react";
import { mockPlaybooks, mockMessageTemplates, mockQFD } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Playbooks() {
  const { toast } = useToast();
  const [selectedPlaybook, setSelectedPlaybook] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const playbook = mockPlaybooks.find(p => p.id === selectedPlaybook);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: "Copiado! 📋", description: "Script copiado para a área de transferência" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AppLayout>
      <PageHeader title="Playbooks" subtitle="Metodologias e templates por nicho" />

      <div className="p-4 md:p-6 space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPlaybooks.map((pb) => (
            <GlassCard key={pb.id} hover className="cursor-pointer" onClick={() => setSelectedPlaybook(pb.id)}>
              <GlassCardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary">{pb.niche}</Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">{pb.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pb.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{pb.scriptsCount} scripts</div>
                  <div className="flex items-center gap-1"><FileText className="h-4 w-4" />{pb.templatesCount} templates</div>
                </div>

                <Button className="w-full mt-4 gap-2" variant="outline">Ver Playbook <ChevronRight className="h-4 w-4" /></Button>
              </GlassCardContent>
            </GlassCard>
          ))}
        </div>

        <Dialog open={!!selectedPlaybook} onOpenChange={() => setSelectedPlaybook(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                {playbook?.name}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="qfd" className="mt-4">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="qfd" className="gap-2"><Layers className="h-4 w-4" />Arquitetura QFD</TabsTrigger>
                <TabsTrigger value="scripts" className="gap-2"><MessageCircle className="h-4 w-4" />Scripts WhatsApp</TabsTrigger>
                <TabsTrigger value="routines" className="gap-2"><Target className="h-4 w-4" />Rotinas</TabsTrigger>
              </TabsList>

              <TabsContent value="qfd" className="mt-6 space-y-6">
                <p className="text-sm text-muted-foreground">A arquitetura de mensagem QFD define a comunicação em 3 níveis: do emocional (Decorado) ao racional (Procedimentos).</p>

                <div className="space-y-4">
                  <GlassCard className="border-l-4 border-l-purple-500">
                    <GlassCardHeader className="pb-2">
                      <GlassCardTitle className="flex items-center gap-2 text-purple-600"><Sparkles className="h-5 w-5" />{mockQFD.decorado.title}</GlassCardTitle>
                    </GlassCardHeader>
                    <GlassCardContent>
                      <p className="text-sm text-muted-foreground mb-3">O que o cliente SENTE quando pensa no resultado.</p>
                      <div className="grid md:grid-cols-2 gap-2">
                        {mockQFD.decorado.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-purple-50">
                            <div className="w-2 h-2 rounded-full bg-purple-500" /><span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </GlassCardContent>
                  </GlassCard>

                  <GlassCard className="border-l-4 border-l-primary">
                    <GlassCardHeader className="pb-2">
                      <GlassCardTitle className="flex items-center gap-2 text-primary"><Target className="h-5 w-5" />{mockQFD.metodo.title}</GlassCardTitle>
                    </GlassCardHeader>
                    <GlassCardContent>
                      <p className="text-sm text-muted-foreground mb-3">COMO a clínica trabalha. O processo e metodologia.</p>
                      <div className="grid md:grid-cols-2 gap-2">
                        {mockQFD.metodo.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                            <div className="w-2 h-2 rounded-full bg-primary" /><span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </GlassCardContent>
                  </GlassCard>

                  <GlassCard className="border-l-4 border-l-ok">
                    <GlassCardHeader className="pb-2">
                      <GlassCardTitle className="flex items-center gap-2 text-ok"><FileText className="h-5 w-5" />{mockQFD.procedimentos.title}</GlassCardTitle>
                    </GlassCardHeader>
                    <GlassCardContent>
                      <p className="text-sm text-muted-foreground mb-3">O QUE é feito tecnicamente.</p>
                      <div className="flex flex-wrap gap-2">
                        {mockQFD.procedimentos.items.map((item, idx) => (<Badge key={idx} variant="outline" className="bg-ok/5 border-ok/20">{item}</Badge>))}
                      </div>
                    </GlassCardContent>
                  </GlassCard>
                </div>
              </TabsContent>

              <TabsContent value="scripts" className="mt-6 space-y-4">
                <p className="text-sm text-muted-foreground">Scripts anti "ml" para WhatsApp. Respostas curtas e humanizadas.</p>
                {mockMessageTemplates.map((template) => (
                  <GlassCard key={template.id}>
                    <GlassCardHeader className="pb-2 flex flex-row items-center justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-2">{template.category}</Badge>
                        <GlassCardTitle className="text-base">{template.name}</GlassCardTitle>
                      </div>
                      <Button size="sm" variant="ghost" className="gap-2" onClick={() => copyToClipboard(template.content, template.id)}>
                        {copiedId === template.id ? <Check className="h-4 w-4 text-ok" /> : <Copy className="h-4 w-4" />}Copiar
                      </Button>
                    </GlassCardHeader>
                    <GlassCardContent>
                      <div className="p-3 rounded-lg bg-muted/30 text-sm whitespace-pre-wrap">{template.content}</div>
                    </GlassCardContent>
                  </GlassCard>
                ))}
              </TabsContent>

              <TabsContent value="routines" className="mt-6 space-y-4">
                <p className="text-sm text-muted-foreground">Rotinas de prova e valor para construir autoridade.</p>
                {[
                  { title: 'Rotina de Prova Social', items: ['Segunda: Depoimento em vídeo', 'Quarta: Screenshot de review', 'Sexta: Antes e depois'] },
                  { title: 'Rotina de Bastidores', items: ['Terça: Stories do dia-a-dia', 'Quinta: Preparo de procedimento', 'Sábado: Dra. respondendo dúvidas'] },
                  { title: 'Rotina Educativa', items: ['Carrossel: Mitos vs Verdades', 'Reels: Explicação de procedimento', 'Live mensal: Tire dúvidas'] },
                ].map((routine, idx) => (
                  <GlassCard key={idx}>
                    <GlassCardHeader><GlassCardTitle className="text-base">{routine.title}</GlassCardTitle></GlassCardHeader>
                    <GlassCardContent>
                      <ul className="space-y-2">
                        {routine.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-center gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-primary" />{item}</li>
                        ))}
                      </ul>
                    </GlassCardContent>
                  </GlassCard>
                ))}
                <Button className="w-full button-primary gap-2"><Play className="h-4 w-4" />Aplicar Playbook em Cliente</Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

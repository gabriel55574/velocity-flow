import { useMemo } from "react";
import { ClientLayout } from "@/components/client-portal/ClientLayout";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Image, 
  Video, 
  FileText, 
  Key,
  CheckCircle,
  AlertCircle,
  Clock,
  Plus,
  Instagram,
  Globe,
  MessageCircle,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAssets, useUpdateAsset } from "@/hooks/useAssets";
import { useCurrentUser } from "@/hooks/useUsers";
import { useUserClients } from "@/hooks/useClientAccess";
import { useAccessValidation } from "@/hooks/useWorkflows";
import { Loader2 } from "lucide-react";

const assetTypeConfig = {
  logo: { icon: Image, label: 'Logo', description: 'Logo principal em alta resolução (PNG ou SVG)' },
  photo: { icon: Image, label: 'Fotos', description: 'Fotos do espaço, equipe e procedimentos' },
  video: { icon: Video, label: 'Vídeos', description: 'Vídeos institucionais e depoimentos' },
  doc: { icon: FileText, label: 'Documentos', description: 'Termos, contratos e materiais' },
  consent: { icon: FileText, label: 'Autorizações', description: 'Termos de uso de imagem' },
};

const accessIcons: Record<string, typeof Instagram> = {
  'Instagram Business': Instagram,
  'Meta Business Manager': BarChart3,
  'Conta de Anúncios Meta': BarChart3,
  'Google Ads': Globe,
  'Google Analytics': BarChart3,
  'Acesso ao Site/Domínio': Globe,
  'WhatsApp Business': MessageCircle,
};

export default function ClientAssets() {
  const { toast } = useToast();
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id;
  const { data: clientLinks } = useUserClients(userId || "");
  const clientId = useMemo(() => clientLinks?.[0]?.client_id, [clientLinks]);
  const { data: assets, isLoading: assetsLoading } = useAssets(clientId ? { client_id: clientId } : undefined);
  const { data: accessChecklist, isLoading: accessLoading } = useAccessValidation({ client_id: clientId || "" });
  const updateAsset = useUpdateAsset();

  const uploadedCount = (assets || []).filter(a => (a.status || 'missing') !== 'missing').length;
  const validatedCount = (assets || []).filter(a => a.status === 'validated').length;
  const totalAssets = assets?.length || 0;

  const accessValidatedCount = (accessChecklist || []).filter(a => a.status === 'done').length;
  const totalAccesses = accessChecklist?.length || 0;

  const handleUpload = async (assetId: string) => {
    if (!assetId) return;
    await updateAsset.mutateAsync({ id: assetId, status: 'uploaded' });
    toast({
      title: "Upload registrado",
      description: "A equipe será notificada para validar o arquivo.",
    });
  };

  const handleAccessSubmit = () => {
    toast({
      title: "Acesso enviado",
      description: "A equipe irá validar a conexão.",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'validated':
        return { badge: 'done' as const, label: 'Validado', icon: CheckCircle, color: 'text-ok' };
      case 'uploaded':
        return { badge: 'inprogress' as const, label: 'Em Análise', icon: Clock, color: 'text-primary' };
      case 'pending':
        return { badge: 'warn' as const, label: 'Pendente', icon: AlertCircle, color: 'text-warn' };
      default:
        return { badge: 'risk' as const, label: 'Faltando', icon: AlertCircle, color: 'text-risk' };
    }
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        {(assetsLoading || accessLoading) && (
          <GlassCard>
            <GlassCardContent className="p-6 flex items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Sincronizando ativos...
            </GlassCardContent>
          </GlassCard>
        )}

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ativos e Acessos</h1>
          <p className="text-muted-foreground">Envie materiais e configure os acessos necessários</p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-2 gap-4">
          <GlassCard>
            <GlassCardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Ativos Enviados</span>
                <span className="text-sm text-muted-foreground">{uploadedCount}/{totalAssets}</span>
              </div>
              <Progress value={totalAssets ? (uploadedCount / totalAssets) * 100 : 0} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">{validatedCount} validados pela equipe</p>
            </GlassCardContent>
          </GlassCard>

          <GlassCard>
            <GlassCardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Acessos Configurados</span>
                <span className="text-sm text-muted-foreground">{accessValidatedCount}/{totalAccesses}</span>
              </div>
              <Progress value={totalAccesses ? (accessValidatedCount / totalAccesses) * 100 : 0} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">{totalAccesses - accessValidatedCount} pendentes</p>
            </GlassCardContent>
          </GlassCard>
        </div>

        <Tabs defaultValue="assets">
          <TabsList>
            <TabsTrigger value="assets" className="gap-2">
              <Upload className="h-4 w-4" />
              Ativos
            </TabsTrigger>
            <TabsTrigger value="accesses" className="gap-2">
              <Key className="h-4 w-4" />
              Acessos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assets" className="mt-4 space-y-4">
            {/* Upload Area */}
            <GlassCard className="border-dashed border-2 border-primary/30 bg-primary/5">
              <GlassCardContent className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Arraste arquivos aqui</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    ou clique para selecionar do seu computador
                  </p>
                  <Button className="button-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Selecionar Arquivos
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Formatos aceitos: PNG, JPG, MP4, PDF (máx. 50MB)
                  </p>
                </div>
              </GlassCardContent>
            </GlassCard>

            {/* Asset Types */}
            <div className="space-y-3">
              {(assets || []).length === 0 && (
                <GlassCard>
                  <GlassCardContent className="p-8 text-center text-muted-foreground">
                    Nenhum ativo enviado ainda.
                  </GlassCardContent>
                </GlassCard>
              )}

              {(assets || []).map((asset) => {
                const config = assetTypeConfig[asset.type as keyof typeof assetTypeConfig];
                const statusConfig = getStatusConfig(asset.status || 'missing');
                const Icon = config?.icon || FileText;
                const StatusIcon = statusConfig.icon;

                return (
                  <GlassCard key={asset.id}>
                    <GlassCardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center",
                          (asset.status || 'missing') === 'missing' ? "bg-risk/10" : "bg-muted/50"
                        )}>
                          <Icon className={cn(
                            "h-6 w-6",
                            (asset.status || 'missing') === 'missing' ? "text-risk" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{asset.name}</h3>
                          <p className="text-xs text-muted-foreground">{config?.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={cn("flex items-center gap-1", statusConfig.color)}>
                            <StatusIcon className="h-4 w-4" />
                            <span className="text-sm">{statusConfig.label}</span>
                          </div>
                          {(asset.status || 'missing') === 'missing' && (
                            <Button size="sm" onClick={() => handleUpload(asset.id)}>
                              Enviar
                            </Button>
                          )}
                        </div>
                      </div>
                    </GlassCardContent>
                  </GlassCard>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="accesses" className="mt-4 space-y-4">
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle>Checklist de Acessos</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Para gerenciar suas campanhas, precisamos de acesso às seguintes plataformas. 
                  Clique em cada item para ver as instruções.
                </p>

                {(accessChecklist || []).length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhuma pendência de acesso.</p>
                )}

                {(accessChecklist || []).map((access) => {
                  const statusConfig = getStatusConfig(access.status === 'done' ? 'validated' : 'missing');
                  const Icon = accessIcons[access.name] || Key;

                  return (
                    <div 
                      key={access.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                        access.status === 'done' 
                          ? "bg-ok/5 border-ok/20" 
                          : access.status === 'in_progress' || access.status === 'doing'
                          ? "bg-warn/5 border-warn/20"
                          : "bg-muted/30 border-transparent"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        access.status === 'done' ? "bg-ok/10" : "bg-muted/50"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5",
                          access.status === 'done' ? "text-ok" : "text-muted-foreground"
                        )} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{access.name}</h3>
                        {access.status !== 'done' && (
                          <p className="text-xs text-warn">Aguardando configuração</p>
                        )}
                      </div>
                      {access.status === 'done' ? (
                        <CheckCircle className="h-5 w-5 text-ok" />
                      ) : (
                        <Button 
                          size="sm" 
                          variant={access.status === 'pending' ? 'default' : 'outline'}
                          onClick={() => handleAccessSubmit()}
                        >
                          {access.status === 'pending' ? 'Configurar' : 'Validar'}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </GlassCardContent>
            </GlassCard>

            {/* Instructions Card */}
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Como fornecer os acessos?
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Meta Business Manager:</strong> Adicione nossa conta como parceiro 
                  com permissão de gerenciamento de anúncios.
                </p>
                <p>
                  <strong className="text-foreground">Instagram:</strong> Converta para conta profissional e 
                  conecte ao Business Manager.
                </p>
                <p>
                  <strong className="text-foreground">Google:</strong> Compartilhe acesso de administrador para 
                  Analytics e Ads.
                </p>
                <p className="pt-2">
                  📧 Dúvidas? Entre em contato com seu CS responsável.
                </p>
              </GlassCardContent>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
}

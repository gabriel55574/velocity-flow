import { useMemo, useRef, useState } from "react";
import { ClientLayout } from "@/components/client-portal/ClientLayout";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Image, 
  Video, 
  FileText, 
  Key,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  Instagram,
  Globe,
  MessageCircle,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useAssets, useUploadAssetFile, useUpdateAsset } from "@/hooks/useAssets";
import { useCurrentUser } from "@/hooks/useUsers";
import { useUserClients } from "@/hooks/useClientAccess";
import { useAccessValidation } from "@/hooks/useWorkflows";
import { useClient } from "@/hooks/useClients";
import type { Database } from "@/types/database";
import { useCreateAuditLog } from "@/hooks/useAuditLogs";

const assetTypeConfig: Record<string, { icon: typeof Image; label: string; description: string }> = {
  image: { icon: Image, label: 'Imagem', description: 'Imagens em alta resolução (PNG ou JPG)' },
  video: { icon: Video, label: 'Vídeo', description: 'Vídeos institucionais e depoimentos' },
  document: { icon: FileText, label: 'Documento', description: 'Termos, contratos e materiais' },
  link: { icon: FileText, label: 'Link', description: 'Links importantes (drive, site, etc.)' },
  credential: { icon: Key, label: 'Credencial', description: 'Acessos e credenciais necessárias' },
  logo: { icon: Image, label: 'Logo', description: 'Logo principal em alta resolução (PNG ou SVG)' },
  photo: { icon: Image, label: 'Fotos', description: 'Fotos do espaço, equipe e procedimentos' },
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
  const { data: client } = useClient(clientId || "");
  const agencyId = client?.agency_id || "";
  const { data: assets, isLoading: assetsLoading } = useAssets(clientId ? { client_id: clientId } : undefined);
  const { data: accessChecklist, isLoading: accessLoading } = useAccessValidation({ client_id: clientId || "" });
  const uploadAssetFile = useUploadAssetFile();
  const updateAsset = useUpdateAsset();
  const createAuditLog = useCreateAuditLog();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<Database["public"]["Tables"]["assets"]["Row"] | null>(null);
  const [linkTarget, setLinkTarget] = useState<Database["public"]["Tables"]["assets"]["Row"] | null>(null);
  const [linkValue, setLinkValue] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const isUploading = uploadAssetFile.isPending;
  const isUpdatingLink = updateAsset.isPending;

  const uploadedCount = (assets || []).filter(a => (a.status || 'missing') !== 'missing').length;
  const validatedCount = (assets || []).filter(a => a.status === 'validated').length;
  const totalAssets = assets?.length || 0;

  const accessValidatedCount = (accessChecklist || []).filter(a => a.status === 'done').length;
  const totalAccesses = accessChecklist?.length || 0;

  const missingAssets = (assets || []).filter((asset) => (asset.status || 'missing') === 'missing');

  const handleFileUpload = async (file: File, asset: Database["public"]["Tables"]["assets"]["Row"]) => {
    if (!clientId || !agencyId || !currentUser) return;
    const type = (asset.type || 'document') as Database["public"]["Enums"]["asset_type"];

    await uploadAssetFile.mutateAsync({
      asset_id: asset.id,
      file,
      client_id: clientId,
      agency_id: agencyId,
      type,
      uploaded_by: currentUser.id,
      visibility: 'public',
    });

    await createAuditLog.mutateAsync({
      agency_id: agencyId,
      user_id: currentUser.id,
      action: "asset_uploaded",
      entity_type: "assets",
      entity_id: asset.id,
      new_data: {
        file_name: file.name,
        size: file.size,
        type,
      },
    });

    toast({
      title: "Upload enviado",
      description: "A equipe receberá o arquivo para validação.",
    });
  };

  const openFilePicker = (asset?: Database["public"]["Tables"]["assets"]["Row"]) => {
    const target = asset || missingAssets[0];
    if (!target) {
      toast({
        title: "Nenhum ativo pendente",
        description: "Não há ativos faltando para este cliente.",
        variant: "destructive",
      });
      return;
    }
    if (target.status === 'validated') {
      toast({
        title: "Asset validado",
        description: "Este asset já foi validado e não pode ser alterado.",
        variant: "destructive",
      });
      return;
    }
    setUploadTarget(target);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !uploadTarget) return;
    await handleFileUpload(file, uploadTarget);
    setUploadTarget(null);
    event.target.value = '';
  };

  const openLinkDialog = (asset: Database["public"]["Tables"]["assets"]["Row"]) => {
    if (asset.status === 'validated') {
      toast({
        title: "Asset validado",
        description: "Este asset já foi validado e não pode ser alterado.",
        variant: "destructive",
      });
      return;
    }
    setLinkTarget(asset);
    setLinkValue(asset.url || "");
    setLinkOpen(true);
  };

  const handleSaveLink = async () => {
    if (!linkTarget || !currentUser || !agencyId) return;
    if (linkTarget.status === 'validated') {
      toast({
        title: "Asset validado",
        description: "Este asset já foi validado e não pode ser alterado.",
        variant: "destructive",
      });
      return;
    }
    const trimmed = linkValue.trim();
    if (!trimmed) {
      toast({
        title: "Link obrigatório",
        description: "Informe um link válido para o asset.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateAsset.mutateAsync({
        id: linkTarget.id,
        url: trimmed,
        status: 'uploaded',
      });

      await createAuditLog.mutateAsync({
        agency_id: agencyId,
        user_id: currentUser.id,
        action: "asset_linked",
        entity_type: "assets",
        entity_id: linkTarget.id,
        new_data: {
          url: trimmed,
        },
      });

      toast({
        title: "Link enviado",
        description: "O link foi registrado para validação.",
      });

      setLinkOpen(false);
      setLinkTarget(null);
      setLinkValue("");
    } catch (error) {
      toast({
        title: "Erro ao salvar link",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
    }
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
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />

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
                          <Button size="sm" onClick={() => openFilePicker(asset)} disabled={isUploading}>
                            Enviar
                          </Button>
                        )}
                        {(asset.status || 'missing') !== 'missing' && (asset.status || 'missing') !== 'validated' && (
                          <Button size="sm" variant="outline" onClick={() => openFilePicker(asset)} disabled={isUploading}>
                            Trocar arquivo
                          </Button>
                        )}
                        {(asset.status || 'missing') !== 'validated' && (
                          <Button size="sm" variant="outline" onClick={() => openLinkDialog(asset)} disabled={isUpdatingLink}>
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Enviar link
                          </Button>
                        )}
                        {asset.url && (
                          <Button asChild size="sm" variant="outline">
                            <a href={asset.url} target="_blank" rel="noreferrer">
                              Ver arquivo
                              </a>
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

      <Dialog
        open={linkOpen}
        onOpenChange={(open) => {
          setLinkOpen(open);
          if (!open) {
            setLinkTarget(null);
            setLinkValue("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar link do asset</DialogTitle>
            <DialogDescription>
              Cole o link do arquivo para que a equipe possa validar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="asset-link">Link</Label>
            <Input
              id="asset-link"
              type="url"
              placeholder="https://..."
              value={linkValue}
              onChange={(event) => setLinkValue(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveLink} disabled={isUpdatingLink}>
              {isUpdatingLink ? "Salvando..." : "Salvar link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
}

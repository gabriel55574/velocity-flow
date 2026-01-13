import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import {
    FolderOpen,
    Image,
    Video,
    FileText,
    Shield,
    Upload,
    CheckCircle2,
    Clock,
    Key,
    Loader2,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssets } from "@/hooks/useAssets";
import { useAccessValidation } from "@/hooks/useWorkflows";
import { CreateAssetDialog } from "@/components/dialogs/assets/CreateAssetDialog";
import { EditAssetDialog } from "@/components/dialogs/assets/EditAssetDialog";
import { useCurrentUser } from "@/hooks/useUsers";
import { useClient } from "@/hooks/useClients";
import type { Database } from "@/integrations/supabase/types";
import { useState } from "react";

const typeIcons: Record<string, React.ElementType> = {
    image: Image,
    video: Video,
    document: FileText,
    link: FileText,
    credential: Shield,
};

const statusConfig = {
    missing: { color: "text-red-500", bg: "bg-red-500/10", label: "Faltando" },
    uploaded: { color: "text-amber-500", bg: "bg-amber-500/10", label: "Enviado" },
    validated: { color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Validado" },
};

interface AssetCardProps {
    asset: Database['public']['Tables']['assets']['Row'];
    onOpen: (asset: Database['public']['Tables']['assets']['Row']) => void;
}

function AssetCard({ asset, onOpen }: AssetCardProps) {
    const status = asset.status || 'missing';
    const TypeIcon = typeIcons[asset.type || 'document'] || FileText;
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.missing;

    return (
        <div
            className="p-4 rounded-xl border border-border/50 bg-card cursor-pointer"
            onClick={() => onOpen(asset)}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${config.bg}`}>
                    <TypeIcon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-sm">{asset.name}</h4>
                    <p className="text-xs text-muted-foreground capitalize">{asset.type}</p>
                </div>
                <StatusBadge
                    status={
                        asset.status === "validated"
                            ? "ok"
                            : asset.status === "uploaded"
                                ? "warn"
                                : "risk"
                    }
                    size="sm"
                >
                    {config.label}
                </StatusBadge>
            </div>

            {status === "missing" && (
                <Button size="sm" variant="outline" className="w-full mt-3 gap-2" onClick={(event) => event.stopPropagation()}>
                    <Upload className="h-4 w-4" />
                    Solicitar Upload
                </Button>
            )}
        </div>
    );
}

interface AssetsTabProps {
    clientId: string;
}

export function AssetsTab({ clientId }: AssetsTabProps) {
    const { data: currentUser } = useCurrentUser();
    const { data: client } = useClient(clientId);
    const agencyId = client?.agency_id || "";
    const { data: assets, isLoading: assetsLoading, error: assetsError } = useAssets({ client_id: clientId });
    const { data: accessChecklist, isLoading: accessLoading, error: accessError } = useAccessValidation({ client_id: clientId });
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Database['public']['Tables']['assets']['Row'] | null>(null);

    const list = assets || [];
    const validated = list.filter(a => a.status === "validated").length;
    const uploaded = list.filter(a => a.status === "uploaded").length;
    const missing = list.filter(a => (a.status || 'missing') === "missing").length;
    const progress = list.length > 0 ? Math.round(((validated + uploaded) / list.length) * 100) : 0;

    const accessItems = accessChecklist || [];
    const accessValidated = accessItems.filter(a => a.status === "done").length;
    const accessProgress = accessItems.length > 0 ? Math.round((accessValidated / accessItems.length) * 100) : 0;

    const handleOpenEdit = (asset: Database['public']['Tables']['assets']['Row']) => {
        setSelectedAsset(asset);
        setEditOpen(true);
    };

    return (
        <div className="space-y-6">
            {(assetsLoading || accessLoading) && (
                <GlassCard>
                    <GlassCardContent className="p-6 flex items-center justify-center gap-3 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sincronizando inventário...
                    </GlassCardContent>
                </GlassCard>
            )}

            {(assetsError || accessError) && (
                <GlassCard>
                    <GlassCardContent className="p-6 text-center text-muted-foreground">
                        <p>Erro ao carregar ativos. Tente novamente.</p>
                    </GlassCardContent>
                </GlassCard>
            )}

            {/* Summary */}
            <div className="grid md:grid-cols-2 gap-4">
                <GlassCard className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <FolderOpen className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Ativos do Cliente</h3>
                        </div>
                        <span className="text-sm font-bold text-primary">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2 mb-3" />
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                            <p className="font-bold text-emerald-500">{validated}</p>
                            <p className="text-muted-foreground">Validados</p>
                        </div>
                        <div>
                            <p className="font-bold text-amber-500">{uploaded}</p>
                            <p className="text-muted-foreground">Enviados</p>
                        </div>
                        <div>
                            <p className="font-bold text-red-500">{missing}</p>
                            <p className="text-muted-foreground">Faltando</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-purple-500" />
                            <h3 className="font-semibold">Acessos</h3>
                        </div>
                        <span className="text-sm font-bold text-purple-500">{accessProgress}%</span>
                    </div>
                    <Progress value={accessProgress} className="h-2 mb-3" />
                    <p className="text-xs text-muted-foreground">
                        {accessValidated} de {accessItems.length} acessos validados
                    </p>
                </GlassCard>
            </div>

            {/* Assets Grid */}
            <GlassCard>
                <GlassCardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <GlassCardTitle className="text-base">
                            Inventário de Ativos
                        </GlassCardTitle>
                        <Button
                            size="sm"
                            className="gap-2"
                            onClick={() => setCreateOpen(true)}
                            disabled={!currentUser}
                        >
                            <Plus className="h-4 w-4" />
                            Novo Asset
                        </Button>
                    </div>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {list.length > 0 ? (
                            list.map((asset) => (
                                <AssetCard key={asset.id} asset={asset} onOpen={handleOpenEdit} />
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">Nenhum ativo cadastrado para este cliente.</p>
                        )}
                    </div>
                </GlassCardContent>
            </GlassCard>

            {/* Access Checklist */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2 text-base">
                        <Key className="h-5 w-5 text-purple-500" />
                        Checklist de Acessos
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-2">
                    {accessItems.length > 0 ? (
                        accessItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30"
                            >
                                {item.status === "done" ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                ) : (
                                    <Clock className="h-5 w-5 text-amber-500" />
                                )}
                                <span className="flex-1 text-sm">{item.name}</span>
                                <StatusBadge
                                    status={item.status === "done" ? "ok" : "warn"}
                                    size="sm"
                                >
                                    {item.status === "done" ? "Validado" : "Pendente"}
                                </StatusBadge>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">Nenhum checklist de acesso encontrado.</p>
                    )}
                </GlassCardContent>
            </GlassCard>

            {currentUser?.id && (
                <CreateAssetDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                    clientId={clientId}
                    agencyId={agencyId}
                    userId={currentUser.id}
                />
            )}

            <EditAssetDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                asset={selectedAsset}
            />
        </div>
    );
}

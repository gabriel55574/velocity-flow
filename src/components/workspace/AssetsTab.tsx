import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { mockAssets, mockAccessChecklist, Asset } from "@/data/mockData";
import {
    FolderOpen,
    Image,
    Video,
    FileText,
    Shield,
    Upload,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Key
} from "lucide-react";
import { Button } from "@/components/ui/button";

const typeIcons = {
    logo: Image,
    photo: Image,
    video: Video,
    doc: FileText,
    consent: Shield,
    other: FileText,
};

const statusConfig = {
    missing: { color: "text-red-500", bg: "bg-red-500/10", label: "Faltando" },
    uploaded: { color: "text-amber-500", bg: "bg-amber-500/10", label: "Enviado" },
    validated: { color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Validado" },
};

interface AssetCardProps {
    asset: Asset;
}

function AssetCard({ asset }: AssetCardProps) {
    const TypeIcon = typeIcons[asset.type] || FileText;
    const config = statusConfig[asset.status];

    return (
        <div className="p-4 rounded-xl border border-border/50 bg-card">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${config.bg}`}>
                    <TypeIcon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-sm">{asset.title}</h4>
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

            {asset.status === "missing" && (
                <Button size="sm" variant="outline" className="w-full mt-3 gap-2">
                    <Upload className="h-4 w-4" />
                    Solicitar Upload
                </Button>
            )}
        </div>
    );
}

export function AssetsTab() {
    // Calculate progress
    const validated = mockAssets.filter(a => a.status === "validated").length;
    const uploaded = mockAssets.filter(a => a.status === "uploaded").length;
    const missing = mockAssets.filter(a => a.status === "missing").length;
    const progress = Math.round(((validated + uploaded) / mockAssets.length) * 100);

    // Access checklist progress
    const accessValidated = mockAccessChecklist.filter(a => a.status === "validated").length;
    const accessProgress = Math.round((accessValidated / mockAccessChecklist.length) * 100);

    return (
        <div className="space-y-6">
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
                        {accessValidated} de {mockAccessChecklist.length} acessos validados
                    </p>
                </GlassCard>
            </div>

            {/* Assets Grid */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="text-base">
                        Inventário de Ativos
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mockAssets.map((asset) => (
                            <AssetCard key={asset.id} asset={asset} />
                        ))}
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
                    {mockAccessChecklist.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30"
                        >
                            {item.status === "validated" ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : (
                                <Clock className="h-5 w-5 text-amber-500" />
                            )}
                            <span className="flex-1 text-sm">{item.title}</span>
                            <StatusBadge
                                status={item.status === "validated" ? "ok" : "warn"}
                                size="sm"
                            >
                                {item.status === "validated" ? "Validado" : "Pendente"}
                            </StatusBadge>
                        </div>
                    ))}
                </GlassCardContent>
            </GlassCard>
        </div>
    );
}

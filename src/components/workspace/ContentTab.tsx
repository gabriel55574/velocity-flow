import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
    Image,
    Video,
    FileText,
    Layers,
    Calendar,
    Eye,
    CheckCircle2,
    Clock,
    Edit,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreatives } from "@/hooks/useCreatives";
import { useState, useMemo } from "react";
import { CreateCreativeDialog, EditCreativeDialog } from "@/components/dialogs";
import type { Database } from "@/types/database";

const typeIcons = {
    image: Image,
    video: Video,
    copy: FileText,
    carousel: Layers,
};

const statusConfig: Record<string, { label: string; status: "ok" | "warn" | "risk" }> = {
    draft: { label: "Rascunho", status: "warn" },
    pending_approval: { label: "Em Revisão", status: "warn" },
    approved: { label: "Aprovado", status: "ok" },
    published: { label: "Publicado", status: "ok" },
    rejected: { label: "Rejeitado", status: "risk" },
};

interface CreativeCardProps {
    creative: Database["public"]["Tables"]["creatives"]["Row"];
    onClick?: () => void;
}

function CreativeCard({ creative, onClick }: CreativeCardProps) {
    const TypeIcon = typeIcons[creative.type] || Image;
    const statusCfg = statusConfig[creative.status || "draft"] || statusConfig.draft;

    return (
        <div
            className="rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    onClick?.();
                }
            }}
        >
            {/* Thumbnail area */}
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center relative">
                <TypeIcon className="h-12 w-12 text-muted-foreground/30" />
                <div className="absolute top-2 right-2">
                    <StatusBadge status={statusCfg.status} size="sm">
                        {statusCfg.label}
                    </StatusBadge>
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
                    <TypeIcon className="h-3 w-3" />
                    <span className="capitalize">{creative.type}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                <h4 className="font-medium text-sm line-clamp-1">{creative.title}</h4>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="capitalize">{creative.platform}</span>
                    </div>
                    {creative.created_at && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(creative.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface ContentTabProps {
    clientId: string;
}

export function ContentTab({ clientId }: ContentTabProps) {
    const { data: creatives, isLoading } = useCreatives({ client_id: clientId });
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCreative, setSelectedCreative] = useState<Database["public"]["Tables"]["creatives"]["Row"] | null>(null);

    const creativesList = creatives || [];
    const creativesByDay = useMemo(() => {
        const map = new Map<number, Database["public"]["Tables"]["creatives"]["Row"]>();
        creativesList.forEach((creative) => {
            if (!creative.created_at) return;
            const day = new Date(creative.created_at).getDay();
            if (!map.has(day)) {
                map.set(day, creative);
            }
        });
        return map;
    }, [creativesList]);

    const statusGroups = {
        draft: (creatives || []).filter(c => c.status === "draft"),
        review: (creatives || []).filter(c => c.status === "pending_approval"),
        approved: (creatives || []).filter(c => c.status === "approved"),
        published: (creatives || []).filter(c => c.status === "published"),
    };

    return (
        <div className="space-y-6">
            {isLoading && (
                <GlassCard>
                    <GlassCardContent className="p-6 flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Carregando biblioteca de criativos...
                    </GlassCardContent>
                </GlassCard>
            )}
            {/* Summary */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2 text-base">
                        <Image className="h-5 w-5 text-primary" />
                        Biblioteca de Criativos
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 rounded-xl bg-slate-100">
                            <Edit className="h-5 w-5 mx-auto mb-1 text-slate-500" />
                            <p className="text-lg font-bold">{statusGroups.draft.length}</p>
                            <p className="text-xs text-muted-foreground">Rascunhos</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-amber-100">
                            <Clock className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                            <p className="text-lg font-bold">{statusGroups.review.length}</p>
                            <p className="text-xs text-muted-foreground">Em Revisão</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-emerald-100">
                            <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                            <p className="text-lg font-bold">{statusGroups.approved.length}</p>
                            <p className="text-xs text-muted-foreground">Aprovados</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-blue-100">
                            <Eye className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                            <p className="text-lg font-bold">{statusGroups.published.length}</p>
                            <p className="text-xs text-muted-foreground">Publicados</p>
                        </div>
                    </div>
                </GlassCardContent>
            </GlassCard>

            {/* Content Calendar */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2 text-base">
                        <Calendar className="h-5 w-5 text-purple-500" />
                        Calendário Editorial
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="overflow-x-auto pb-2">
                        <div className="min-w-[560px]">
                            <div className="grid grid-cols-7 gap-2 text-center text-xs mb-4">
                                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                                    <div key={day} className="font-medium text-muted-foreground py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: 7 }, (_, i) => {
                                    const scheduledCreative = creativesByDay.get(i);
                                    return (
                                        <div
                                            key={i}
                                            className={`p-2 rounded-lg min-h-[80px] ${scheduledCreative
                                                ? "bg-primary/10 border border-primary/20"
                                                : "bg-secondary/30"
                                                }`}
                                        >
                                            <p className="text-xs font-medium mb-1">{6 + i}</p>
                                            {scheduledCreative && (
                                                <div className="text-xs">
                                                    <p className="font-medium truncate">{scheduledCreative.title}</p>
                                                    <p className="text-muted-foreground capitalize">{scheduledCreative.platform}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </GlassCardContent>
            </GlassCard>

            {/* Creative Grid */}
            <GlassCard>
                <GlassCardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <GlassCardTitle className="text-base">
                            Todos os Criativos ({creativesList.length})
                        </GlassCardTitle>
                        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                            Novo Criativo
                        </Button>
                    </div>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {creativesList.length > 0 ? (
                            creativesList.map((creative) => (
                                <CreativeCard
                                    key={creative.id}
                                    creative={creative}
                                    onClick={() => {
                                        setSelectedCreative(creative);
                                        setIsEditOpen(true);
                                    }}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">Nenhum criativo cadastrado para este cliente.</p>
                        )}
                    </div>
                </GlassCardContent>
            </GlassCard>

            <CreateCreativeDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                clientId={clientId}
            />
            <EditCreativeDialog
                open={isEditOpen}
                onOpenChange={(open) => {
                    setIsEditOpen(open);
                    if (!open) setSelectedCreative(null);
                }}
                creative={selectedCreative}
            />
        </div>
    );
}

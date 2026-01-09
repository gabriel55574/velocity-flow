import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockCreatives, Creative } from "@/data/mockData";
import {
    Image,
    Video,
    FileText,
    Layers,
    Calendar,
    Eye,
    CheckCircle2,
    Clock,
    Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";

const typeIcons = {
    image: Image,
    video: Video,
    copy: FileText,
    carousel: Layers,
};

const statusConfig = {
    draft: { label: "Rascunho", status: "warn" as const },
    review: { label: "Em Revisão", status: "warn" as const },
    approved: { label: "Aprovado", status: "ok" as const },
    published: { label: "Publicado", status: "ok" as const },
    archived: { label: "Arquivado", status: "risk" as const },
};

interface CreativeCardProps {
    creative: Creative;
}

function CreativeCard({ creative }: CreativeCardProps) {
    const TypeIcon = typeIcons[creative.type] || Image;
    const statusCfg = statusConfig[creative.status];

    return (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden hover:shadow-lg transition-shadow">
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
                    {creative.scheduledFor && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(creative.scheduledFor).toLocaleDateString('pt-BR')}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function ContentTab() {
    const statusGroups = {
        draft: mockCreatives.filter(c => c.status === "draft"),
        review: mockCreatives.filter(c => c.status === "review"),
        approved: mockCreatives.filter(c => c.status === "approved"),
        published: mockCreatives.filter(c => c.status === "published"),
    };

    return (
        <div className="space-y-6">
            {/* Summary */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2 text-base">
                        <Image className="h-5 w-5 text-primary" />
                        Biblioteca de Criativos
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="grid grid-cols-4 gap-4">
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
                    <div className="grid grid-cols-7 gap-2 text-center text-xs mb-4">
                        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                            <div key={day} className="font-medium text-muted-foreground py-2">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 7 }, (_, i) => {
                            const scheduledCreative = mockCreatives.find(
                                c => c.scheduledFor && new Date(c.scheduledFor).getDay() === i
                            );
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
                </GlassCardContent>
            </GlassCard>

            {/* Creative Grid */}
            <GlassCard>
                <GlassCardHeader>
                    <div className="flex items-center justify-between">
                        <GlassCardTitle className="text-base">
                            Todos os Criativos ({mockCreatives.length})
                        </GlassCardTitle>
                        <Button size="sm">
                            Novo Criativo
                        </Button>
                    </div>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {mockCreatives.map((creative) => (
                            <CreativeCard key={creative.id} creative={creative} />
                        ))}
                    </div>
                </GlassCardContent>
            </GlassCard>
        </div>
    );
}

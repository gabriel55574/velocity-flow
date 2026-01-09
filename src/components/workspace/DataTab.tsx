import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { mockTrackingChecklist, mockAccessChecklist } from "@/data/mockData";
import {
    Database,
    CheckCircle2,
    Clock,
    Circle,
    Link,
    ExternalLink
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const statusConfig = {
    done: { icon: CheckCircle2, color: "text-emerald-500", label: "Concluído" },
    in_progress: { icon: Clock, color: "text-blue-500", label: "Em andamento" },
    pending: { icon: Circle, color: "text-muted-foreground", label: "Pendente" },
    validated: { icon: CheckCircle2, color: "text-emerald-500", label: "Validado" },
};

interface ChecklistItemProps {
    item: {
        id: string;
        title: string;
        status: 'done' | 'in_progress' | 'pending' | 'validated';
    };
}

function ChecklistItem({ item }: ChecklistItemProps) {
    const config = statusConfig[item.status];
    const StatusIcon = config.icon;

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
            <StatusIcon className={`h-5 w-5 ${config.color}`} />
            <span className="flex-1 text-sm">{item.title}</span>
            <span className={`text-xs ${config.color}`}>{config.label}</span>
        </div>
    );
}

export function DataTab() {
    // Calculate tracking progress
    const trackingDone = mockTrackingChecklist.filter(
        (i) => i.status === "done"
    ).length;
    const trackingProgress = Math.round(
        (trackingDone / mockTrackingChecklist.length) * 100
    );

    // Calculate access progress
    const accessDone = mockAccessChecklist.filter(
        (i) => i.status === "validated"
    ).length;
    const accessProgress = Math.round(
        (accessDone / mockAccessChecklist.length) * 100
    );

    const dashboards = [
        { name: "Google Analytics 4", url: "#", status: "connected" },
        { name: "Meta Business Suite", url: "#", status: "connected" },
        { name: "Google Ads", url: "#", status: "pending" },
    ];

    return (
        <div className="space-y-6">
            {/* Progress Summary */}
            <div className="grid md:grid-cols-2 gap-4">
                <GlassCard className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Tracking Setup</h3>
                        <span className="text-sm font-bold text-primary">{trackingProgress}%</span>
                    </div>
                    <Progress value={trackingProgress} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                        {trackingDone} de {mockTrackingChecklist.length} itens concluídos
                    </p>
                </GlassCard>

                <GlassCard className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Acessos Validados</h3>
                        <span className="text-sm font-bold text-primary">{accessProgress}%</span>
                    </div>
                    <Progress value={accessProgress} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                        {accessDone} de {mockAccessChecklist.length} acessos validados
                    </p>
                </GlassCard>
            </div>

            {/* Tracking Checklist */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2 text-base">
                        <Database className="h-5 w-5 text-primary" />
                        Checklist de Tracking
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-2">
                    {mockTrackingChecklist.map((item) => (
                        <ChecklistItem key={item.id} item={item} />
                    ))}
                </GlassCardContent>
            </GlassCard>

            {/* Dashboards */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2 text-base">
                        <Link className="h-5 w-5 text-purple-500" />
                        Dashboards Externos
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-2">
                    {dashboards.map((dash, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-xl bg-secondary/30"
                        >
                            <div className="flex items-center gap-3">
                                {dash.status === "connected" ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                ) : (
                                    <Clock className="h-5 w-5 text-amber-500" />
                                )}
                                <span className="text-sm font-medium">{dash.name}</span>
                            </div>
                            <a
                                href={dash.url}
                                className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                                Abrir <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    ))}
                </GlassCardContent>
            </GlassCard>
        </div>
    );
}

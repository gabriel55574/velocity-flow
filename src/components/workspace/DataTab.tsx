import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import {
    CheckCircle2,
    Clock,
    Circle,
    Link,
    ExternalLink,
    Database as DatabaseIcon,
    Loader2,
    BarChart3,
    FlaskConical,
    Pencil,
    Plus
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTrackingChecklist, useAccessValidation } from "@/hooks/useWorkflows";
import { useKPIDefinitions, useKPIValues } from "@/hooks/useKPIs";
import { useExperiments } from "@/hooks/useExperiments";
import { useCurrentUser } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/types/database";
import { CreateKPIDefinitionDialog } from "@/components/dialogs/kpis/CreateKPIDefinitionDialog";
import { EditKPIDefinitionDialog } from "@/components/dialogs/kpis/EditKPIDefinitionDialog";
import { CreateKPIValueDialog } from "@/components/dialogs/kpis/CreateKPIValueDialog";
import { EditKPIValueDialog } from "@/components/dialogs/kpis/EditKPIValueDialog";
import { CreateExperimentDialog } from "@/components/dialogs/experiments/CreateExperimentDialog";
import { EditExperimentDialog } from "@/components/dialogs/experiments/EditExperimentDialog";
import { useMemo, useState } from "react";

const statusConfig = {
    done: { icon: CheckCircle2, color: "text-emerald-500", label: "Concluído" },
    in_progress: { icon: Clock, color: "text-blue-500", label: "Em andamento" },
    pending: { icon: Circle, color: "text-muted-foreground", label: "Pendente" },
    validated: { icon: CheckCircle2, color: "text-emerald-500", label: "Validado" },
};

type ChecklistStatus = "done" | "in_progress" | "pending" | "validated";

interface ChecklistItemProps {
    item: {
        id: string;
        name: string;
        status: ChecklistStatus;
    };
}

function ChecklistItem({ item }: ChecklistItemProps) {
    const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.pending;
    const StatusIcon = config.icon;

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
            <StatusIcon className={`h-5 w-5 ${config.color}`} />
            <span className="flex-1 text-sm">{item.name}</span>
            <span className={`text-xs ${config.color}`}>{config.label}</span>
        </div>
    );
}

type KPIValue = Database["public"]["Tables"]["kpi_values"]["Row"] & {
    kpi?: {
        name: string;
        unit: string;
    };
};

type KPIDefinition = Database["public"]["Tables"]["kpi_definitions"]["Row"];
type Experiment = Database["public"]["Tables"]["experiments"]["Row"];
type TrackingStep = Database["public"]["Tables"]["steps"]["Row"];

interface DataTabProps {
    clientId: string;
}

export function DataTab({ clientId }: DataTabProps) {
    const { data: currentUser } = useCurrentUser();
    const agencyId = currentUser?.agency_id || "";
    const { data: trackingItems, isLoading: trackingLoading } = useTrackingChecklist({ client_id: clientId });
    const { data: accessItems, isLoading: accessLoading } = useAccessValidation({ client_id: clientId });
    const { data: kpiValues, isLoading: kpiLoading, error: kpiError } = useKPIValues(clientId);
    const { data: kpiDefinitions, isLoading: defLoading, error: defError } = useKPIDefinitions(agencyId);
    const { data: experiments, isLoading: expLoading, error: expError } = useExperiments({ client_id: clientId });
    const [createValueOpen, setCreateValueOpen] = useState(false);
    const [editValueOpen, setEditValueOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<KPIValue | null>(null);
    const [createDefOpen, setCreateDefOpen] = useState(false);
    const [editDefOpen, setEditDefOpen] = useState(false);
    const [selectedDef, setSelectedDef] = useState<KPIDefinition | null>(null);
    const [createExperimentOpen, setCreateExperimentOpen] = useState(false);
    const [editExperimentOpen, setEditExperimentOpen] = useState(false);
    const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);

    const experimentsList = experiments || [];
    const kpiValuesList = kpiValues || [];
    const kpiDefinitionsList = kpiDefinitions || [];

    const normalizeStatus = (status: Database["public"]["Enums"]["task_status"] | null): ChecklistStatus => {
        if (status === "done") return "done";
        if (status === "doing" || status === "review") return "in_progress";
        if (status === "blocked") return "pending";
        return "pending";
    };

    const experimentStatus = useMemo(
        () => ({
            planned: { label: "Planejado", className: "bg-muted text-muted-foreground" },
            running: { label: "Em execução", className: "bg-blue-500/10 text-blue-500" },
            completed: { label: "Concluído", className: "bg-emerald-500/10 text-emerald-500" },
            cancelled: { label: "Cancelado", className: "bg-red-500/10 text-red-500" },
        }),
        []
    );

    if (trackingLoading || accessLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Carregando dados de tracking...</p>
            </div>
        );
    }

    const trackingList = (trackingItems || []) as TrackingStep[];
    const accessList = accessItems || [];

    // Calculate tracking progress
    const trackingDone = trackingList.filter((i) => i.status === "done").length;
    const trackingProgress = trackingList.length > 0
        ? Math.round((trackingDone / trackingList.length) * 100)
        : 0;

    // Calculate access progress
    const accessDone = accessList.filter((i) => i.status === "done").length;
    const accessProgress = accessList.length > 0
        ? Math.round((accessDone / accessList.length) * 100)
        : 0;

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
                        <h3 className="font-semibold">Setup de Tracking</h3>
                        <span className="text-sm font-bold text-primary">{trackingProgress}%</span>
                    </div>
                    <Progress value={trackingProgress} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                        {trackingDone} de {trackingList.length} itens concluídos
                    </p>
                </GlassCard>

                <GlassCard className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">Acessos Validados</h3>
                        <span className="text-sm font-bold text-primary">{accessProgress}%</span>
                    </div>
                    <Progress value={accessProgress} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                        {accessDone} de {accessList.length} acessos validados
                    </p>
                </GlassCard>
            </div>

            {/* Tracking Checklist */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2 text-base">
                        <DatabaseIcon className="h-5 w-5 text-primary" />
                        Checklist de Tracking
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-2">
                    {trackingList.length > 0 ? (
                        trackingList.map((item) => (
                            <ChecklistItem
                                key={item.id}
                                item={{
                                    id: item.id,
                                    name: item.name,
                                    status: normalizeStatus(item.status),
                                }}
                            />
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <DatabaseIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p>Nenhum item de tracking configurado.</p>
                        </div>
                    )}
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

            {/* KPI Definitions */}
            <GlassCard>
                <GlassCardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <GlassCardTitle className="flex items-center gap-2 text-base">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            KPIs da Agência
                        </GlassCardTitle>
                        <Button size="sm" className="gap-2" onClick={() => setCreateDefOpen(true)} disabled={!agencyId}>
                            <Plus className="h-4 w-4" />
                            Novo KPI
                        </Button>
                    </div>
                </GlassCardHeader>
                <GlassCardContent className="space-y-3">
                    {defLoading ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando KPIs...
                        </div>
                    ) : defError ? (
                        <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-destructive">
                            Erro ao carregar KPIs. Tente novamente.
                        </div>
                    ) : kpiDefinitionsList.length > 0 ? (
                        kpiDefinitionsList.map((kpi) => (
                            <div
                                key={kpi.id}
                                className="flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="font-medium">{kpi.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Chave: {kpi.key} • Unidade: {kpi.unit || "-"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {kpi.is_default && <Badge variant="secondary">Padrão</Badge>}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="gap-2"
                                        onClick={() => {
                                            setSelectedDef(kpi);
                                            setEditDefOpen(true);
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Editar
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 text-center text-muted-foreground">
                            Nenhum KPI cadastrado. Crie o primeiro KPI para começar.
                        </div>
                    )}
                </GlassCardContent>
            </GlassCard>

            {/* KPI Values */}
            <GlassCard>
                <GlassCardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <GlassCardTitle className="flex items-center gap-2 text-base">
                            <BarChart3 className="h-5 w-5 text-emerald-500" />
                            Métricas do Cliente
                        </GlassCardTitle>
                        <Button size="sm" className="gap-2" onClick={() => setCreateValueOpen(true)} disabled={!agencyId}>
                            <Plus className="h-4 w-4" />
                            Registrar Métrica
                        </Button>
                    </div>
                </GlassCardHeader>
                <GlassCardContent className="space-y-3">
                    {kpiLoading ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando métricas...
                        </div>
                    ) : kpiError ? (
                        <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-destructive">
                            Erro ao carregar métricas. Tente novamente.
                        </div>
                    ) : kpiValuesList.length > 0 ? (
                        kpiValuesList.map((value) => (
                            <div
                                key={value.id}
                                className="flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="font-medium">
                                        {value.kpi?.name || "KPI"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {value.period_start} → {value.period_end}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary">
                                        {Number(value.value).toLocaleString("pt-BR")} {value.kpi?.unit || ""}
                                    </Badge>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="gap-2"
                                        onClick={() => {
                                            setSelectedValue(value as KPIValue);
                                            setEditValueOpen(true);
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Editar
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 text-center text-muted-foreground">
                            Nenhuma métrica registrada para este cliente.
                        </div>
                    )}
                </GlassCardContent>
            </GlassCard>

            {/* Experiments */}
            <GlassCard>
                <GlassCardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <GlassCardTitle className="flex items-center gap-2 text-base">
                            <FlaskConical className="h-5 w-5 text-primary" />
                            Experimentos
                        </GlassCardTitle>
                        <Button size="sm" className="gap-2" onClick={() => setCreateExperimentOpen(true)}>
                            <Plus className="h-4 w-4" />
                            Novo Experimento
                        </Button>
                    </div>
                </GlassCardHeader>
                <GlassCardContent className="space-y-3">
                    {expLoading ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando experimentos...
                        </div>
                    ) : expError ? (
                        <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-destructive">
                            Erro ao carregar experimentos. Tente novamente.
                        </div>
                    ) : experimentsList.length > 0 ? (
                        experimentsList.map((experiment) => {
                            const statusConfig = experimentStatus[experiment.status as keyof typeof experimentStatus];
                            return (
                                <div
                                    key={experiment.id}
                                    className="flex flex-col gap-3 rounded-xl border border-border/50 bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div>
                                        <p className="font-medium">{experiment.name}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {experiment.hypothesis}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge className={statusConfig?.className || "bg-muted text-muted-foreground"}>
                                            {statusConfig?.label || experiment.status}
                                        </Badge>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="gap-2"
                                            onClick={() => {
                                                setSelectedExperiment(experiment as Experiment);
                                                setEditExperimentOpen(true);
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Editar
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-6 text-center text-muted-foreground">
                            Nenhum experimento registrado.
                        </div>
                    )}
                </GlassCardContent>
            </GlassCard>

            {agencyId && (
                <CreateKPIDefinitionDialog
                    open={createDefOpen}
                    onOpenChange={setCreateDefOpen}
                    agencyId={agencyId}
                />
            )}
            {selectedDef && (
                <EditKPIDefinitionDialog
                    open={editDefOpen}
                    onOpenChange={(open) => {
                        setEditDefOpen(open);
                        if (!open) setSelectedDef(null);
                    }}
                    kpi={selectedDef}
                />
            )}
            {agencyId && (
                <CreateKPIValueDialog
                    open={createValueOpen}
                    onOpenChange={setCreateValueOpen}
                    clientId={clientId}
                    agencyId={agencyId}
                />
            )}
            {selectedValue && (
                <EditKPIValueDialog
                    open={editValueOpen}
                    onOpenChange={(open) => {
                        setEditValueOpen(open);
                        if (!open) setSelectedValue(null);
                    }}
                    kpiValue={selectedValue}
                />
            )}
            <CreateExperimentDialog
                open={createExperimentOpen}
                onOpenChange={setCreateExperimentOpen}
                clientId={clientId}
            />
            {selectedExperiment && (
                <EditExperimentDialog
                    open={editExperimentOpen}
                    onOpenChange={(open) => {
                        setEditExperimentOpen(open);
                        if (!open) setSelectedExperiment(null);
                    }}
                    experiment={selectedExperiment}
                />
            )}
        </div>
    );
}

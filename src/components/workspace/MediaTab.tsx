import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import {
    BarChart3,
    DollarSign,
    Users,
    Target,
    Play,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCampaigns } from "@/hooks/useCampaigns";
import type { Database } from "@/types/database";
import { formatCompactCurrency, formatCompactNumber } from "@/lib/utils";
import { useState } from "react";
import { CreateCampaignDialog, EditCampaignDialog } from "@/components/dialogs";

type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];
type CampaignWithMetrics = Campaign & { conversions?: number | null };

const platformColors = {
    meta: "bg-blue-500",
    google: "bg-green-500",
    other: "bg-slate-500",
};

interface CampaignCardProps {
    campaign: CampaignWithMetrics;
    onClick?: () => void;
}

function CampaignCard({ campaign, onClick }: CampaignCardProps) {
    const isActive = campaign.status === "active";
    const budgetDaily = Number(campaign.budget) || 0;
    const spentTotal = Number(campaign.spent) || 0;
    const leadsCount = campaign.conversions ?? 0;
    const cpl = leadsCount > 0 ? spentTotal / leadsCount : 0;

    const budgetProgress = budgetDaily > 0
        ? Math.min((spentTotal / (budgetDaily * 7)) * 100, 100)
        : 0;

    return (
        <div
            className="p-4 rounded-xl border border-border/50 bg-card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    onClick?.();
                }
            }}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${platformColors[campaign.platform as keyof typeof platformColors] || platformColors.other}`} />
                    <span className="text-xs text-muted-foreground uppercase">
                        {campaign.platform}
                    </span>
                </div>
                <StatusBadge
                    status={isActive ? "ok" : campaign.status === "paused" ? "warn" : "risk"}
                    size="sm"
                >
                    {isActive ? "Ativa" : campaign.status === "paused" ? "Pausada" : "Rascunho"}
                </StatusBadge>
            </div>

            <h4 className="font-semibold text-sm mb-1">{campaign.name}</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-2 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Users className="h-3 w-3" />
                        Leads
                    </div>
                    <p className="font-bold">{leadsCount}</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Target className="h-3 w-3" />
                        CPL
                    </div>
                    <p className="font-bold">
                        {cpl > 0 ? `R$${cpl.toFixed(2)}` : "-"}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                        Budget: R${budgetDaily}/dia
                    </span>
                    <span className="font-medium">
                        Gasto: R${spentTotal.toFixed(2)}
                    </span>
                </div>
                <Progress value={budgetProgress} className="h-1.5" />
            </div>
        </div>
    );
}

interface MediaTabProps {
    clientId: string;
}

export function MediaTab({ clientId }: MediaTabProps) {
    const { data: campaigns, isLoading } = useCampaigns({ client_id: clientId });
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Carregando campanhas...</p>
            </div>
        );
    }

    const campaignsList = (campaigns || []) as CampaignWithMetrics[];
    const activeCampaigns = campaignsList.filter((campaign) => campaign.status === "active");
    const totalSpent = campaignsList.reduce((acc, campaign) => acc + (Number(campaign.spent) || 0), 0);
    const totalLeads = campaignsList.reduce((acc, campaign) => acc + (campaign.conversions ?? 0), 0);
    const avgCPL = totalLeads > 0 ? totalSpent / totalLeads : 0;
    const campaignsCount = campaignsList.length;

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10">
                            <BarChart3 className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                <span className="sm:hidden">{formatCompactNumber(campaignsCount)}</span>
                                <span className="hidden sm:inline">{campaignsCount}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">Campanhas</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/10">
                            <Play className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{activeCampaigns.length}</p>
                            <p className="text-xs text-muted-foreground">Ativas</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-500/10">
                            <DollarSign className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                <span className="sm:hidden">{formatCompactCurrency(totalSpent)}</span>
                                <span className="hidden sm:inline">R${totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">Investido</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-500/10">
                            <Target className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                <span className="sm:hidden">{formatCompactCurrency(avgCPL)}</span>
                                <span className="hidden sm:inline">R${avgCPL.toFixed(2)}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">CPL Médio</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Campaigns Grid */}
            <GlassCard>
                <GlassCardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <GlassCardTitle className="flex items-center gap-2 text-base">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Campanhas
                        </GlassCardTitle>
                        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                            Nova Campanha
                        </Button>
                    </div>
                </GlassCardHeader>
                <GlassCardContent>
                    {campaignsList.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                            {campaignsList.map((campaign) => (
                                <CampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                    onClick={() => {
                                        setSelectedCampaign(campaign);
                                        setIsEditOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-30" />
                            <p>Nenhuma campanha encontrada para este cliente.</p>
                        </div>
                    )}
                </GlassCardContent>
            </GlassCard>

            <CreateCampaignDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                clientId={clientId}
            />
            <EditCampaignDialog
                open={isEditOpen}
                onOpenChange={(open) => {
                    setIsEditOpen(open);
                    if (!open) setSelectedCampaign(null);
                }}
                campaign={selectedCampaign}
            />
        </div>
    );
}

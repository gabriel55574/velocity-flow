import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { mockCampaigns, Campaign } from "@/data/mockData";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Target,
    Pause,
    Play,
    Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";

const platformColors = {
    meta: "bg-blue-500",
    google: "bg-green-500",
    other: "bg-slate-500",
};

interface CampaignCardProps {
    campaign: Campaign;
}

function CampaignCard({ campaign }: CampaignCardProps) {
    const isActive = campaign.status === "active";
    const budgetProgress = campaign.budgetDaily > 0
        ? Math.min((campaign.spent / (campaign.budgetDaily * 7)) * 100, 100)
        : 0;

    return (
        <div className="p-4 rounded-xl border border-border/50 bg-card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${platformColors[campaign.platform]}`} />
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
            <p className="text-xs text-muted-foreground mb-3">{campaign.objective}</p>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-2 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Users className="h-3 w-3" />
                        Leads
                    </div>
                    <p className="font-bold">{campaign.leads}</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Target className="h-3 w-3" />
                        CPL
                    </div>
                    <p className="font-bold">
                        {campaign.cpl > 0 ? `R$${campaign.cpl.toFixed(2)}` : "-"}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                        Budget: R${campaign.budgetDaily}/dia
                    </span>
                    <span className="font-medium">
                        Gasto: R${campaign.spent}
                    </span>
                </div>
                <Progress value={budgetProgress} className="h-1.5" />
            </div>
        </div>
    );
}

export function MediaTab() {
    const activeCampaigns = mockCampaigns.filter(c => c.status === "active");
    const totalSpent = mockCampaigns.reduce((acc, c) => acc + c.spent, 0);
    const totalLeads = mockCampaigns.reduce((acc, c) => acc + c.leads, 0);
    const avgCPL = totalLeads > 0 ? totalSpent / totalLeads : 0;

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10">
                            <BarChart3 className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{mockCampaigns.length}</p>
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
                            <p className="text-2xl font-bold">R${totalSpent}</p>
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
                            <p className="text-2xl font-bold">R${avgCPL.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">CPL Médio</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Campaigns Grid */}
            <GlassCard>
                <GlassCardHeader>
                    <div className="flex items-center justify-between">
                        <GlassCardTitle className="flex items-center gap-2 text-base">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Campanhas
                        </GlassCardTitle>
                        <Button size="sm">
                            Nova Campanha
                        </Button>
                    </div>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        {mockCampaigns.map((campaign) => (
                            <CampaignCard key={campaign.id} campaign={campaign} />
                        ))}
                    </div>
                </GlassCardContent>
            </GlassCard>
        </div>
    );
}

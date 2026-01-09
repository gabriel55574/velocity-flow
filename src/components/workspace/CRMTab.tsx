import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockLeads, mockMessageTemplates, Lead } from "@/data/mockData";
import {
    MessageSquare,
    Phone,
    User,
    Clock,
    Instagram,
    Globe,
    Users,
    MessageCircle,
    Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const stageConfig = {
    new: { label: "Novo", color: "bg-blue-500" },
    qualified: { label: "Qualificado", color: "bg-purple-500" },
    scheduled: { label: "Agendado", color: "bg-amber-500" },
    showed: { label: "Compareceu", color: "bg-emerald-500" },
    closed: { label: "Fechado", color: "bg-green-600" },
    lost: { label: "Perdido", color: "bg-red-500" },
};

const sourceIcons = {
    instagram: Instagram,
    ads: Globe,
    google: Globe,
    referral: Users,
    whatsapp: MessageCircle,
};

interface LeadCardProps {
    lead: Lead;
}

function LeadCard({ lead }: LeadCardProps) {
    const SourceIcon = sourceIcons[lead.source] || Globe;

    return (
        <div className="p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{lead.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Phone className="h-3 w-3" />
                        <span>{lead.phone}</span>
                    </div>
                </div>
                <SourceIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            {lead.notes && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {lead.notes}
                </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                    Último contato: {new Date(lead.lastContactAt).toLocaleDateString('pt-BR')}
                </span>
            </div>
        </div>
    );
}

interface PipelineColumnProps {
    stage: keyof typeof stageConfig;
    leads: Lead[];
}

function PipelineColumn({ stage, leads }: PipelineColumnProps) {
    const config = stageConfig[stage];

    return (
        <div className="flex-1 min-w-[250px]">
            <div className={`flex items-center gap-2 p-3 rounded-t-xl ${config.color} text-white`}>
                <span className="font-semibold text-sm">{config.label}</span>
                <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {leads.length}
                </span>
            </div>
            <div className="p-3 rounded-b-xl bg-secondary/30 min-h-[300px] space-y-2">
                {leads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                ))}
                {leads.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                        Nenhum lead
                    </div>
                )}
            </div>
        </div>
    );
}

interface MessageTemplateCardProps {
    template: {
        id: string;
        name: string;
        category: string;
        content: string;
    };
}

function MessageTemplateCard({ template }: MessageTemplateCardProps) {
    const { toast } = useToast();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(template.content);
        toast({
            title: "Copiado!",
            description: "Mensagem copiada para a área de transferência",
        });
    };

    return (
        <div className="p-4 rounded-xl bg-card border border-border/50">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{template.name}</h4>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-3">
                {template.content}
            </p>
        </div>
    );
}

export function CRMTab() {
    const stages: (keyof typeof stageConfig)[] = [
        "new", "qualified", "scheduled", "showed", "closed", "lost"
    ];

    return (
        <div className="space-y-6">
            {/* Pipeline Summary */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2 text-base">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Pipeline de Leads
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="grid grid-cols-6 gap-2">
                        {stages.map((stage) => {
                            const count = mockLeads.filter(l => l.stage === stage).length;
                            const config = stageConfig[stage];
                            return (
                                <div key={stage} className="text-center">
                                    <div className={`h-2 rounded-full ${config.color} mb-2`} />
                                    <p className="text-lg font-bold">{count}</p>
                                    <p className="text-xs text-muted-foreground">{config.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </GlassCardContent>
            </GlassCard>

            {/* Pipeline Board */}
            <div className="overflow-x-auto">
                <div className="flex gap-4 min-w-max">
                    {stages.map((stage) => (
                        <PipelineColumn
                            key={stage}
                            stage={stage}
                            leads={mockLeads.filter(l => l.stage === stage)}
                        />
                    ))}
                </div>
            </div>

            {/* Message Templates */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="flex items-center gap-2 text-base">
                        <MessageCircle className="h-5 w-5 text-emerald-500" />
                        Scripts WhatsApp
                    </GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mockMessageTemplates.map((template) => (
                            <MessageTemplateCard key={template.id} template={template} />
                        ))}
                    </div>
                </GlassCardContent>
            </GlassCard>
        </div>
    );
}

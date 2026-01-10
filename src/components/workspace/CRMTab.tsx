import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
    MessageSquare,
    Phone,
    User,
    Clock,
    Instagram,
    Globe,
    Users,
    MessageCircle,
    Copy,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLeads } from "@/hooks/useLeads";
import { useMessageTemplates } from "@/hooks/useMessageTemplates";
import { Database } from "@/types/database";

type Lead = Database["public"]["Tables"]["crm_leads"]["Row"];
type MessageTemplate = Database["public"]["Tables"]["message_templates"]["Row"];

const stageConfig = {
    cold: { label: "Frio", color: "bg-blue-300" },
    warm: { label: "Morno", color: "bg-orange-400" },
    hot: { label: "Quente", color: "bg-red-500" },
    qualified: { label: "Qualificado", color: "bg-purple-500" },
    proposal: { label: "Proposta", color: "bg-emerald-500" },
    closed: { label: "Fechado", color: "bg-green-600" },
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
    const SourceIcon = (sourceIcons[lead.source as keyof typeof sourceIcons] || Globe) as React.ElementType;

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
                    Atualizado: {lead.updated_at ? new Date(lead.updated_at).toLocaleDateString('pt-BR') : '-'}
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
    template: MessageTemplate;
}

function MessageTemplateCard({ template }: MessageTemplateCardProps) {
    const { toast } = useToast();

    const copyToClipboard = () => {
        if (!template.content) return;
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

interface CRMTabProps {
    clientId: string;
}

export function CRMTab({ clientId }: CRMTabProps) {
    const { data: leads, isLoading: leadsLoading } = useLeads({ client_id: clientId });
    const { data: templates, isLoading: templatesLoading } = useMessageTemplates({ client_id: clientId });

    const stages: (keyof typeof stageConfig)[] = [
        "cold", "warm", "hot", "qualified", "proposal", "closed"
    ];

    if (leadsLoading || templatesLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Carregando dados do CRM...</p>
            </div>
        );
    }

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
                            const count = leads?.filter(l => l.stage === stage).length || 0;
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
                            leads={leads?.filter(l => l.stage === stage) || []}
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
                    {templates && templates.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {templates.map((template) => (
                                <MessageTemplateCard key={template.id} template={template} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-30" />
                            <p>Nenhum script encontrado para este cliente.</p>
                        </div>
                    )}
                </GlassCardContent>
            </GlassCard>
        </div>
    );
}

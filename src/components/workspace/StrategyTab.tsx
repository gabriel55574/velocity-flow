import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { mockQFD } from "@/data/mockData";
import {
    Target,
    Sparkles,
    Layers,
    Wrench,
    ChevronDown,
    ChevronRight,
    CheckCircle2
} from "lucide-react";
import { useState } from "react";

interface SectionProps {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false }: SectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <GlassCard>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center gap-3 text-left"
            >
                <div className="p-2 rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="flex-1 font-semibold">{title}</span>
                {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
            </button>
            {isOpen && (
                <GlassCardContent className="pt-0">
                    {children}
                </GlassCardContent>
            )}
        </GlassCard>
    );
}

interface QFDSectionProps {
    title: string;
    items: string[];
    color: string;
}

function QFDSection({ title, items, color }: QFDSectionProps) {
    return (
        <div className={`p-4 rounded-xl border ${color}`}>
            <h4 className="font-semibold text-sm mb-3">{title}</h4>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function StrategyTab() {
    return (
        <div className="space-y-4">
            {/* QFD - Arquitetura de Mensagem */}
            <CollapsibleSection
                title="Arquitetura de Mensagem (QFD)"
                icon={Target}
                defaultOpen={true}
            >
                <div className="grid md:grid-cols-3 gap-4">
                    <QFDSection
                        title={mockQFD.decorado.title}
                        items={mockQFD.decorado.items}
                        color="bg-purple-500/5 border-purple-500/20"
                    />
                    <QFDSection
                        title={mockQFD.metodo.title}
                        items={mockQFD.metodo.items}
                        color="bg-blue-500/5 border-blue-500/20"
                    />
                    <QFDSection
                        title={mockQFD.procedimentos.title}
                        items={mockQFD.procedimentos.items}
                        color="bg-emerald-500/5 border-emerald-500/20"
                    />
                </div>
            </CollapsibleSection>

            {/* Kickoff */}
            <CollapsibleSection title="Kickoff" icon={Sparkles}>
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-secondary/50">
                            <h4 className="font-medium text-sm mb-2">Metas Definidas</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• 100 leads/mês no primeiro trimestre</li>
                                <li>• Taxa de agendamento: 40%</li>
                                <li>• Show rate: 70%</li>
                                <li>• Conversão: 30%</li>
                            </ul>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/50">
                            <h4 className="font-medium text-sm mb-2">Capacidade</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• Agenda: 40 horários/semana</li>
                                <li>• Ticket médio: R$ 2.500</li>
                                <li>• Procedimentos principais: 3</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CollapsibleSection>

            {/* Diagnóstico 360 */}
            <CollapsibleSection title="Diagnóstico 360" icon={Layers}>
                <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-secondary/50">
                            <h4 className="font-medium text-sm mb-2">Presença Digital</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Instagram</span>
                                    <span className="font-medium text-emerald-500">Ativo</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Google Meu Negócio</span>
                                    <span className="font-medium text-emerald-500">Ativo</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Site</span>
                                    <span className="font-medium text-amber-500">Parcial</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/50">
                            <h4 className="font-medium text-sm mb-2">Concorrência</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• 3 concorrentes diretos mapeados</li>
                                <li>• Posicionamento: Premium</li>
                                <li>• Diferencial: Planejamento facial</li>
                            </ul>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/50">
                            <h4 className="font-medium text-sm mb-2">Oportunidades</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• Criar conteúdo educativo</li>
                                <li>• Explorar depoimentos</li>
                                <li>• Campanhas de remarketing</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CollapsibleSection>

            {/* Blueprint 30/60/90 */}
            <CollapsibleSection title="Blueprint 30/60/90" icon={Wrench}>
                <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                            <h4 className="font-semibold text-sm mb-2 text-blue-600">30 dias</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• Setup completo de tracking</li>
                                <li>• CRM e scripts WhatsApp</li>
                                <li>• 10 criativos aprovados</li>
                                <li>• Go-live campanhas</li>
                            </ul>
                        </div>
                        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                            <h4 className="font-semibold text-sm mb-2 text-purple-600">60 dias</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• 80 leads gerados</li>
                                <li>• Otimização de campanhas</li>
                                <li>• Rotina de conteúdo ativa</li>
                                <li>• Primeiro MBR completo</li>
                            </ul>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                            <h4 className="font-semibold text-sm mb-2 text-emerald-600">90 dias</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                                <li>• 100+ leads/mês estabilizado</li>
                                <li>• CPL otimizado {'<'} R$25</li>
                                <li>• Processo de escala</li>
                                <li>• Avaliação de renovação</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CollapsibleSection>
        </div>
    );
}

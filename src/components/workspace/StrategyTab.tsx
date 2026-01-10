import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import {
    Target,
    Sparkles,
    Layers,
    Wrench,
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { useState } from "react";
import { useProjectModules } from "@/hooks/useWorkflows";

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

interface StrategyTabProps {
    clientId: string;
}

export function StrategyTab({ clientId }: StrategyTabProps) {
    const { data: modules, isLoading } = useProjectModules({ client_id: clientId });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Carregando estratégia...</p>
            </div>
        );
    }

    if (!modules || modules.length === 0) {
        return (
            <div className="text-center py-24 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Nenhuma informação estratégica definida para este cliente.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {modules.map((module: any) => (
                <CollapsibleSection
                    key={module.id}
                    title={module.name}
                    icon={Target}
                    defaultOpen={true}
                >
                    <div className="grid md:grid-cols-1 gap-4">
                        <div className="p-4 rounded-xl border bg-secondary/30">
                            {module.description && (
                                <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                            )}
                            {module.steps && module.steps.length > 0 && (
                                <ul className="space-y-2">
                                    {(module.steps as any[]).map((step: any) => (
                                        <li key={step.id} className="flex items-start gap-2 text-sm">
                                            <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${step.status === 'done' ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                                            <span>{step.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </CollapsibleSection>
            ))}
        </div>
    );
}

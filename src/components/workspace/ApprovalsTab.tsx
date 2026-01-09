import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockApprovals, Approval } from "@/data/mockData";
import {
    CheckSquare,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    Image,
    FileText,
    DollarSign,
    Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

const typeIcons = {
    creative: Image,
    copy: FileText,
    plan: Calendar,
    budget: DollarSign,
    other: FileText,
};

interface ApprovalCardProps {
    approval: Approval;
}

function ApprovalCard({ approval }: ApprovalCardProps) {
    const TypeIcon = typeIcons[approval.type] || FileText;
    const isPending = approval.status === "pending";
    const isOverdue = isPending && new Date(approval.slaDueAt) < new Date();

    return (
        <div className={`p-4 rounded-xl border ${isOverdue
                ? "border-red-500/30 bg-red-500/5"
                : "border-border/50 bg-card"
            }`}>
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${approval.status === "approved"
                        ? "bg-emerald-500/10"
                        : approval.status === "rejected"
                            ? "bg-red-500/10"
                            : "bg-amber-500/10"
                    }`}>
                    <TypeIcon className={`h-5 w-5 ${approval.status === "approved"
                            ? "text-emerald-500"
                            : approval.status === "rejected"
                                ? "text-red-500"
                                : "text-amber-500"
                        }`} />
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{approval.title}</h4>
                        <StatusBadge
                            status={
                                approval.status === "approved"
                                    ? "ok"
                                    : approval.status === "rejected"
                                        ? "risk"
                                        : "warn"
                            }
                            size="sm"
                        >
                            {approval.status === "approved"
                                ? "Aprovado"
                                : approval.status === "rejected"
                                    ? "Rejeitado"
                                    : "Pendente"}
                        </StatusBadge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                        {approval.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                                {isPending
                                    ? `Vence: ${new Date(approval.slaDueAt).toLocaleDateString('pt-BR')}`
                                    : `Solicitado: ${new Date(approval.requestedAt).toLocaleDateString('pt-BR')}`
                                }
                            </span>
                        </div>
                        <span>Por: {approval.requestedBy.name}</span>
                    </div>
                </div>

                {isPending && (
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-red-500">
                            <XCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                            <CheckCircle2 className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export function ApprovalsTab() {
    const pending = mockApprovals.filter(a => a.status === "pending");
    const approved = mockApprovals.filter(a => a.status === "approved");
    const rejected = mockApprovals.filter(a => a.status === "rejected");

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
                <GlassCard className="p-4 text-center">
                    <Clock className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{pending.length}</p>
                    <p className="text-xs text-muted-foreground">Pendentes</p>
                </GlassCard>
                <GlassCard className="p-4 text-center">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{approved.length}</p>
                    <p className="text-xs text-muted-foreground">Aprovadas</p>
                </GlassCard>
                <GlassCard className="p-4 text-center">
                    <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{rejected.length}</p>
                    <p className="text-xs text-muted-foreground">Rejeitadas</p>
                </GlassCard>
            </div>

            {/* Pending Approvals */}
            {pending.length > 0 && (
                <GlassCard>
                    <GlassCardHeader>
                        <GlassCardTitle className="flex items-center gap-2 text-base">
                            <CheckSquare className="h-5 w-5 text-amber-500" />
                            Aguardando Aprovação ({pending.length})
                        </GlassCardTitle>
                    </GlassCardHeader>
                    <GlassCardContent className="space-y-3">
                        {pending.map((approval) => (
                            <ApprovalCard key={approval.id} approval={approval} />
                        ))}
                    </GlassCardContent>
                </GlassCard>
            )}

            {/* History */}
            <GlassCard>
                <GlassCardHeader>
                    <GlassCardTitle className="text-base">Histórico</GlassCardTitle>
                </GlassCardHeader>
                <GlassCardContent className="space-y-3">
                    {[...approved, ...rejected].map((approval) => (
                        <ApprovalCard key={approval.id} approval={approval} />
                    ))}
                </GlassCardContent>
            </GlassCard>
        </div>
    );
}

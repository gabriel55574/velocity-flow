import { StatusBadge } from "@/components/ui/status-badge";
import { CheckCircle2, XCircle, Lock } from "lucide-react";

interface GateStatusProps {
    title: string;
    status: "pass" | "fail";
    conditions: string[];
}

export function GateStatus({ title, status, conditions }: GateStatusProps) {
    return (
        <div
            className={`p-4 rounded-xl border ${status === "pass"
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-red-500/5 border-red-500/20"
                }`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {status === "pass" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                        <Lock className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium text-sm">{title}</span>
                </div>
                <StatusBadge status={status === "pass" ? "ok" : "risk"} size="sm">
                    {status === "pass" ? "Aprovado" : "Bloqueado"}
                </StatusBadge>
            </div>

            <div className="space-y-1">
                {conditions.map((condition, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        {status === "pass" ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        ) : (
                            <XCircle className="h-3 w-3 text-red-400" />
                        )}
                        <span>{condition}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

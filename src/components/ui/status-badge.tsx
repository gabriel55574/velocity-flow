import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
  {
    variants: {
      status: {
        ok: "bg-ok/15 text-ok border border-ok/20",
        warn: "bg-warn/15 text-warn border border-warn/20",
        risk: "bg-risk/15 text-risk border border-risk/20",
        blocked: "bg-blocked/15 text-blocked border border-blocked/20",
        inprogress: "bg-inprogress/15 text-inprogress border border-inprogress/20",
        done: "bg-done/15 text-done border border-done/20",
        neutral: "bg-muted text-muted-foreground border border-border",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1.5",
      },
    },
    defaultVariants: {
      status: "neutral",
      size: "md",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  dot?: boolean;
}

export function StatusBadge({
  className,
  status,
  size,
  dot = true,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ status, size }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            status === "ok" && "bg-ok",
            status === "warn" && "bg-warn",
            status === "risk" && "bg-risk",
            status === "blocked" && "bg-blocked",
            status === "inprogress" && "bg-inprogress animate-pulse",
            status === "done" && "bg-done",
            status === "neutral" && "bg-muted-foreground"
          )}
        />
      )}
      {children}
    </span>
  );
}

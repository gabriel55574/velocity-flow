import type { Database } from "@/types/database";

type Step = Database["public"]["Tables"]["steps"]["Row"] & {
  checklist_items?: Database["public"]["Tables"]["checklist_items"]["Row"][];
};
type GateStatus = Database["public"]["Enums"]["gate_status"];

interface ValidateGateOptions {
  currentStatus?: GateStatus | null;
}

export function validateGate(steps: Step[], options: ValidateGateOptions = {}) {
  const issues: string[] = [];
  const anyBlocked = steps.some((step) => step.status === "blocked");

  steps.forEach((step) => {
    if (step.status !== "done") {
      issues.push(`Step pendente: ${step.name}`);
    }

    (step.checklist_items || []).forEach((item) => {
      if (!item.is_completed) {
        issues.push(`Checklist: ${item.name}`);
      }
    });
  });

  let status: GateStatus = "pending";
  if (anyBlocked) {
    status = "blocked";
  } else if (steps.length > 0 && issues.length === 0) {
    status = "passed";
  } else if (options.currentStatus === "failed") {
    status = "failed";
  }

  return {
    status,
    issues,
  };
}

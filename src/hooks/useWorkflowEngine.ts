import { useMemo } from "react";
import type { Database } from "@/types/database";
import { validateGate } from "@/lib/workflowEngine";

type Step = Database["public"]["Tables"]["steps"]["Row"] & {
  checklist_items?: Database["public"]["Tables"]["checklist_items"]["Row"][];
};

export function useValidateGate(steps: Step[], currentStatus?: Database["public"]["Enums"]["gate_status"] | null) {
  return useMemo(() => validateGate(steps, { currentStatus }), [steps, currentStatus]);
}

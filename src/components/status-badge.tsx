import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import type {
  ChatStatus,
  FileProcessingStatus,
  FlowchartStatus,
  ReportStatus,
} from "@/lib/types";

type Status = FileProcessingStatus | ReportStatus | FlowchartStatus | ChatStatus;

const STYLES: Record<string, { className: string; icon: React.ElementType; label: string }> = {
  PENDING: { className: "bg-muted text-muted-foreground border-transparent", icon: Circle, label: "Pending" },
  PROCESSING: { className: "bg-info/15 text-info border-transparent", icon: Loader2, label: "Processing" },
  GENERATING: { className: "bg-info/15 text-info border-transparent", icon: Loader2, label: "Generating" },
  COMPLETED: { className: "bg-success/15 text-success border-transparent", icon: CheckCircle2, label: "Completed" },
  READY: { className: "bg-success/15 text-success border-transparent", icon: CheckCircle2, label: "Ready" },
  ACTIVE: { className: "bg-success/15 text-success border-transparent", icon: CheckCircle2, label: "Active" },
  DRAFT: { className: "bg-muted text-muted-foreground border-transparent", icon: Circle, label: "Draft" },
  FAILED: { className: "bg-destructive/15 text-destructive border-transparent", icon: XCircle, label: "Failed" },
  ARCHIVED: { className: "bg-muted text-muted-foreground border-transparent", icon: Circle, label: "Archived" },
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const style = STYLES[status] ?? STYLES.PENDING;
  const Icon = style.icon;
  const spinning = status === "PROCESSING" || status === "GENERATING";
  return (
    <Badge variant="outline" className={cn("gap-1 font-medium", style.className, className)}>
      <Icon className={cn("h-3 w-3", spinning && "animate-spin")} />
      {style.label}
    </Badge>
  );
}

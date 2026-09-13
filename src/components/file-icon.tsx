import {
  FileArchive,
  FileImage,
  FileText,
  File as FileIconLucide,
  FileType2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function iconFor(mimeType: string) {
  if (mimeType.startsWith("image/")) return { Icon: FileImage, className: "text-purple" };
  if (mimeType === "application/pdf") return { Icon: FileText, className: "text-destructive" };
  if (mimeType.includes("word") || mimeType.includes("document")) return { Icon: FileType2, className: "text-info" };
  if (mimeType === "text/plain") return { Icon: FileText, className: "text-muted-foreground" };
  if (mimeType.includes("zip") || mimeType.includes("archive")) return { Icon: FileArchive, className: "text-warning" };
  return { Icon: FileIconLucide, className: "text-muted-foreground" };
}

export function FileIcon({ mimeType, className }: { mimeType: string; className?: string }) {
  const { Icon, className: colorClass } = iconFor(mimeType);
  return <Icon className={cn("h-4 w-4", colorClass, className)} />;
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter, notFound } from "next/navigation";
import { ArrowLeft, Download, Loader2, Pencil, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageLoader } from "@/components/ui/page-loader";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useReport, useUpdateReport, useDeleteReport } from "@/hooks/use-project-reports";

function renderMarkdown(content: string) {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i} className="mt-5 text-lg font-semibold">{line.slice(3)}</h2>;
    if (line.startsWith("# ")) return <h1 key={i} className="mt-2 text-2xl font-bold">{line.slice(2)}</h1>;
    if (line.startsWith("- ")) return <li key={i} className="ml-5 list-disc text-sm leading-relaxed">{line.slice(2)}</li>;
    if (!line.trim()) return <div key={i} className="h-2" />;
    return <p key={i} className="text-sm leading-relaxed text-foreground/90">{line}</p>;
  });
}

export default function ReportDetailPage() {
  const { projectId, reportId } = useParams<{ projectId: string; reportId: string }>();
  const { report, loading } = useReport(projectId, reportId);
  const { updateReport } = useUpdateReport();
  const { deleteReport } = useDeleteReport();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(report?.content ?? "");
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!loading && !report) {
    notFound();
  }

  if (loading || !report) {
    return <PageLoader />;
  }

  const isGenerating = report.properties.status === "GENERATING";

  async function handleSave() {
    if (!report) return;
    try {
      await updateReport(report.id, { content: draft });
      setEditing(false);
      toast.success("Report saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save report");
    }
  }

  async function handleDelete() {
    if (!report) return;
    try {
      await deleteReport(report.id);
      router.push(`/projects/${projectId}/reports`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete report");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="-ml-2" asChild>
          <Link href={`/projects/${projectId}/reports`}>
            <ArrowLeft className="h-4 w-4" />
            Back to reports
          </Link>
        </Button>
        <div className="flex gap-2">
          {!isGenerating && !report.properties.generatedByAI && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDraft(report.content);
                setEditing((v) => !v);
              }}
            >
              <Pencil className="h-4 w-4" />
              {editing ? "Cancel" : "Edit"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={isGenerating}
            onClick={() => toast("Download started (mock)", { description: `${report.title}.${report.format.toLowerCase()}` })}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="text-destructive" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{report.title}</h1>
        <StatusBadge status={report.properties.status} />
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        {report.properties.generatedByAI && (
          <>
            <Sparkles className="h-3.5 w-3.5 text-primary" /> AI-generated
          </>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        {isGenerating ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating report…
            </div>
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : editing ? (
          <div className="flex flex-col gap-3">
            <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={16} />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">{renderMarkdown(report.content)}</div>
        )}
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this report?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useFlowchart, useUpdateFlowchart } from "@/hooks/use-project-flowcharts";

const FlowBuilder = dynamic(() => import("@/components/flow/FlowBuilder"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <Skeleton className="h-full w-full" />
    </div>
  ),
});

// How long to wait after the graph stops changing before saving - React
// Flow fires onChange on every drag frame, so saving immediately would
// mean one mutation per mouse-move.
const SAVE_DEBOUNCE_MS = 600;

export default function FlowchartEditorPage() {
  const { projectId, flowchartId } = useParams<{ projectId: string; flowchartId: string }>();
  const { flowchart, loading } = useFlowchart(projectId, flowchartId);
  const { updateFlowchart } = useUpdateFlowchart();

  const [name, setName] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (flowchart) setName(flowchart.name);
  }, [flowchart]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  if (!loading && !flowchart) {
    notFound();
  }

  const handleChange = useCallback(
    (data: string) => {
      if (!flowchart) return;
      setSaveState("saving");
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await updateFlowchart(flowchart.id, { data });
          setSaveState("saved");
        } catch (err) {
          setSaveState("idle");
          toast.error(err instanceof Error ? err.message : "Failed to save flowchart");
        }
      }, SAVE_DEBOUNCE_MS);
    },
    [flowchart, updateFlowchart],
  );

  async function handleRename() {
    if (!flowchart || !name.trim() || name.trim() === flowchart.name) return;
    try {
      await updateFlowchart(flowchart.id, { name: name.trim() });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to rename flowchart");
    }
  }

  if (loading || !flowchart) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  const isGenerating = flowchart.status === "GENERATING";

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/projects/${projectId}/flowcharts`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleRename}
            className="h-8 w-56 border-transparent bg-transparent px-1 text-base font-semibold hover:border-border focus-visible:border-border"
          />
          <StatusBadge status={flowchart.status} />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {saveState === "saving" && (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
            </>
          )}
          {saveState === "saved" && (
            <>
              <Check className="h-3.5 w-3.5 text-success" /> Saved
            </>
          )}
        </div>
      </div>

      <div className="relative flex-1">
        {isGenerating ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">The AI is drafting this flowchart…</p>
          </div>
        ) : (
          <FlowBuilder initialData={flowchart.data} onChange={handleChange} />
        )}
      </div>
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import type { Flowchart } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/status-badge";
import { Skeleton } from "@/components/ui/skeleton";

const FlowBuilder = dynamic(() => import("@/components/flow/FlowBuilder"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <Skeleton className="h-full w-full" />
    </div>
  ),
});

export default function FlowchartEditorPage() {
  const { projectId, flowchartId } = useParams<{ projectId: string; flowchartId: string }>();
  // TODO(graphql): empty placeholder until the GraphQL hook is wired.
  const flowcharts: Flowchart[] = [];
  const flowchart = flowcharts.find((f) => f.id === flowchartId);
  const noop = (..._args: unknown[]): void => {};
  const renameFlowchart = noop;
  const saveFlowchartData = noop;

  const [name, setName] = useState(flowchart?.name ?? "");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  if (!flowchart) {
    notFound();
  }

  const handleChange = useCallback(
    (data: string) => {
      setSaveState("saving");
      saveFlowchartData(flowchart.id, data);
      window.setTimeout(() => setSaveState("saved"), 400);
    },
    [flowchart.id, saveFlowchartData],
  );

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
            onBlur={() => name.trim() && renameFlowchart(flowchart.id, name.trim())}
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

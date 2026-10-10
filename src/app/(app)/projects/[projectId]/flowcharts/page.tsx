"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Plus, Sparkles, User as UserIcon, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { PageLoader } from "@/components/ui/page-loader";
import { toast } from "sonner";
import { useGetChats } from "@/hooks/use-project-chats";
import { useCreateFlowchart, useFlowcharts } from "@/hooks/use-project-flowcharts";

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function FlowchartsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { flowcharts: fetchedFlowcharts, loading } = useFlowcharts(projectId);
  const { chats } = useGetChats(projectId);
  const { createFlowchart, loading: creating } = useCreateFlowchart();
  const router = useRouter();

  const flowcharts = [...fetchedFlowcharts].sort(
    (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt),
  );

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [sourceChatId, setSourceChatId] = useState("none");

  async function handleManualCreate() {
    try {
      const flow = await createFlowchart({
        projectId,
        name: name.trim() || "Untitled flowchart",
        data: { nodes: [], edges: [] },
      });
      if (!flow) return;
      setOpen(false);
      setName("");
      router.push(`/projects/${projectId}/flowcharts/${flow.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create flowchart");
    }
  }

  function handleAICreate() {
    toast("AI flowchart generation isn't available yet", {
      description: "There's no backend endpoint for it - start blank for now.",
    });
  }

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Flowcharts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Map out processes visually, by hand or with AI.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          New flowchart
        </Button>
      </div>

      {flowcharts.length === 0 ? (
        <Empty className="mt-6 border border-dashed border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Workflow className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No flowcharts yet</EmptyTitle>
            <EmptyDescription>Create your first flowchart to map out a process.</EmptyDescription>
          </EmptyHeader>
          <Button variant="outline" onClick={() => setOpen(true)}>
            New flowchart
          </Button>
        </Empty>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {flowcharts.map((flow) => (
            <Link key={flow.id} href={`/projects/${projectId}/flowcharts/${flow.id}`}>
              <Card className="h-full border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{flow.name}</h3>
                  <StatusBadge status={flow.status} />
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  {flow.generatedByAI ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-primary" /> AI-generated
                    </>
                  ) : (
                    <>
                      <UserIcon className="h-3.5 w-3.5" /> Created manually
                    </>
                  )}
                  <span>· {timeAgo(flow.updatedAt)}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New flowchart</DialogTitle>
          </DialogHeader>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Flowchart name" autoFocus />
          <Tabs defaultValue="manual" className="mt-2">
            <TabsList>
              <TabsTrigger value="manual">Start blank</TabsTrigger>
              <TabsTrigger value="ai">
                <Sparkles className="h-3.5 w-3.5" />
                Generate with AI
              </TabsTrigger>
            </TabsList>
            <TabsContent value="manual" className="mt-4">
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleManualCreate} disabled={creating}>Create</Button>
              </DialogFooter>
            </TabsContent>
            <TabsContent value="ai" className="mt-4 flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Coming soon</span> - there&apos;s no
                backend support for AI-generated flowcharts yet.
              </p>
              <div className="grid gap-2">
                <Select value={sourceChatId} onValueChange={setSourceChatId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Base on a chat (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific chat</SelectItem>
                    {chats.map((chat) => (
                      <SelectItem key={chat.id} value={chat.id}>
                        {chat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAICreate} variant="outline">
                  Generate (coming soon)
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

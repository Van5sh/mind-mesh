"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Plus, Sparkles, User as UserIcon, Workflow } from "lucide-react";
import type { Chat, Flowchart } from "@/lib/types";
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

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function FlowchartsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  // TODO(graphql): empty placeholder until the GraphQL hook is wired.
  const flowcharts = ([] as Flowchart[]).sort(
    (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt),
  );
  const chats: Chat[] = [];
  const createFlowchart = (..._args: unknown[]): Pick<Flowchart, "id"> => ({ id: "" });
  const generateAIFlowchart = (..._args: unknown[]): Pick<Flowchart, "id"> => ({ id: "" });
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [sourceChatId, setSourceChatId] = useState("none");
  const [submittingAI, setSubmittingAI] = useState(false);

  function handleManualCreate() {
    const flow = createFlowchart(projectId, name.trim() || "Untitled flowchart");
    setOpen(false);
    setName("");
    router.push(`/projects/${projectId}/flowcharts/${flow.id}`);
  }

  function handleAICreate() {
    setSubmittingAI(true);
    const flow = generateAIFlowchart(projectId, name.trim() || "AI-generated flowchart", sourceChatId === "none" ? null : sourceChatId);
    setOpen(false);
    setName("");
    router.push(`/projects/${projectId}/flowcharts/${flow.id}`);
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
              <Card className="h-full border-border bg-card p-5 transition-colors hover:border-primary/40">
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
                <Button onClick={handleManualCreate}>Create</Button>
              </DialogFooter>
            </TabsContent>
            <TabsContent value="ai" className="mt-4 flex flex-col gap-4">
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
                <Button onClick={handleAICreate} disabled={submittingAI}>
                  {submittingAI && <Loader2 className="h-4 w-4 animate-spin" />}
                  Generate
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

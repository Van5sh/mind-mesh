"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Bot, MessagesSquare, Plus, Users2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { PageLoader } from "@/components/ui/page-loader";
import type { ChatType } from "@/lib/types";
import { useCreateChat, useGetChats } from "@/hooks/use-project-chats";
import { toast } from "sonner";

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function ChatsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { chats: fetchedChats, loading } = useGetChats(projectId);
  const { createChat, loading: creating } = useCreateChat();
  const router = useRouter();

  const chats = [...fetchedChats].sort(
    (a, b) => +new Date(b.lastActivityAt) - +new Date(a.lastActivityAt),
  );

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ChatType>("AI_ASSISTANT");

  async function handleCreate() {
    try {
      const chat = await createChat({
        projectId,
        title: title.trim() || "Untitled chat",
        type,
      });
      if (!chat) return;
      setOpen(false);
      setTitle("");
      router.push(`/projects/${projectId}/chats/${chat.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create chat");
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Chats</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask the AI assistant questions grounded in your files, or discuss with teammates.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </div>

      {chats.length === 0 ? (
        <Empty className="mt-6 border border-dashed border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessagesSquare className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No chats yet</EmptyTitle>
            <EmptyDescription>Start a conversation with the AI assistant or your team.</EmptyDescription>
          </EmptyHeader>
          <Button variant="outline" onClick={() => setOpen(true)}>
            New chat
          </Button>
        </Empty>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {chats.map((chat) => (
            <Link key={chat.id} href={`/projects/${projectId}/chats/${chat.id}`}>
              <Card className="flex flex-row items-center justify-between gap-3 border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    {chat.type === "AI_ASSISTANT" ? (
                      <Bot className="h-4 w-4 text-primary" />
                    ) : (
                      <Users2 className="h-4 w-4 text-muted-foreground" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{chat.title || "Untitled chat"}</p>
                    <p className="text-xs text-muted-foreground">
                      {chat.type === "AI_ASSISTANT" ? "AI Assistant" : "Team discussion"} · {timeAgo(chat.lastActivityAt)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={chat.status} />
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New chat</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Chat title" autoFocus />
            <Select value={type} onValueChange={(v) => setType(v as ChatType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AI_ASSISTANT">AI Assistant — ask questions about your files</SelectItem>
                <SelectItem value="GENERAL">Team discussion</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              Start chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { ArrowLeft, Archive, Bot, Hash, Send, Sparkles, User as UserIcon, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageLoader } from "@/components/ui/page-loader";
import { ParticipantsDialog, type ParticipantRow } from "@/components/chat/participants-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useGetChat, useUpdateChat } from "@/hooks/use-project-chats";
import { useChatMessageAdded, useCreateChatMessage, useGetChatMessages } from "@/hooks/use-chat-messages";
import { useGetMembers } from "@/hooks/use-project-members";
import { useFiles } from "@/hooks/use-project-files";
import type { ChatMessage } from "@/lib/types";

type Trigger = { kind: "mention" | "reference"; start: number; query: string };
type PendingMention = { id: string; username: string };
type PendingReference = { id: string; name: string };

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Finds an in-progress @word or #word ending at `cursor`, if any - the
 * trigger char must be at the start of the text or right after whitespace,
 * so "foo@bar" mid-word never opens the picker. */
function detectTrigger(value: string, cursor: number): Trigger | null {
  const upToCursor = value.slice(0, cursor);
  const match = /[@#][^\s@#]*$/.exec(upToCursor);
  if (!match) return null;
  const start = match.index;
  if (start > 0 && !/\s/.test(upToCursor[start - 1])) return null;
  return {
    kind: match[0][0] === "@" ? "mention" : "reference",
    start,
    query: match[0].slice(1),
  };
}

/** Renders message.content with any @username / #filename span that
 * matches a real, attached mentionedUsers/referencedFiles entry styled -
 * never regex-guessed, only what the sender actually attached. */
function MessageContent({ message }: { message: ChatMessage }) {
  const tokens = [
    ...message.mentionedUsers.map((u) => ({ label: `@${u.username}`, kind: "mention" as const })),
    ...message.referencedFiles.map((f) => ({ label: `#${f.name}`, kind: "reference" as const })),
  ];
  if (tokens.length === 0) {
    return <p className="whitespace-pre-wrap">{message.content}</p>;
  }

  const pattern = tokens
    .map((t) => t.label)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|");
  const parts = message.content.split(new RegExp(`(${pattern})`, "g"));

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, i) => {
        const token = tokens.find((t) => t.label === part);
        if (!token) return <span key={i}>{part}</span>;
        return (
          <span
            key={i}
            className={cn(
              "rounded px-1 font-medium",
              token.kind === "mention" ? "bg-primary/15 text-primary" : "bg-info/15 text-info",
            )}
          >
            {part}
          </span>
        );
      })}
    </p>
  );
}

export default function ChatConversationPage() {
  const { projectId, chatId } = useParams<{ projectId: string; chatId: string }>();
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const { chat, loading: chatLoading } = useGetChat(chatId);
  const { chats: messages, loading: messagesLoading } = useGetChatMessages(chatId);
  const { members } = useGetMembers(projectId);
  const { files } = useFiles(projectId);
  // Live updates - splices new messages (the user's own send, and any AI
  // reply) into the GetChatMessages cache as they're published.
  useChatMessageAdded(chatId);

  const { createChat: sendChatMessage } = useCreateChatMessage();
  const { updateChat } = useUpdateChat();

  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [pendingMentions, setPendingMentions] = useState<PendingMention[]>([]);
  const [pendingReferences, setPendingReferences] = useState<PendingReference[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // TODO(graphql): participants is UI-only local state - CreateChatParticipant
  // and RemoveChatParticipant are already implemented on the backend
  // (chat.resolvers.go), just not called from here yet.
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [participants, setParticipants] = useState<ParticipantRow[]>([]);

  // Senders are resolved from project membership rather than the chat's own
  // `participants` list - a brand-new chat has no participants until
  // someone is explicitly added (CreateChatParticipant, not wired up yet),
  // but every message sender is still a project member.
  const userById = useMemo(() => {
    const map = new Map(members.map((m) => [m.user.id, m.user]));
    if (currentUser) map.set(currentUser.id, currentUser);
    return map;
  }, [members, currentUser]);

  const filteredMembers = useMemo(() => {
    if (trigger?.kind !== "mention") return [];
    const q = trigger.query.toLowerCase();
    return members.filter((m) => m.user.username.toLowerCase().includes(q)).slice(0, 6);
  }, [members, trigger]);

  const participantCandidates = useMemo(
    () =>
      members
        .map((m) => ({ id: m.user.id, username: m.user.username }))
        .filter((m) => !participants.some((p) => p.id === m.id)),
    [members, participants],
  );

  const filteredFiles = useMemo(() => {
    if (trigger?.kind !== "reference") return [];
    const q = trigger.query.toLowerCase();
    return files.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 6);
  }, [files, trigger]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages?.length, sending]);

  if (!chatLoading && !chat) {
    notFound();
  }

  if (chatLoading || !chat) {
    return (
      <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-3xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <PageLoader />
      </div>
    );
  }

  const isAiChat = chat.type === "AI_ASSISTANT";

  function handleDraftChange(value: string, cursor: number) {
    setDraft(value);
    setTrigger(detectTrigger(value, cursor));
  }

  function insertToken(label: string) {
    if (!trigger) return;
    const cursor = trigger.start + 1 + trigger.query.length;
    const before = draft.slice(0, trigger.start);
    const after = draft.slice(cursor);
    const next = `${before}${label} ${after}`;
    setDraft(next);
    setTrigger(null);

    const caret = before.length + label.length + 1;
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(caret, caret);
    });
  }

  function handlePickMention(member: (typeof members)[number]) {
    insertToken(`@${member.user.username}`);
    setPendingMentions((prev) =>
      prev.some((m) => m.id === member.user.id) ? prev : [...prev, { id: member.user.id, username: member.user.username }],
    );
  }

  function handlePickFile(file: (typeof files)[number]) {
    insertToken(`#${file.name}`);
    setPendingReferences((prev) =>
      prev.some((f) => f.id === file.id) ? prev : [...prev, { id: file.id, name: file.name }],
    );
  }

  async function handleSend() {
    const content = draft.trim();
    if (!content || sending) return;
    const mentionedUserIds = pendingMentions.map((m) => m.id);
    const referencedFileIds = pendingReferences.map((f) => f.id);
    setDraft("");
    setTrigger(null);
    setPendingMentions([]);
    setPendingReferences([]);
    setSending(true);
    try {
      await sendChatMessage({ chatId, content, role: "USER", mentionedUserIds, referencedFileIds });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  async function handleArchive() {
    try {
      await updateChat(chatId, { status: "ARCHIVED" });
      toast("Chat archived");
      router.push(`/projects/${projectId}/chats`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to archive chat");
    }
  }

  function handleAddParticipant(candidate: ParticipantRow) {
    // TODO(graphql): call useCreateChatParticipant() - this just updates
    // local placeholder state.
    setParticipants((prev) => [...prev, candidate]);
    toast.success(`Added ${candidate.username}`);
  }

  function handleRemoveParticipant(participantId: string) {
    // TODO(graphql): call useRemoveChatParticipant() here.
    setParticipants((prev) => prev.filter((p) => p.id !== participantId));
  }

  const hasMessages = (messages?.length ?? 0) > 0;
  const hasPicker = trigger !== null && (filteredMembers.length > 0 || filteredFiles.length > 0 || trigger.query.length > 0);

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] max-w-3xl flex-col px-4 sm:px-6 lg:px-8">
      <div className="flex shrink-0 items-center justify-between border-b border-border py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/projects/${projectId}/chats`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <p className="font-semibold">{chat.title || "Untitled chat"}</p>
            <p className="text-xs text-muted-foreground">
              {isAiChat ? "AI Assistant" : "Team discussion"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {!isAiChat && (
            <Button variant="ghost" size="sm" onClick={() => setParticipantsOpen(true)}>
              <Users className="h-4 w-4" />
              Participants{participants.length > 0 ? ` (${participants.length})` : ""}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleArchive} disabled={chat.status === "ARCHIVED"}>
            <Archive className="h-4 w-4" />
            {chat.status === "ARCHIVED" ? "Archived" : "Archive"}
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="brand-scrollbar flex-1 overflow-y-auto py-6">
        <div className="flex flex-col gap-5">
          {!hasMessages && !sending && !messagesLoading && (
            <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
              <Bot className="h-8 w-8" />
              <p className="text-sm">
                {isAiChat
                  ? "Ask a question — answers will be grounded in this project's files."
                  : "Say something to start the discussion."}
              </p>
            </div>
          )}
          {messages?.map((message) => {
            const isUser = message.role === "USER";
            const sender = isUser ? userById.get(message.senderId ?? "") : undefined;
            return (
              <div key={message.id} className={cn("flex gap-3", isUser && "flex-row-reverse")}>
                <Avatar className="h-8 w-8 shrink-0 border border-border">
                  <AvatarFallback className={cn("text-xs", !isUser && "bg-primary/15 text-primary")}>
                    {isUser ? (
                      sender?.username.slice(0, 2).toUpperCase() ?? <UserIcon className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    isUser ? "bg-primary text-primary-foreground" : "bg-card border border-border",
                  )}
                >
                  <MessageContent message={message} />
                </div>
              </div>
            );
          })}
          {sending && isAiChat && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0 border border-border">
                <AvatarFallback className="bg-primary/15 text-primary">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[75%] rounded-2xl border border-border bg-card px-4 py-2.5 text-sm leading-relaxed">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-border py-4">
        {isAiChat && (
          <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            AI replies may take a few seconds while the assistant reviews project files.
          </p>
        )}

        {(pendingMentions.length > 0 || pendingReferences.length > 0) && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {pendingMentions.map((m) => (
              <span
                key={m.id}
                className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary"
              >
                @{m.username}
                <button
                  type="button"
                  onClick={() => setPendingMentions((prev) => prev.filter((p) => p.id !== m.id))}
                  className="rounded-full hover:bg-primary/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {pendingReferences.map((f) => (
              <span
                key={f.id}
                className="flex items-center gap-1 rounded-full bg-info/15 px-2 py-0.5 text-xs font-medium text-info"
              >
                #{f.name}
                <button
                  type="button"
                  onClick={() => setPendingReferences((prev) => prev.filter((p) => p.id !== f.id))}
                  className="rounded-full hover:bg-info/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="relative flex items-end gap-2">
          {hasPicker && (
            <div className="absolute bottom-full left-0 mb-1.5 max-h-48 w-64 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md">
              {trigger?.kind === "mention" ? (
                filteredMembers.length === 0 ? (
                  <p className="px-2 py-1.5 text-xs text-muted-foreground">No matching members</p>
                ) : (
                  filteredMembers.map((m) => (
                    <button
                      key={m.user.id}
                      type="button"
                      onClick={() => handlePickMention(m)}
                      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-medium text-primary">
                        {m.user.username.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="truncate">{m.user.username}</span>
                    </button>
                  ))
                )
              ) : filteredFiles.length === 0 ? (
                <p className="px-2 py-1.5 text-xs text-muted-foreground">No matching files</p>
              ) : (
                filteredFiles.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handlePickFile(f)}
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent"
                  >
                    <Hash className="h-3.5 w-3.5 shrink-0 text-info" />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))
              )}
            </div>
          )}
          <Textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => handleDraftChange(e.target.value, e.target.selectionStart ?? e.target.value.length)}
            onKeyUp={(e) => handleDraftChange(e.currentTarget.value, e.currentTarget.selectionStart ?? e.currentTarget.value.length)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              } else if (e.key === "Escape") {
                setTrigger(null);
              }
            }}
            placeholder={isAiChat ? "Ask about your project's files… (@ to mention, # to reference a file)" : "Write a message… (@ to mention, # to reference a file)"}
            rows={1}
            className="max-h-40 min-h-[44px] resize-none"
          />
          <Button size="icon" onClick={handleSend} disabled={!draft.trim() || sending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ParticipantsDialog
        open={participantsOpen}
        onOpenChange={setParticipantsOpen}
        participants={participants}
        candidates={participantCandidates}
        onAdd={handleAddParticipant}
        onRemove={handleRemoveParticipant}
      />
    </div>
  );
}

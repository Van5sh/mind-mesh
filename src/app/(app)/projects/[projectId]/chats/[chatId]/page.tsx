"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { ArrowLeft, Archive, Bot, Send, Sparkles, User as UserIcon } from "lucide-react";
import { useChatMessages, useProjectChats, useStore } from "@/lib/store";
import { userById } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export default function ChatConversationPage() {
  const { projectId, chatId } = useParams<{ projectId: string; chatId: string }>();
  const chats = useProjectChats(projectId);
  const chat = chats.find((c) => c.id === chatId);
  const messages = useChatMessages(chatId);
  const { sendMessage, archiveChat } = useStore();
  const router = useRouter();

  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  if (!chat) {
    notFound();
  }

  const isAiChat = chat.type === "AI_ASSISTANT";
  const pending = messages.some((m) => m.pending);

  function handleSend() {
    if (!draft.trim() || pending) return;
    sendMessage(chatId, draft.trim());
    setDraft("");
  }

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
            <p className="font-semibold">{chat.title}</p>
            <p className="text-xs text-muted-foreground">
              {isAiChat ? "AI Assistant" : "Team discussion"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            archiveChat(chat.id);
            toast("Chat archived");
            router.push(`/projects/${projectId}/chats`);
          }}
        >
          <Archive className="h-4 w-4" />
          Archive
        </Button>
      </div>

      <div ref={scrollRef} className="brand-scrollbar flex-1 overflow-y-auto py-6">
        <div className="flex flex-col gap-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground">
              <Bot className="h-8 w-8" />
              <p className="text-sm">
                {isAiChat
                  ? "Ask a question — answers will be grounded in this project's files."
                  : "Say something to start the discussion."}
              </p>
            </div>
          )}
          {messages.map((message) => {
            const isUser = message.role === "USER";
            const sender = userById(message.senderId);
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
                  {message.pending ? (
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                    </span>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 border-t border-border py-4">
        {isAiChat && (
          <p className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            AI replies may take a few seconds while the assistant reviews project files.
          </p>
        )}
        <div className="flex items-end gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isAiChat ? "Ask about your project's files…" : "Write a message…"}
            rows={1}
            className="max-h-40 min-h-[44px] resize-none"
          />
          <Button size="icon" onClick={handleSend} disabled={!draft.trim() || pending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

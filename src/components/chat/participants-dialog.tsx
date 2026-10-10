"use client";

// UI-only - CreateChatParticipant/RemoveChatParticipant are already
// implemented on the backend; wiring this dialog to them is intentionally
// left for later - see GRAPHQL_INTEGRATION_GUIDE.md and docs/whats-left.pdf.

import { useState } from "react";
import { X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export interface ParticipantRow {
  id: string;
  username: string;
}

interface ParticipantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participants: ParticipantRow[];
  candidates: ParticipantRow[];
  onAdd: (candidate: ParticipantRow) => void;
  onRemove: (participantId: string) => void;
}

export function ParticipantsDialog({
  open,
  onOpenChange,
  participants,
  candidates,
  onAdd,
  onRemove,
}: ParticipantsDialogProps) {
  const [query, setQuery] = useState("");
  const filteredCandidates = candidates.filter((c) =>
    c.username.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Participants</DialogTitle>
          <DialogDescription>
            Add project members to this chat, or remove someone from it.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground">In this chat ({participants.length})</p>
          {participants.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No one&apos;s been added yet.</p>
          ) : (
            <div className="flex max-h-40 flex-col gap-1 overflow-y-auto">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent">
                  <Avatar className="h-8 w-8 shrink-0 border border-border">
                    <AvatarFallback className="text-xs">{p.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.username}</span>
                  <Button variant="ghost" size="icon-sm" className="shrink-0" onClick={() => onRemove(p.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">Add someone</p>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search project members…"
            autoFocus
          />
          {query.trim() && (
            <div className="flex max-h-40 flex-col gap-1 overflow-y-auto rounded-lg border border-border p-1">
              {filteredCandidates.length === 0 ? (
                <p className="px-2 py-1.5 text-xs text-muted-foreground">No matching members</p>
              ) : (
                filteredCandidates.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onAdd(c);
                      setQuery("");
                    }}
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent"
                  >
                    <Avatar className="h-6 w-6 shrink-0 border border-border">
                      <AvatarFallback className="text-[10px]">{c.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{c.username}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

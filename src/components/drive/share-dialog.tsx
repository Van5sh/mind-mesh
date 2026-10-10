"use client";

// UI-only - every action here is local placeholder state, not a real
// mutation. The backend (ShareFile / UpdateFileSharePermission /
// DeleteFileShare) is already implemented; wiring this dialog to it is
// intentionally left for later - see GRAPHQL_INTEGRATION_GUIDE.md and
// docs/whats-left.pdf.

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SharePermission = "READ" | "WRITE";

export interface FileShareRow {
  id: string;
  username: string;
  permission: SharePermission;
}

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  shares: FileShareRow[];
  onShare: (username: string, permission: SharePermission) => void;
  onUpdatePermission: (shareId: string, permission: SharePermission) => void;
  onRemove: (shareId: string) => void;
}

export function ShareDialog({
  open,
  onOpenChange,
  fileName,
  shares,
  onShare,
  onUpdatePermission,
  onRemove,
}: ShareDialogProps) {
  const [username, setUsername] = useState("");
  const [permission, setPermission] = useState<SharePermission>("READ");

  function handleAdd() {
    if (!username.trim()) return;
    onShare(username.trim(), permission);
    setUsername("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="truncate">Share &ldquo;{fileName}&rdquo;</DialogTitle>
          <DialogDescription>
            People you add can view or edit this file, depending on the permission you give them.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            autoFocus
          />
          <Select value={permission} onValueChange={(v) => setPermission(v as SharePermission)}>
            <SelectTrigger className="w-28 shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="READ">Can view</SelectItem>
              <SelectItem value="WRITE">Can edit</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} disabled={!username.trim()} className="shrink-0">
            Add
          </Button>
        </div>

        <div className="flex max-h-56 flex-col gap-1 overflow-y-auto">
          {shares.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Not shared with anyone yet.</p>
          ) : (
            shares.map((share) => (
              <div key={share.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent">
                <Avatar className="h-8 w-8 shrink-0 border border-border">
                  <AvatarFallback className="text-xs">{share.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{share.username}</span>
                <Select
                  value={share.permission}
                  onValueChange={(v) => onUpdatePermission(share.id, v as SharePermission)}
                >
                  <SelectTrigger className="h-8 w-28 shrink-0 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="READ">Can view</SelectItem>
                    <SelectItem value="WRITE">Can edit</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0"
                  onClick={() => onRemove(share.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
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

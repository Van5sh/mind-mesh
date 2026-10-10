"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Check, Crown, MoreHorizontal, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProjectRole } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { useProject } from "@/hooks/use-project";
import {
  useAddProjectMember,
  useGetMembers,
  useRemoveProjectMember,
  useSearchUsers,
  useUpdateMemberRole,
} from "@/hooks/use-project-members";

// The invite/role-change mutations take the input-side enum (MEMBER instead
// of EDITOR - see ProjectMemberRoleToDB on the backend), while everything
// displayed on this page uses the output-side ProjectRole (which has
// EDITOR). Convert only at the point of calling a mutation.
function toMemberRoleInput(role: ProjectRole): "OWNER" | "ADMIN" | "MEMBER" | "VIEWER" {
  return role === "EDITOR" ? "MEMBER" : role;
}

const ROLE_LABEL: Record<ProjectRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  EDITOR: "Editor",
  VIEWER: "Viewer",
};

export default function MembersPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const {project}=useProject(projectId)
  const {members}=useGetMembers(projectId);
  const { user } = useAuth();
  const myRole: ProjectRole | null =
    !user ? null
    : user.id === project?.ownerId ? "OWNER"
    : (members.find((m) => m.user.id === user.id)?.role ?? null);
  const canManage = myRole === "OWNER" || myRole === "ADMIN";

  const { addProjectMember, loading: inviting } = useAddProjectMember();
  const { updateMemberRole: updateMemberRoleMutation } = useUpdateMemberRole();
  const { removeMember: removeMemberMutation } = useRemoveProjectMember();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteUserId, setInviteUserId] = useState("");
  const [inviteRole, setInviteRole] = useState<ProjectRole>("VIEWER");
  const [inviteQuery, setInviteQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(inviteQuery.trim()), 300);
    return () => clearTimeout(id);
  }, [inviteQuery]);

  const { users: searchResults, loading: searching } = useSearchUsers(debouncedQuery, 10);

  const memberUserIds = new Set(members.map((m) => m.user.id));
  const invitableUsers = searchResults.filter((u) => !memberUserIds.has(u.id) && u.id !== project?.ownerId);

  function resetInvite() {
    setInviteUserId("");
    setInviteQuery("");
    setDebouncedQuery("");
  }

  async function handleUpdateRole(userId: string, role: ProjectRole) {
    try {
      await updateMemberRoleMutation({ projectId, userId, role: toMemberRoleInput(role) });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
    }
  }

  async function handleRemove(userId: string, name: string) {
    try {
      await removeMemberMutation(projectId, userId);
      toast("Member removed", { description: name });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove member");
    }
  }

  async function handleInvite() {
    try {
      await addProjectMember({
        projectId,
        userId: inviteUserId,
        role: toMemberRoleInput(inviteRole),
      });
      setInviteOpen(false);
      resetInvite();
      toast.success("Member invited");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to invite member");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Members</h1>
          <p className="mt-1 text-sm text-muted-foreground">Who has access to this project.</p>
        </div>
        {canManage && (
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Invite member
          </Button>
        )}
      </div>

      <div className="mt-6 flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
        {members.map((member) => {
          const isOwner = member.user.id === project?.ownerId;
          const fullName = member.user.username;
          return (
            <div key={member.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarFallback className="bg-secondary text-xs">
                    {member.user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                    {fullName}
                    {isOwner && <Crown className="h-3.5 w-3.5 text-warning" />}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {canManage && !isOwner ? (
                  <Select
                    value={member.role}
                    onValueChange={(v) => handleUpdateRole(member.user.id, v as ProjectRole)}
                  >
                    <SelectTrigger className="h-8 w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="EDITOR">Editor</SelectItem>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline">{ROLE_LABEL[isOwner ? "OWNER" : member.role]}</Badge>
                )}
                {canManage && !isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleRemove(member.user.id, fullName)}
                      >
                        Remove from project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog
        open={inviteOpen}
        onOpenChange={(open) => {
          setInviteOpen(open);
          if (!open) resetInvite();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a member</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={inviteQuery}
                onChange={(e) => {
                  setInviteQuery(e.target.value);
                  setInviteUserId("");
                }}
                placeholder="Search by username…"
                className="pl-8"
                autoFocus
              />
            </div>
            <div className="flex max-h-56 flex-col gap-0.5 overflow-y-auto rounded-lg border border-border p-1">
              {invitableUsers.map((u) => {
                const selected = inviteUserId === u.id;
                const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.username;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setInviteUserId(u.id)}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      selected
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <span className="truncate">
                      <span className="font-medium text-foreground">{name}</span>{" "}
                      <span className="text-muted-foreground">· {u.email}</span>
                    </span>
                    {selected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                  </button>
                );
              })}
              {invitableUsers.length === 0 && (
                <p className="px-3 py-2 text-sm text-muted-foreground">
                  {!debouncedQuery
                    ? "Type a username to search"
                    : searching
                      ? "Searching…"
                      : "No matching users"}
                </p>
              )}
            </div>
            <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as ProjectRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="EDITOR">Editor</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!inviteUserId || inviting} onClick={handleInvite}>
              Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

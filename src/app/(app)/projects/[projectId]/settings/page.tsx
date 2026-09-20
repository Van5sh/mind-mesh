"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArchiveRestore, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Project, ProjectMember, ProjectRole, ProjectVisibility } from "@/lib/types";
import { toast } from "sonner";

export default function ProjectSettingsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  // TODO(graphql): empty placeholder until the GraphQL hook is wired.
  // The project layout 404s while there is no project, so this never renders.
  const project = null as unknown as Project;
  const members: ProjectMember[] = [];
  const myRole = null as ProjectRole | null;
  const noop = (..._args: unknown[]): void => {};
  const updateProject = noop;
  const archiveProject = noop;
  const restoreProject = noop;
  const deleteProject = noop;
  const transferOwnership = noop;
  const router = useRouter();

  const isOwner = myRole === "OWNER";
  const canEdit = myRole === "OWNER" || myRole === "ADMIN";

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [visibility, setVisibility] = useState<ProjectVisibility>(project.visibility);
  const [saving, setSaving] = useState(false);

  const [transferTo, setTransferTo] = useState("");
  const [transferOpen, setTransferOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    updateProject(projectId, { name: name.trim(), description: description.trim(), visibility });
    setSaving(false);
    toast.success("Project updated");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Project settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage this project&apos;s details and access.</p>

      <Card className="mt-6 border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">General</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Name</Label>
              <Input id="project-name" value={name} onChange={(e) => setName(e.target.value)} disabled={!canEdit} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={!canEdit}
              />
            </div>
            <div className="grid gap-2">
              <Label>Visibility</Label>
              <Select value={visibility} onValueChange={(v) => setVisibility(v as ProjectVisibility)} disabled={!canEdit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIVATE">Private — only invited members</SelectItem>
                  <SelectItem value="TEAM">Team — visible to your organization</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {canEdit && (
              <div className="flex justify-end">
                <Button type="submit" disabled={saving || !name.trim()}>
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save changes
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {isOwner && (
        <Card className="mt-6 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Transfer ownership</CardTitle>
            <CardDescription>Make another member the owner of this project.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => setTransferOpen(true)} disabled={members.length <= 1}>
              Transfer ownership
            </Button>
          </CardContent>
        </Card>
      )}

      {canEdit && (
        <Card className="mt-6 border-warning/40 bg-card">
          <CardHeader>
            <CardTitle className="text-base">{project.archivedAt ? "Restore project" : "Archive project"}</CardTitle>
            <CardDescription>
              {project.archivedAt
                ? "Bring this project back to your active list."
                : "Archived projects are hidden from your dashboard but not deleted."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => {
                if (project.archivedAt) {
                  restoreProject(projectId);
                  toast.success("Project restored");
                } else {
                  archiveProject(projectId);
                  toast("Project archived");
                  router.push("/projects");
                }
              }}
            >
              <ArchiveRestore className="h-4 w-4" />
              {project.archivedAt ? "Restore" : "Archive"}
            </Button>
          </CardContent>
        </Card>
      )}

      {isOwner && (
        <Card className="mt-6 border-destructive/40 bg-card">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Delete project</CardTitle>
            <CardDescription>
              Permanently deletes this project, its files, chats, reports, and flowcharts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              Delete project
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer ownership</DialogTitle>
            <DialogDescription>You will become an admin on this project.</DialogDescription>
          </DialogHeader>
          <Select value={transferTo} onValueChange={setTransferTo}>
            <SelectTrigger>
              <SelectValue placeholder="Select a member" />
            </SelectTrigger>
            <SelectContent>
              {members.filter((m) => m.user.id !== project.ownerId).map((m) => (
                <SelectItem key={m.id} value={m.user.id}>
                  {m.user.firstName} {m.user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTransferOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!transferTo}
              onClick={() => {
                transferOwnership(projectId, transferTo);
                setTransferOpen(false);
                setTransferTo("");
                toast.success("Ownership transferred");
              }}
            >
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={(o) => { setDeleteOpen(o); if (!o) setConfirmName(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete &quot;{project.name}&quot;?</DialogTitle>
            <DialogDescription>
              This cannot be undone. Type the project name to confirm.
            </DialogDescription>
          </DialogHeader>
          <Input value={confirmName} onChange={(e) => setConfirmName(e.target.value)} placeholder={project.name} />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={confirmName !== project.name}
              onClick={() => {
                deleteProject(projectId);
                router.push("/projects");
              }}
            >
              Delete project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

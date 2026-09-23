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
import type { Project, ProjectRole, ProjectVisibility } from "@/lib/types";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useProject, useUpdateProject, useTransferOwnerShip } from "@/hooks/use-project";
import { useGetMembers } from "@/hooks/use-project-members";
import { useArchiveProject, useRestoreProject, useDeleteProject } from "@/hooks/use-projects";
import type { ProjectMemberRow } from "@/lib/mappers/project";

export default function ProjectSettingsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { project, loading } = useProject(projectId);
  const { members } = useGetMembers(projectId);
  const { user } = useAuth();
  const router = useRouter();

  // The project layout 404s while there is no project at all, but this page
  // can still render before the query resolves - wait for real data before
  // mounting the form, instead of reading fields off a project that isn't
  // loaded yet.
  if (loading || !project) {
    return <p className="px-4 py-8 text-sm text-muted-foreground">Loading…</p>;
  }

  const myRole: ProjectRole | null =
    !user ? null
    : user.id === project.ownerId ? "OWNER"
    : (members.find((m) => m.user.id === user.id)?.role ?? null);

  return (
    <ProjectSettingsForm
      projectId={projectId}
      project={project}
      members={members}
      myRole={myRole}
      router={router}
    />
  );
}

function ProjectSettingsForm({
  projectId,
  project,
  members,
  myRole,
  router,
}: {
  projectId: string;
  project: Project;
  members: ProjectMemberRow[];
  myRole: ProjectRole | null;
  router: ReturnType<typeof useRouter>;
}) {
  const { updateProject, loading: saving } = useUpdateProject();
  const { archiveProject, loading: archiving } = useArchiveProject();
  const { restoreProject, loading: restoring } = useRestoreProject();
  const { deleteProject, loading: deleting } = useDeleteProject();
  const { transferOwnerShip, loading: transferring } = useTransferOwnerShip();

  const isOwner = myRole === "OWNER";
  const canEdit = myRole === "OWNER" || myRole === "ADMIN";

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [visibility, setVisibility] = useState<ProjectVisibility>(project.visibility);

  const [transferTo, setTransferTo] = useState("");
  const [transferOpen, setTransferOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateProject(projectId, {
        name: name.trim(),
        description: description.trim(),
        visibility,
      });
      toast.success("Project updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update project");
    }
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
              disabled={archiving || restoring}
              onClick={async () => {
                try {
                  if (project.archivedAt) {
                    await restoreProject(projectId);
                    toast.success("Project restored");
                  } else {
                    await archiveProject(projectId);
                    toast("Project archived");
                    router.push("/projects");
                  }
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Failed");
                }
              }}
            >
              {(archiving || restoring) && <Loader2 className="h-4 w-4 animate-spin" />}
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
                  {m.user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTransferOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!transferTo || transferring}
              onClick={async () => {
                try {
                  await transferOwnerShip({ projectId, ownerId: transferTo });
                  setTransferOpen(false);
                  setTransferTo("");
                  toast.success("Ownership transferred");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Failed to transfer ownership");
                }
              }}
            >
              {transferring && <Loader2 className="h-4 w-4 animate-spin" />}
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
              disabled={confirmName !== project.name || deleting}
              onClick={async () => {
                try {
                  await deleteProject(projectId);
                  router.push("/projects");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Failed to delete project");
                }
              }}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

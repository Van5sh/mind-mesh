"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ProjectVisibility } from "@/graphql/generated/graphql";

import { useAuth } from "@/lib/auth-context";
import { useCreateProject } from "@/hooks/use-projects";

export function NewProjectDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useAuth();

  const { createProject, loading } = useCreateProject();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<ProjectVisibility>("PRIVATE");
  const [error, setError] = useState("");

  function reset() {
    setName("");
    setDescription("");
    setVisibility("PRIVATE");
    setError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Project name is required.");
      return;
    }

    if (!user) {
      setError("You need to be signed in to create a project.");
      return;
    }

    try {
      setError("");

      const project = await createProject({
        name: trimmedName,
        description: trimmedDescription || undefined,
        visibility,
        ownerId: user.id,
      });

      if (!project) {
        throw new Error("Project was not created.");
      }

      toast.success("Project created", {
        description: project.name,
      });

      setOpen(false);
      reset();

      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create project."
      );
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4" />
            New project
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new project</DialogTitle>

            <DialogDescription>
              Projects group files, chats, reports, and flowcharts
              around a shared goal.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="project-name">Name</Label>

              <Input
                id="project-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                placeholder="e.g. Series B Data Room"
                autoFocus
                disabled={loading}
              />

              {error && (
                <p className="text-xs text-destructive">
                  {error}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="project-description">
                Description (optional)
              </Label>

              <Textarea
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this project for?"
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Visibility */}
            <div className="grid gap-2">
              <Label>Visibility</Label>

              <Select
                value={visibility}
                onValueChange={(value) =>
                  setVisibility(value as ProjectVisibility)
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="PRIVATE">
                    Private — only invited members
                  </SelectItem>

                  <SelectItem value="TEAM">
                    Team — visible to your organization
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {loading ? "Creating..." : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
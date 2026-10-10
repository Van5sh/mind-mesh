"use client";

import { useMemo, useState } from "react";
import { ArchiveRestore, FolderKanban, Search } from "lucide-react";
import { NewProjectDialog } from "@/components/projects/new-project-dialog";
import { ProjectCard } from "@/components/projects/project-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { PageLoader } from "@/components/ui/page-loader";
import { toast } from "sonner";
import { useArchivedProjectsForUser, useProjectsWithCounts, useRestoreProject } from "@/hooks/use-projects";

type SortKey = "updated" | "name" | "created";

export default function ProjectsPage() {
  const { projects, loading } = useProjectsWithCounts();
  const { projects: archivedProjects, loading: archivedLoading } = useArchivedProjectsForUser();
  const { restoreProject } = useRestoreProject();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("updated");

  const filtered = useMemo(() => {
    const list = projects.filter((p) =>
      p.project.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => a.project.name.localeCompare(b.project.name));
    else if (sort === "created")
      sorted.sort((a, b) => +new Date(b.project.createdAt) - +new Date(a.project.createdAt));
    else sorted.sort((a, b) => +new Date(b.project.updatedAt) - +new Date(a.project.updatedAt));
    return sorted;
  }, [projects, query, sort]);

  async function handleRestore(projectId: string, name: string) {
    try {
      await restoreProject(projectId);
      toast.success("Project restored", { description: name });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to restore project");
    }
  }

  if (loading || archivedLoading) return <PageLoader />;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">All the projects you own or belong to.</p>
        </div>
        <NewProjectDialog />
      </div>

      <Tabs defaultValue="active" className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="active">Active ({projects.length})</TabsTrigger>
            <TabsTrigger value="archived">Archived ({archivedProjects.length})</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects…"
                className="w-48 pl-8 sm:w-64"
              />
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last updated</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="created">Date created</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="active" className="mt-6">
          {filtered.length === 0 ? (
            <Empty className="border border-dashed border-border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderKanban className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>{query ? "No matching projects" : "No projects yet"}</EmptyTitle>
                <EmptyDescription>
                  {query ? "Try a different search term." : "Create your first project to get started."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(({ project, members, fileCount }) => (
                <ProjectCard key={project.id} project={project} members={members} fileCount={fileCount} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="mt-6">
          {archivedProjects.length === 0 ? (
            <Empty className="border border-dashed border-border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ArchiveRestore className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>Nothing archived</EmptyTitle>
                <EmptyDescription>Archived projects will show up here.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="flex flex-col gap-3">
              {archivedProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore(project.id, project.name)}
                  >
                    <ArchiveRestore className="h-4 w-4" />
                    Restore
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

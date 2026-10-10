"use client";

import Link from "next/link";
import { FileText, FolderKanban, MessagesSquare, Workflow } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { NewProjectDialog } from "@/components/projects/new-project-dialog";
import { ProjectCard } from "@/components/projects/project-card";
import { Card } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/use-dashboard";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60_000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, loading, error } = useDashboard();
  const projs = projects.length
  const files = projects.reduce((sum, p) => sum + p.fileCount, 0)
  const chats = projects.reduce((sum, p) => sum + p.chatCount, 0)
  const flowRe = projects.reduce((sum, p) => sum + p.reportCount + p.flowchartCount, 0)
  const recentActivity = projects.flatMap((p) => p.activity).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 8);
  if (loading) return <p>Loading...</p>
  if (error) return <p>Something went wrong: {error.message}</p>;
  const stats = [
    { label: "Projects", value: projs, icon: FolderKanban, href: "/projects" },
    { label: "Files", value: files, icon: FileText },
    { label: "Chats", value: chats, icon: MessagesSquare },
    { label: "Flowcharts & reports", value: flowRe, icon: Workflow },
  ]
  const firstName = user?.firstName || user?.username || "there";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back, {firstName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what&apos;s happening across your projects.</p>
        </div>
        <NewProjectDialog />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const content = (
            <Card className="border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
            </Card>
          );
          return stat.href ? (
            <Link key={stat.label} href={stat.href}>
              {content}
            </Link>
          ) : (
            <div key={stat.label}>{content}</div>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent projects</h2>
            <Link href="/projects" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>

          {projects.length === 0 ? (
            <Empty className="mt-4 border border-dashed border-border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderKanban className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>No projects yet</EmptyTitle>
                <EmptyDescription>Create your first project to start uploading files.</EmptyDescription>
              </EmptyHeader>
              <NewProjectDialog trigger={<Button variant="outline">New project</Button>} />
            </Empty>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {projects.slice(0, 4).map((project) => (
                <ProjectCard
                  key={project.project.id}
                  project={project.project}
                  members={project.members}
                  fileCount={project.fileCount}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-base font-semibold">Recent activity</h2>
          <div className="mt-4 flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
            {recentActivity.length === 0 && (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            )}
            {recentActivity.map((a) => {
              return (
                <div key={a.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0">
                    <p className="text-foreground">
                      <span className="font-medium">{a.actor}</span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{timeAgo(a.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

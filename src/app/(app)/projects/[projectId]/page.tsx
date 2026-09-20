"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  FileText,
  FolderKanban,
  MessagesSquare,
  Users2,
  Workflow,
} from "lucide-react";
import type {
  ActivityLog,
  Chat,
  Flowchart,
  Project,
  ProjectFile,
  ProjectMember,
  Report,
  User,
} from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60_000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export default function ProjectOverviewPage() {
  const { projectId } = useParams<{ projectId: string }>();
  // TODO(graphql): empty placeholder until the GraphQL hook is wired.
  // The project layout 404s while there is no project, so this never renders.
  const project = null as unknown as Project;
  const files: ProjectFile[] = [];
  const chats: Chat[] = [];
  const reports: Report[] = [];
  const flowcharts: Flowchart[] = [];
  const members: ProjectMember[] = [];
  const activity: ActivityLog[] = [];
  const userById = (_id?: string | null): User | undefined => undefined;

  const stats = [
    { label: "Files", value: files.length, icon: FolderKanban, href: `/projects/${projectId}/files` },
    { label: "Chats", value: chats.length, icon: MessagesSquare, href: `/projects/${projectId}/chats` },
    { label: "Reports", value: reports.length, icon: FileText, href: `/projects/${projectId}/reports` },
    { label: "Flowcharts", value: flowcharts.length, icon: Workflow, href: `/projects/${projectId}/flowcharts` },
  ];

  const recentFiles = [...files]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
            <Badge variant="outline">{project.visibility === "PRIVATE" ? "Private" : "Team"}</Badge>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {project.description || "No description yet."}
          </p>
        </div>
        <Link
          href={`/projects/${projectId}/members`}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <Users2 className="h-4 w-4" />
          {members.length} member{members.length === 1 ? "" : "s"}
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="border-border bg-card p-4 transition-colors hover:border-primary/40">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent files</h2>
            <Link href={`/projects/${projectId}/files`} className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
            {recentFiles.length === 0 && (
              <p className="px-4 py-6 text-sm text-muted-foreground">No files uploaded yet.</p>
            )}
            {recentFiles.map((file) => (
              <Link
                key={file.id}
                href={`/projects/${projectId}/files`}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-accent/40"
              >
                <span className="truncate">{file.name}</span>
                <StatusBadge status={file.aiMetadata.processingStatus} />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-semibold">Recent activity</h2>
          </div>
          <div className="mt-4 flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
            {activity.length === 0 && <p className="text-sm text-muted-foreground">No activity yet.</p>}
            {activity.map((a) => {
              const actor = userById(a.userId);
              return (
                <div key={a.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0">
                    <p>
                      <span className="font-medium">{actor?.firstName ?? actor?.username ?? "Someone"}</span>{" "}
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

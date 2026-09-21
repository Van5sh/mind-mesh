"use client";

import Link from "next/link";
import { Lock, Users2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Project, ProjectFile, ProjectMember } from "@/lib/types";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60_000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function ProjectCard({ project }: { project: Project }) {
  const files: ProjectFile[] = [];
  const members: ProjectMember[] = [];

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="group h-full border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-base font-semibold group-hover:text-primary">{project.name}</h3>
          <Badge variant="outline" className="shrink-0 gap-1 text-muted-foreground">
            {project.visibility === "PRIVATE" ? <Lock className="h-3 w-3" /> : <Users2 className="h-3 w-3" />}
            {project.visibility === "PRIVATE" ? "Private" : "Team"}
          </Badge>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {project.description || "No description yet."}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex -space-x-2">
            {members.slice(0, 4).map((m) => (
              <Avatar key={m.id} className="h-6 w-6 border-2 border-card">
                <AvatarFallback className="bg-secondary text-[10px]">
                  {m.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{files.length} files</span>
            <span>·</span>
            <span>Updated {timeAgo(project.updatedAt)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

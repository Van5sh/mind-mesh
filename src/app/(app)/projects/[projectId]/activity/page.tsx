"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Activity as ActivityIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { PageLoader } from "@/components/ui/page-loader";
import { useActivityLogs } from "@/hooks/use-project-activity";
import { useGetMembers } from "@/hooks/use-project-members";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ActivityPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { activity, loading } = useActivityLogs(projectId);
  const { members } = useGetMembers(projectId);

  const userById = useMemo(() => new Map(members.map((m) => [m.user.id, m.user])), [members]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
      <p className="mt-1 text-sm text-muted-foreground">A history of what&apos;s happened in this project.</p>

      {activity.length === 0 ? (
        <Empty className="mt-6 border border-dashed border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ActivityIcon className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No activity yet</EmptyTitle>
            <EmptyDescription>Actions taken in this project will show up here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ol className="mt-6 flex flex-col gap-6 border-l border-border pl-6">
          {activity.map((a) => {
            const actor = userById.get(a.userId ?? "");
            const fullName = actor?.username ?? "Someone";
            return (
              <li key={a.id} className="relative">
                <span className="absolute -left-[29px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-primary" />
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6 border border-border">
                    <AvatarFallback className="text-[10px]">{fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm">
                    <span className="font-medium">{fullName}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>
                  </p>
                </div>
                <p className="ml-8 text-xs text-muted-foreground">{formatDate(a.createdAt)}</p>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

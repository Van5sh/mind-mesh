"use client";

import { notFound, useParams } from "next/navigation";
import type { Project } from "@/lib/types";
import { useProject } from "@/hooks/use-project";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const { projectId } = useParams<{ projectId: string }>();
  const project =useProject(projectId)

  if (!project) {
    notFound();
  }

  return <>{children}</>;
}

"use client";

import { useParams, notFound } from "next/navigation";
import { useProject } from "@/lib/store";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useProject(projectId);

  if (!project) {
    notFound();
  }

  return <>{children}</>;
}

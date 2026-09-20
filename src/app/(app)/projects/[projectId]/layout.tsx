"use client";

import { notFound } from "next/navigation";
import type { Project } from "@/lib/types";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  // TODO(graphql): replace with the real project query (needs the projectId
  // from useParams). No project yet, so every project route 404s.
  const project = undefined as Project | undefined;

  if (!project) {
    notFound();
  }

  return <>{children}</>;
}

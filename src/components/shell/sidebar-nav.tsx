"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  Activity,
  ChevronLeft,
  FileText,
  FolderKanban,
  HardDrive,
  LayoutDashboard,
  MessagesSquare,
  Plus,
  Settings,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProject } from "@/hooks/use-project";
import { useProjects } from "@/hooks/use-projects";

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
        active
          ? "bg-sidebar-accent font-semibold text-sidebar-foreground"
          : "font-medium text-sidebar-foreground/65 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-sidebar-foreground" : "text-sidebar-foreground/45 group-hover:text-sidebar-foreground")} />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const params = useParams<{ projectId?: string }>();
  const projectId = params?.projectId;
  const { project } = useProject(projectId ?? "");
  const { projects: myProjects } = useProjects();

  if (projectId && project) {
    const base = `/projects/${projectId}`;
    const items = [
      { href: base, label: "Overview", icon: LayoutDashboard, exact: true },
      { href: `${base}/files`, label: "Files", icon: FolderKanban },
      { href: `${base}/chats`, label: "Chats", icon: MessagesSquare },
      { href: `${base}/reports`, label: "Reports", icon: FileText },
      { href: `${base}/flowcharts`, label: "Flowcharts", icon: Workflow },
      { href: `${base}/members`, label: "Members", icon: Users },
      { href: `${base}/activity`, label: "Activity", icon: Activity },
      { href: `${base}/settings`, label: "Project settings", icon: Settings },
    ];
    return (
      <div className="flex h-full flex-col gap-4">
        <Link
          href="/projects"
          onClick={onNavigate}
          className="flex items-center gap-1.5 px-1 text-xs font-medium text-sidebar-foreground/50 hover:text-sidebar-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          All projects
        </Link>
        <div className="px-1">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">{project.name}</p>
          <p className="mt-0.5 text-xs text-sidebar-foreground/50">
            {project.visibility === "PRIVATE" ? "Private project" : "Team project"}
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              onNavigate={onNavigate}
              active={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
            />
          ))}
        </nav>
      </div>
    );
  }

  const globalItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/files", label: "Files", icon: HardDrive },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-full flex-col gap-6">
      <nav className="flex flex-col gap-1">
        {globalItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            onNavigate={onNavigate}
            active={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
          />
        ))}
      </nav>

      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        <div className="flex items-center justify-between px-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/40">
            Recent projects
          </p>
          <Link
            href="/projects"
            onClick={onNavigate}
            className="text-sidebar-foreground/40 hover:text-sidebar-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="flex flex-col gap-0.5 overflow-y-auto brand-scrollbar">
          {myProjects.slice(0, 6).map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              onClick={onNavigate}
              className="flex items-center gap-2 truncate rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-sidebar-accent text-[10px] font-semibold text-sidebar-foreground/70">
                {p.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="truncate">{p.name}</span>
            </Link>
          ))}
          {myProjects.length === 0 && (
            <p className="px-3 text-xs text-sidebar-foreground/40">No projects yet.</p>
          )}
        </div>
      </div>

      <div className="mx-1 mb-1 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-sidebar-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI Assistant
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-sidebar-foreground/50">
          Open any project&apos;s chat to ask questions grounded in your uploaded documents.
        </p>
      </div>
    </div>
  );
}

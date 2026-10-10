"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { Menu, Search } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarNav } from "./sidebar-nav";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import { useProject } from "@/hooks/use-project";
import { useProjects } from "@/hooks/use-projects";

function humanize(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function useBreadcrumbs() {
  const pathname = usePathname();
  const params = useParams<{ projectId?: string }>();
  const { project } = useProject(params?.projectId ?? "");
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    let label = humanize(segment);
    if (params?.projectId && segment === params.projectId) {
      label = project?.name ?? "Project";
    }
    return { href, label, isLast: i === segments.length - 1 };
  });
}

export function Topbar() {
  const crumbs = useBreadcrumbs();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { projects } = useProjects();

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const match = projects.find((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));
    if (!query.trim()) return;
    if (match) {
      router.push(`/projects/${match.id}`);
      setQuery("");
    } else {
      toast("No matching project", { description: `Nothing found for "${query}".` });
    }
  }

  return (
    <header className="mac-vibrancy sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/70 px-4 sm:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-sidebar p-0 text-sidebar-foreground">
          <SheetHeader className="border-b border-sidebar-border px-4 py-4">
            <SheetTitle className="flex items-center gap-2 text-sidebar-foreground">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                M
              </span>
              MeshMind
            </SheetTitle>
          </SheetHeader>
          <div className="p-3">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <Breadcrumb className="hidden min-w-0 flex-1 sm:block">
        <BreadcrumbList>
          {crumbs.map((crumb) => (
            <Fragment key={crumb.href}>
              <BreadcrumbItem>
                {crumb.isLast ? (
                  <BreadcrumbPage className="max-w-[220px] truncate font-medium text-foreground">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href} className="max-w-[160px] truncate">
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!crumb.isLast && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-1.5">
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="h-8 w-52 rounded-full border-transparent bg-muted pl-8 text-sm shadow-none focus-visible:bg-card focus-visible:border-border lg:w-64"
          />
        </form>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}

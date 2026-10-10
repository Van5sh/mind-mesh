"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { SidebarNav } from "./sidebar-nav";
import { Topbar } from "./topbar";
import { PageLoader } from "@/components/ui/page-loader";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/getstarted");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <PageLoader fullHeight={false} />
      </div>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <aside className="mac-vibrancy hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/90 lg:flex">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border px-5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              M
            </span>
            <span className="text-sm font-semibold text-sidebar-foreground">MeshMind</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto brand-scrollbar p-3">
          <SidebarNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto brand-scrollbar bg-[radial-gradient(ellipse_90%_40%_at_50%_-10%,var(--muted),transparent)]">
          {children}
        </main>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, Brain, FileText, Sparkles, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Chat with your documents",
    desc: "Ask questions in plain language and get answers grounded directly in the files you've uploaded — no more digging through PDFs.",
    icon: Brain,
    accent: "text-primary",
  },
  {
    title: "AI-generated reports",
    desc: "Turn a project's worth of documents and conversations into a polished, shareable summary in seconds.",
    icon: FileText,
    accent: "text-teal",
  },
  {
    title: "Visual flowcharts",
    desc: "Map processes and decisions onto a canvas — by hand, or let the AI draft the first pass from your chats.",
    icon: Workflow,
    accent: "text-warning",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="delay-1000 absolute -right-32 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-teal/10 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            M
          </span>
          <span className="text-base font-semibold">MeshMind</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/getstarted">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/getstarted">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 py-16 text-center sm:px-10 sm:py-24">
        <div className="animate-fade-in space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            AI-powered knowledge platform
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Your documents,{" "}
            <span className="animate-gradient bg-linear-to-r from-primary via-teal to-primary bg-size-[200%_200%] bg-clip-text text-transparent">
              understood
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            MeshMind turns every file your team uploads into a searchable, chattable
            knowledge base — with AI-generated reports and flowcharts along the way.
          </p>

          <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
            <Button size="lg" className="group" asChild>
              <Link href="/getstarted">
                Get started free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">See how it works</Link>
            </Button>
          </div>
        </div>

        <div id="features" className="mt-24 grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-8 text-left transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
            >
              <feature.icon className={`h-8 w-8 ${feature.accent}`} />
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-20 max-w-3xl rounded-3xl border border-border bg-card p-10">
          <Sparkles className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Built for teams who live in documents</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Data rooms, research libraries, legal archives — MeshMind organizes projects around
            the files that matter, with role-based access so the right people see the right things.
          </p>
        </div>
      </main>

      <footer className="relative z-10 border-t border-border py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} MeshMind. All rights reserved.
      </footer>
    </div>
  );
}

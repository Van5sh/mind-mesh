"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReportFormat } from "@/lib/types";
import Link from "next/link";
import { toast } from "sonner";
import { useGetChats } from "@/hooks/use-project-chats";
import { useCreateReport } from "@/hooks/use-project-reports";

export default function NewReportPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();
  const { chats } = useGetChats(projectId);
  const { createReport } = useCreateReport();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [format, setFormat] = useState<ReportFormat>("MARKDOWN");
  const [sourceChatId, setSourceChatId] = useState<string>("none");
  const [submitting, setSubmitting] = useState(false);

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    try {
      const report = await createReport({
        projectId,
        title: title.trim(),
        content,
        format,
      });
      if (!report) return;
      router.push(`/projects/${projectId}/reports/${report.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create report");
    } finally {
      setSubmitting(false);
    }
  }

  function handleAISubmit(e: React.FormEvent) {
    e.preventDefault();
    toast("AI report generation isn't available yet", {
      description: "There's no backend endpoint for it - write the report manually for now.",
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
        <Link href={`/projects/${projectId}/reports`}>
          <ArrowLeft className="h-4 w-4" />
          Back to reports
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold tracking-tight">New report</h1>
      <p className="mt-1 text-sm text-muted-foreground">Write one yourself, or let the AI draft it.</p>

      <Tabs defaultValue="ai" className="mt-6">
        <TabsList>
          <TabsTrigger value="ai">
            <Sparkles className="h-3.5 w-3.5" />
            Generate with AI
          </TabsTrigger>
          <TabsTrigger value="manual">Write manually</TabsTrigger>
        </TabsList>

        <TabsContent value="ai">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">AI-generated report</CardTitle>
              <CardDescription>
                The assistant will draft a report from this project&apos;s files and chats.{" "}
                <span className="font-medium text-foreground">Coming soon</span> - there&apos;s no
                backend support for this yet, so generating is disabled below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAISubmit} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ai-title">Title</Label>
                  <Input id="ai-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Monthly Diligence Summary" autoFocus />
                </div>
                <div className="grid gap-2">
                  <Label>Base on a chat (optional)</Label>
                  <Select value={sourceChatId} onValueChange={setSourceChatId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific chat</SelectItem>
                      {chats.map((chat) => (
                        <SelectItem key={chat.id} value={chat.id}>
                          {chat.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={!title.trim()} variant="outline">
                    Generate report (coming soon)
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base">Write manually</CardTitle>
              <CardDescription>Markdown is supported.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="manual-title">Title</Label>
                  <Input id="manual-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Report title" />
                </div>
                <div className="grid gap-2">
                  <Label>Format</Label>
                  <Select value={format} onValueChange={(v) => setFormat(v as ReportFormat)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MARKDOWN">Markdown</SelectItem>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="DOCX">DOCX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="manual-content">Content</Label>
                  <Textarea
                    id="manual-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    placeholder="# Report title..."
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={!title.trim() || submitting}>
                    Create report
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

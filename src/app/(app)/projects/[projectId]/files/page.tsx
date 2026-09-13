"use client";

import { useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  Download,
  File as FileIcon,
  FolderPlus,
  Folder as FolderIcon,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { useProjectFiles, useProjectFolders, useStore } from "@/lib/store";
import { SUPPORTED_UPLOAD_TYPES } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function FilesPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const folders = useProjectFolders(projectId);
  const files = useProjectFiles(projectId, undefined);
  const { createFolder, uploadFile, renameFile, renameFolder, deleteFile, deleteFolder } = useStore();

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renaming, setRenaming] = useState<{ type: "file" | "folder"; id: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const trail = useMemo(() => {
    const path: { id: string | null; name: string }[] = [{ id: null, name: "All files" }];
    let cursor = currentFolderId;
    const stack: { id: string; name: string }[] = [];
    while (cursor) {
      const folder = folders.find((f) => f.id === cursor);
      if (!folder) break;
      stack.unshift({ id: folder.id, name: folder.name });
      cursor = folder.parentFolderId ?? null;
    }
    return [...path, ...stack];
  }, [currentFolderId, folders]);

  const visibleFolders = folders
    .filter((f) => (f.parentFolderId ?? null) === currentFolderId)
    .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));
  const visibleFiles = files
    .filter((f) => (f.folderId ?? null) === currentFolderId)
    .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    for (const f of selected) {
      const mimeType = f.type || "application/octet-stream";
      if (!SUPPORTED_UPLOAD_TYPES.includes(mimeType as (typeof SUPPORTED_UPLOAD_TYPES)[number])) {
        toast.error("Unsupported file type", {
          description: `${f.name} — only PDF, DOCX, and TXT files are supported.`,
        });
        continue;
      }
      uploadFile(projectId, { name: f.name, size: f.size, mimeType }, currentFolderId);
      toast("Uploading " + f.name, { description: "Processing will start automatically." });
    }
    e.target.value = "";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Files</h1>
          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            {trail.map((crumb, i) => (
              <span key={crumb.id ?? "root"} className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentFolderId(crumb.id)}
                  className={i === trail.length - 1 ? "font-medium text-foreground" : "hover:text-foreground"}
                >
                  {crumb.name}
                </button>
                {i < trail.length - 1 && <ChevronRight className="h-3.5 w-3.5" />}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setNewFolderOpen(true)}>
            <FolderPlus className="h-4 w-4" />
            New folder
          </Button>
          <Button onClick={handleUploadClick}>
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={handleFilesSelected}
          />
        </div>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search this folder…" className="pl-8" />
      </div>

      {visibleFolders.length === 0 && visibleFiles.length === 0 ? (
        <Empty className="mt-6 border border-dashed border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileIcon className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>{query ? "No matches" : "This folder is empty"}</EmptyTitle>
            <EmptyDescription>
              {query ? "Try a different search term." : "Upload a PDF, DOCX, or TXT file to get started."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleFolders.map((folder) => (
                <TableRow key={folder.id} className="cursor-pointer" onClick={() => setCurrentFolderId(folder.id)}>
                  <TableCell className="flex items-center gap-2 font-medium">
                    <FolderIcon className="h-4 w-4 text-primary" />
                    {folder.name}
                  </TableCell>
                  <TableCell />
                  <TableCell className="text-muted-foreground">—</TableCell>
                  <TableCell className="text-muted-foreground">{timeAgo(folder.updatedAt)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setRenaming({ type: "folder", id: folder.id, name: folder.name })}
                        >
                          <Pencil className="h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            deleteFolder(folder.id);
                            toast("Folder deleted", { description: folder.name });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {visibleFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="flex items-center gap-2 font-medium">
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="truncate">{file.name}</span>
                      {file.aiMetadata.summary && (
                        <span className="line-clamp-1 max-w-md text-xs font-normal text-muted-foreground">
                          {file.aiMetadata.summary}
                        </span>
                      )}
                      {file.aiMetadata.errorMessage && (
                        <span className="line-clamp-1 max-w-md text-xs font-normal text-destructive">
                          {file.aiMetadata.errorMessage}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={file.aiMetadata.processingStatus} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatSize(file.size)}</TableCell>
                  <TableCell className="text-muted-foreground">{timeAgo(file.updatedAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => toast("Download started (mock)", { description: file.name })}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRenaming({ type: "file", id: file.id, name: file.name })}>
                          <Pencil className="h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            deleteFile(file.id);
                            toast("File deleted", { description: file.name });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
          </DialogHeader>
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            autoFocus
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNewFolderOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!newFolderName.trim()}
              onClick={() => {
                createFolder(projectId, newFolderName.trim(), currentFolderId);
                setNewFolderName("");
                setNewFolderOpen(false);
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={renaming !== null} onOpenChange={(open) => !open && setRenaming(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {renaming?.type}</DialogTitle>
          </DialogHeader>
          <Input
            value={renaming?.name ?? ""}
            onChange={(e) => setRenaming((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
            autoFocus
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenaming(null)}>
              Cancel
            </Button>
            <Button
              disabled={!renaming?.name.trim()}
              onClick={() => {
                if (!renaming) return;
                if (renaming.type === "file") renameFile(renaming.id, renaming.name.trim());
                else renameFolder(renaming.id, renaming.name.trim());
                setRenaming(null);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

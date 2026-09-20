"use client";

import { useMemo, useRef, useState } from "react";
import {
  ChevronRight,
  Clock,
  Folder as FolderIcon,
  FolderPlus,
  Grid3x3,
  HardDrive,
  List as ListIcon,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { DriveFile, DriveFolder } from "@/lib/types";
import { formatBytes, timeAgo } from "@/lib/format";
import { FileIcon } from "@/components/file-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { toast } from "sonner";

type Section = "all" | "recent" | "starred" | "trash";
type SortKey = "name" | "modified" | "size";
type ViewMode = "grid" | "list";

const STORAGE_QUOTA_BYTES = 15 * 1024 * 1024 * 1024; // 15 GB, Drive-familiar
const SECTIONS: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All Files", icon: HardDrive },
  { key: "recent", label: "Recent", icon: Clock },
  { key: "starred", label: "Starred", icon: Star },
  { key: "trash", label: "Trash", icon: Trash2 },
];

export default function FilesPage() {
  // TODO(graphql): empty placeholder until the GraphQL hook is wired.
  const driveFolders: DriveFolder[] = [];
  const driveFiles: DriveFile[] = [];
  const noop = (..._args: unknown[]): void => {};
  const createDriveFolder = noop;
  const renameDriveFolder = noop;
  const trashDriveFolder = noop;
  const restoreDriveFolder = noop;
  const deleteDriveFolderForever = noop;
  const uploadDriveFile = noop;
  const renameDriveFile = noop;
  const toggleStarDriveFile = noop;
  const trashDriveFile = noop;
  const restoreDriveFile = noop;
  const deleteDriveFileForever = noop;
  const emptyDriveTrash = noop;

  const [section, setSection] = useState<Section>("all");
  const [folderId, setFolderId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("name");
  const [view, setView] = useState<ViewMode>("grid");
  const [dragOver, setDragOver] = useState(false);

  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renaming, setRenaming] = useState<{ type: "file" | "folder"; id: string; name: string } | null>(null);
  const [activeFile, setActiveFile] = useState<DriveFile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFolders = driveFolders.filter((f) => !f.deletedAt);
  const activeFiles = driveFiles.filter((f) => !f.deletedAt);

  const trail = useMemo(() => {
    const path: { id: string | null; name: string }[] = [{ id: null, name: "All Files" }];
    const stack: { id: string; name: string }[] = [];
    let cursor = folderId;
    while (cursor) {
      const folder = activeFolders.find((f) => f.id === cursor);
      if (!folder) break;
      stack.unshift({ id: folder.id, name: folder.name });
      cursor = folder.parentId ?? null;
    }
    return [...path, ...stack];
  }, [folderId, activeFolders]);

  function sortItems<T extends { name: string; updatedAt: string }>(items: T[]) {
    const sorted = [...items];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "modified") sorted.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
    return sorted;
  }

  let visibleFolders: DriveFolder[] = [];
  let visibleFiles: DriveFile[] = [];
  let isTrash = false;

  if (section === "all") {
    visibleFolders = activeFolders.filter((f) => (f.parentId ?? null) === folderId);
    visibleFiles = activeFiles.filter((f) => (f.folderId ?? null) === folderId);
  } else if (section === "recent") {
    visibleFiles = [...activeFiles].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, 30);
  } else if (section === "starred") {
    visibleFiles = activeFiles.filter((f) => f.starred);
  } else if (section === "trash") {
    isTrash = true;
    visibleFolders = driveFolders.filter((f) => f.deletedAt);
    visibleFiles = driveFiles.filter((f) => f.deletedAt);
  }

  if (query.trim()) {
    const q = query.trim().toLowerCase();
    visibleFolders = visibleFolders.filter((f) => f.name.toLowerCase().includes(q));
    visibleFiles = visibleFiles.filter((f) => f.name.toLowerCase().includes(q));
  }
  if (section !== "recent") {
    visibleFolders = sortItems(visibleFolders);
  }
  visibleFiles =
    sort === "size"
      ? [...visibleFiles].sort((a, b) => b.size - a.size)
      : section === "recent"
        ? visibleFiles
        : sortItems(visibleFiles);

  const usedBytes = activeFiles.reduce((sum, f) => sum + f.size, 0);
  const usedPct = Math.min(100, (usedBytes / STORAGE_QUOTA_BYTES) * 100);

  function openSection(next: Section) {
    setSection(next);
    setFolderId(null);
    setQuery("");
  }

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList) return;
    for (const f of Array.from(fileList)) {
      const mimeType = f.type || "application/octet-stream";
      uploadDriveFile({ name: f.name, size: f.size, mimeType }, folderId);
    }
    if (fileList.length > 0) {
      toast.success(fileList.length === 1 ? "File uploaded" : `${fileList.length} files uploaded`);
    }
  }

  const canUploadHere = section === "all";

  return (
    <div
      className="flex h-[calc(100dvh-3.5rem)] flex-col lg:flex-row"
      onDragOver={(e) => {
        if (!canUploadHere) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        if (!canUploadHere) return;
        e.preventDefault();
        setDragOver(false);
        handleFilesSelected(e.dataTransfer.files);
      }}
    >
      {/* Quick-access rail */}
      <div className="flex shrink-0 flex-col gap-4 border-b border-border px-4 py-4 lg:w-56 lg:border-b-0 lg:border-r lg:px-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="justify-start gap-2">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => setNewFolderOpen(true)}>
              <FolderPlus className="h-4 w-4" />
              New folder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Upload files
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFilesSelected(e.target.files);
            e.target.value = "";
          }}
        />

        <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => openSection(s.key)}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                section === s.key
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="hidden flex-1 lg:block" />

        <div className="hidden flex-col gap-1.5 rounded-lg border border-border p-3 lg:flex">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Storage</span>
            <span className="text-muted-foreground">{formatBytes(usedBytes)} of 15 GB</span>
          </div>
          <Progress value={usedPct} className="h-1.5" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {section === "all" ? (
              <div className="flex min-w-0 items-center gap-1 text-sm">
                {trail.map((crumb, i) => (
                  <span key={crumb.id ?? "root"} className="flex items-center gap-1">
                    <button
                      onClick={() => setFolderId(crumb.id)}
                      className={cn(
                        "truncate rounded px-1.5 py-0.5",
                        i === trail.length - 1
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      {crumb.name}
                    </button>
                    {i < trail.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                  </span>
                ))}
              </div>
            ) : (
              <h1 className="text-lg font-semibold">{SECTIONS.find((s) => s.key === section)?.label}</h1>
            )}

            <div className="flex items-center gap-2">
              {isTrash && (visibleFiles.length > 0 || visibleFolders.length > 0) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    emptyDriveTrash();
                    toast("Trash emptied");
                  }}
                >
                  Empty trash
                </Button>
              )}
              <div className="flex items-center rounded-lg border border-border p-0.5">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={cn("rounded-md", view === "grid" && "bg-secondary")}
                  onClick={() => setView("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={cn("rounded-md", view === "list" && "bg-secondary")}
                  onClick={() => setView("list")}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search files…"
                className="h-8 rounded-full bg-muted pl-8 text-sm shadow-none"
              />
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="h-8 w-36 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="modified">Last modified</SelectItem>
                <SelectItem value="size">Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto brand-scrollbar p-4 sm:p-6">
          {visibleFolders.length === 0 && visibleFiles.length === 0 ? (
            <Empty className="border border-dashed border-border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  {section === "trash" ? <Trash2 className="h-6 w-6" /> : <HardDrive className="h-6 w-6" />}
                </EmptyMedia>
                <EmptyTitle>
                  {query
                    ? "No matches"
                    : section === "trash"
                      ? "Trash is empty"
                      : section === "starred"
                        ? "No starred files"
                        : section === "recent"
                          ? "No recent files"
                          : "This folder is empty"}
                </EmptyTitle>
                <EmptyDescription>
                  {section === "all" && !query && "Drag and drop files here, or use New to upload."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {visibleFolders.map((folder) => (
                <div
                  key={folder.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => !isTrash && setFolderId(folder.id)}
                  onKeyDown={(e) => {
                    if (!isTrash && (e.key === "Enter" || e.key === " ")) setFolderId(folder.id);
                  }}
                  className="group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl p-3 text-center outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <FolderIcon className="h-12 w-12 fill-info/20 text-info" strokeWidth={1.5} />
                  <span className="line-clamp-2 w-full truncate text-xs font-medium">{folder.name}</span>
                  <FolderRowActions
                    isTrash={isTrash}
                    onRename={() => setRenaming({ type: "folder", id: folder.id, name: folder.name })}
                    onTrash={() => {
                      trashDriveFolder(folder.id);
                      toast("Moved to Trash", { description: folder.name });
                    }}
                    onRestore={() => restoreDriveFolder(folder.id)}
                    onDeleteForever={() => deleteDriveFolderForever(folder.id)}
                  />
                </div>
              ))}
              {visibleFiles.map((file) => (
                <div
                  key={file.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => !isTrash && setActiveFile(file)}
                  onKeyDown={(e) => {
                    if (!isTrash && (e.key === "Enter" || e.key === " ")) setActiveFile(file);
                  }}
                  className="group relative flex cursor-pointer flex-col items-center gap-2 rounded-xl p-3 text-center outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {file.starred && <Star className="absolute right-2 top-2 h-3.5 w-3.5 fill-warning text-warning" />}
                  <FileIcon mimeType={file.mimeType} className="h-10 w-10" />
                  <span className="line-clamp-2 w-full truncate text-xs font-medium">{file.name}</span>
                  <FileRowActions
                    isTrash={isTrash}
                    starred={file.starred}
                    onStar={() => toggleStarDriveFile(file.id)}
                    onRename={() => setRenaming({ type: "file", id: file.id, name: file.name })}
                    onTrash={() => {
                      trashDriveFile(file.id);
                      toast("Moved to Trash", { description: file.name });
                    }}
                    onRestore={() => restoreDriveFile(file.id)}
                    onDeleteForever={() => deleteDriveFileForever(file.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="hidden px-4 py-2 font-medium sm:table-cell">Size</th>
                    <th className="hidden px-4 py-2 font-medium sm:table-cell">Modified</th>
                    <th className="w-10 px-4 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visibleFolders.map((folder) => (
                    <tr
                      key={folder.id}
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => !isTrash && setFolderId(folder.id)}
                    >
                      <td className="flex items-center gap-2.5 px-4 py-2.5 font-medium">
                        <FolderIcon className="h-4 w-4 fill-info/20 text-info" />
                        {folder.name}
                      </td>
                      <td className="hidden px-4 py-2.5 text-muted-foreground sm:table-cell">—</td>
                      <td className="hidden px-4 py-2.5 text-muted-foreground sm:table-cell">{timeAgo(folder.updatedAt)}</td>
                      <td className="px-2" onClick={(e) => e.stopPropagation()}>
                        <FolderRowActions
                          isTrash={isTrash}
                          menuOnly
                          onRename={() => setRenaming({ type: "folder", id: folder.id, name: folder.name })}
                          onTrash={() => trashDriveFolder(folder.id)}
                          onRestore={() => restoreDriveFolder(folder.id)}
                          onDeleteForever={() => deleteDriveFolderForever(folder.id)}
                        />
                      </td>
                    </tr>
                  ))}
                  {visibleFiles.map((file) => (
                    <tr key={file.id} className="cursor-pointer hover:bg-accent/50" onClick={() => !isTrash && setActiveFile(file)}>
                      <td className="flex items-center gap-2.5 px-4 py-2.5 font-medium">
                        <FileIcon mimeType={file.mimeType} />
                        <span className="truncate">{file.name}</span>
                        {file.starred && <Star className="h-3.5 w-3.5 shrink-0 fill-warning text-warning" />}
                      </td>
                      <td className="hidden px-4 py-2.5 text-muted-foreground sm:table-cell">{formatBytes(file.size)}</td>
                      <td className="hidden px-4 py-2.5 text-muted-foreground sm:table-cell">{timeAgo(file.updatedAt)}</td>
                      <td className="px-2" onClick={(e) => e.stopPropagation()}>
                        <FileRowActions
                          isTrash={isTrash}
                          starred={file.starred}
                          menuOnly
                          onStar={() => toggleStarDriveFile(file.id)}
                          onRename={() => setRenaming({ type: "file", id: file.id, name: file.name })}
                          onTrash={() => trashDriveFile(file.id)}
                          onRestore={() => restoreDriveFile(file.id)}
                          onDeleteForever={() => deleteDriveFileForever(file.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {dragOver && (
          <div className="pointer-events-none absolute inset-0 z-10 m-4 flex items-center justify-center rounded-2xl border-2 border-dashed border-foreground/40 bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-foreground">
              <Upload className="h-8 w-8" />
              <p className="text-sm font-medium">Drop to upload</p>
            </div>
          </div>
        )}
      </div>

      {/* New folder dialog */}
      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
          </DialogHeader>
          <Input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Untitled folder" autoFocus />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNewFolderOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!newFolderName.trim()}
              onClick={() => {
                createDriveFolder(newFolderName.trim(), section === "all" ? folderId : null);
                setNewFolderName("");
                setNewFolderOpen(false);
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename dialog */}
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
                if (renaming.type === "file") renameDriveFile(renaming.id, renaming.name.trim());
                else renameDriveFolder(renaming.id, renaming.name.trim());
                setRenaming(null);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File details */}
      <Sheet open={activeFile !== null} onOpenChange={(open) => !open && setActiveFile(null)}>
        <SheetContent className="w-full sm:max-w-sm">
          {activeFile && (
            <>
              <SheetHeader>
                <SheetTitle className="sr-only">File details</SheetTitle>
                <div className="flex flex-col items-center gap-3 pt-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <FileIcon mimeType={activeFile.mimeType} className="h-8 w-8" />
                  </div>
                  <p className="max-w-full truncate px-4 text-base font-semibold">{activeFile.name}</p>
                </div>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4 pb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Size</span>
                  <span>{formatBytes(activeFile.size)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Modified</span>
                  <span>{timeAgo(activeFile.updatedAt)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span className="truncate pl-4">{activeFile.mimeType}</span>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      toggleStarDriveFile(activeFile.id);
                      setActiveFile({ ...activeFile, starred: !activeFile.starred });
                    }}
                  >
                    <Star className={cn("h-4 w-4", activeFile.starred && "fill-warning text-warning")} />
                    {activeFile.starred ? "Remove star" : "Add star"}
                  </Button>
                  <Button variant="outline" onClick={() => toast("Download started (mock)", { description: activeFile.name })}>
                    <Upload className="h-4 w-4 rotate-180" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      trashDriveFile(activeFile.id);
                      toast("Moved to Trash", { description: activeFile.name });
                      setActiveFile(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Move to Trash
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function FolderRowActions({
  isTrash,
  menuOnly,
  onRename,
  onTrash,
  onRestore,
  onDeleteForever,
}: {
  isTrash: boolean;
  menuOnly?: boolean;
  onRename: () => void;
  onTrash: () => void;
  onRestore: () => void;
  onDeleteForever: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(!menuOnly && "absolute right-1 top-1 opacity-0 group-hover:opacity-100")}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {isTrash ? (
          <>
            <DropdownMenuItem onClick={onRestore}>Restore</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={onDeleteForever}>
              Delete forever
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={onTrash}>
              <Trash2 className="h-4 w-4" />
              Move to Trash
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FileRowActions({
  isTrash,
  menuOnly,
  starred,
  onStar,
  onRename,
  onTrash,
  onRestore,
  onDeleteForever,
}: {
  isTrash: boolean;
  menuOnly?: boolean;
  starred?: boolean;
  onStar?: () => void;
  onRename: () => void;
  onTrash: () => void;
  onRestore: () => void;
  onDeleteForever: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(!menuOnly && "absolute right-1 top-1 opacity-0 group-hover:opacity-100")}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {isTrash ? (
          <>
            <DropdownMenuItem onClick={onRestore}>Restore</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={onDeleteForever}>
              <X className="h-4 w-4" />
              Delete forever
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {onStar && (
              <DropdownMenuItem onClick={onStar}>
                <Star className="h-4 w-4" />
                {starred ? "Remove star" : "Add star"}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={onTrash}>
              <Trash2 className="h-4 w-4" />
              Move to Trash
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

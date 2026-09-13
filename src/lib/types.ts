/**
 * Frontend types mirroring the MeshMind GraphQL schema (see
 * BACKEND_HANDOFF.md). Kept structurally identical to the backend's domain
 * model so swapping the mock store for real GraphQL queries later doesn't
 * require redesigning any component's props.
 */

export type ID = string;

// ---------------------------------------------------------------------------
// Enums (exact string values match the backend's GraphQL enums)
// ---------------------------------------------------------------------------

export type ProjectVisibility = "PRIVATE" | "TEAM";
export type ProjectRole = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

export type ChatType = "GENERAL" | "AI_ASSISTANT";
export type ChatStatus = "ACTIVE" | "GENERATING" | "ARCHIVED";
export type MessageRole = "USER" | "AI" | "SYSTEM";

export type ReportFormat = "MARKDOWN" | "PDF" | "DOCX";
export type ReportStatus = "DRAFT" | "GENERATING" | "READY" | "FAILED";

export type FlowchartStatus = "DRAFT" | "GENERATING" | "READY" | "FAILED";

export type FileProcessingStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export type FilePermission = "READ" | "WRITE";

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export interface User {
  id: ID;
  username: string;
  email: string;
  avatarUrl?: string | null;
  firstName?: string;
  lastName?: string;
  bio?: string | null;
  createdAt: string;
}

export interface ProjectMember {
  id: ID;
  projectId: ID;
  user: User;
  role: ProjectRole;
  createdAt: string;
}

export interface Project {
  id: ID;
  name: string;
  description?: string | null;
  visibility: ProjectVisibility;
  ownerId: ID;
  memberIds: ID[];
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: ID;
  projectId: ID;
  parentFolderId?: ID | null;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileStorage {
  bucketName: string;
  objectKey: string;
  mimeType: string;
  uploadedById: ID;
  downloadUrl: string;
  createdAt: string;
}

export interface FileAIMetadata {
  processingStatus: FileProcessingStatus;
  summary?: string | null;
  errorMessage?: string | null;
  extractedText?: string | null;
  embeddingSynced: boolean;
  indexedAt?: string | null;
}

export interface ProjectFile {
  id: ID;
  projectId: ID;
  folderId?: ID | null;
  name: string;
  size: number;
  storage: FileStorage;
  aiMetadata: FileAIMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: ID;
  projectId: ID;
  title?: string | null;
  type: ChatType;
  status: ChatStatus;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: ID;
  chatId: ID;
  senderId?: ID | null;
  role: MessageRole;
  content: string;
  createdAt: string;
  /** Frontend-only: marks an optimistic/pending AI reply being "generated". */
  pending?: boolean;
}

export interface ReportProperties {
  generatedById?: ID | null;
  generatedByAI: boolean;
  status: ReportStatus;
  sourceChatId?: ID | null;
}

export interface Report {
  id: ID;
  projectId: ID;
  title: string;
  content: string;
  format: ReportFormat;
  properties: ReportProperties;
  createdAt: string;
  updatedAt: string;
}

export interface Flowchart {
  id: ID;
  projectId: ID;
  name: string;
  data: string; // JSON-encoded React Flow graph
  generatedById?: ID | null;
  generatedByAI: boolean;
  status: FlowchartStatus;
  sourceChatId?: ID | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: ID;
  projectId?: ID | null;
  userId?: ID | null;
  action: string;
  entityType?: string | null;
  entityId?: ID | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Personal drive (frontend-only, independent of any project — a simple
// upload-and-store space in the spirit of Google Drive/iCloud Drive).
// ---------------------------------------------------------------------------

export interface DriveFolder {
  id: ID;
  parentId?: ID | null;
  name: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DriveFile {
  id: ID;
  folderId?: ID | null;
  name: string;
  size: number;
  mimeType: string;
  downloadUrl: string;
  starred: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const SUPPORTED_UPLOAD_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const;

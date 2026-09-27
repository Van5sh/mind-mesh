import type { FileFieldsFragment } from "@/graphql/generated/graphql";
import type { FileAIMetadata, FileStorage, ID, ProjectFile } from "@/lib/types";

/**
 * A file can exist before its storage row does (nothing uploaded yet), so
 * `storage` may be null here even though `ProjectFile` types it as required.
 */
export type ProjectFileRow = Omit<ProjectFile, "storage"> & {
  storage: FileStorage | null;
  deletedAt: string | null;
};

type GqlStorage = NonNullable<FileFieldsFragment["storage"]>;
type GqlAIMetadata = FileFieldsFragment["aiMetadata"];

export function toFileStorage(s: GqlStorage): FileStorage {
  return {
    bucketName: s.bucketName,
    objectKey: s.objectKey,
    mimeType: s.mimeType,
    uploadedById: s.uploadedBy.id,
    downloadUrl: s.downloadUrl,
    createdAt: s.createdAt,
  };
}

/** No metadata row yet means "not processed yet", i.e. PENDING. */
export function toFileAIMetadata(m: GqlAIMetadata): FileAIMetadata {
  if (!m) {
    return { processingStatus: "PENDING", embeddingSynced: false };
  }
  return {
    processingStatus: m.processingStatus,
    summary: m.summary,
    errorMessage: m.errorMessage,
    extractedText: m.extractedText,
    embeddingSynced: m.embeddingSynced,
    indexedAt: m.indexedAt,
  };
}

/**
 * FileFields has no project; that comes from where you fetched it.
 * folderId comes from the fragment's own `folder` field when present (e.g.
 * a flat list from useFiles) - ctx.folderId is a fallback for callers that
 * already know it and don't select folder (e.g. useRootFiles).
 */
export function toProjectFile(
  f: FileFieldsFragment,
  ctx: { projectId: ID; folderId?: ID | null },
): ProjectFileRow {
  return {
    id: f.id,
    projectId: ctx.projectId,
    folderId: f.folder?.id ?? ctx.folderId ?? null,
    name: f.name,
    size: f.size,
    storage: f.storage ? toFileStorage(f.storage) : null,
    aiMetadata: toFileAIMetadata(f.aiMetadata),
    deletedAt: f.properties.deletedAt ?? null,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
  };
}

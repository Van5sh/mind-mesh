import type { FileFieldsFragment } from "@/graphql/generated/graphql";
import type { FileAIMetadata, FileStorage, ID, ProjectFile } from "@/lib/types";

/**
 * A file can exist before its storage row does (nothing uploaded yet), so
 * `storage` may be null here even though `ProjectFile` types it as required.
 */
export type ProjectFileRow = Omit<ProjectFile, "storage"> & {
  storage: FileStorage | null;
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

/** FileFields has no project or folder; they come from where you fetched it. */
export function toProjectFile(
  f: FileFieldsFragment,
  ctx: { projectId: ID; folderId?: ID | null },
): ProjectFileRow {
  return {
    id: f.id,
    projectId: ctx.projectId,
    folderId: ctx.folderId ?? null,
    name: f.name,
    size: f.size,
    storage: f.storage ? toFileStorage(f.storage) : null,
    aiMetadata: toFileAIMetadata(f.aiMetadata),
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
  };
}

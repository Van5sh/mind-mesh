import type { FolderFieldsFragment } from "@/graphql/generated/graphql";
import type { Folder, ID } from "@/lib/types";

/**
 * FolderFields has no project; that comes from where you fetched it.
 * parentFolderId comes from the fragment's own `parentFolder` field when
 * present (e.g. a flat list from useFolders) - ctx.parentFolderId is a
 * fallback for callers that already know it and don't select parentFolder
 * (e.g. useRootFolders, useFolderContents).
 */
export function toFolder(
  f: FolderFieldsFragment,
  ctx: { projectId: ID; parentFolderId?: ID | null },
): Folder {
  return {
    id: f.id,
    projectId: ctx.projectId,
    parentFolderId: f.parentFolder?.id ?? ctx.parentFolderId ?? null,
    name: f.name,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
  };
}

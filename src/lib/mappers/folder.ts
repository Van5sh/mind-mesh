import type { FolderFieldsFragment } from "@/graphql/generated/graphql";
import type { Folder, ID } from "@/lib/types";

/** FolderFields has no project or parent; they come from where you fetched it. */
export function toFolder(
  f: FolderFieldsFragment,
  ctx: { projectId: ID; parentFolderId?: ID | null },
): Folder {
  return {
    id: f.id,
    projectId: ctx.projectId,
    parentFolderId: ctx.parentFolderId ?? null,
    name: f.name,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
  };
}

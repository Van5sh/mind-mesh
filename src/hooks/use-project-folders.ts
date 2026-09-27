"use client"

import { DeleteFolderDocument, GetFolderContentsDocument, GetFoldersDocument, GetFolderTreeDocument, GetTrashedFoldersDocument, MoveFolderDocument, RenameFolderDocument, RestoreFolderDocument, TrashFolderDocument } from "@/graphql/generated/graphql";
import { toFolder } from "@/lib/mappers/folder";
import { toProjectFile } from "@/lib/mappers/file";
import { useMutation, useQuery } from "@apollo/client/react"
import { useMemo } from "react";

export function useFolders(projectId: string) {
  const { data, loading, error } = useQuery(GetFoldersDocument, {
    variables: { projectId },
  });

  const folders = useMemo(
    () => (data?.folders ?? []).map((f) => toFolder(f, { projectId })),
    [data, projectId],
  );

  return {
    folders,
    loading: loading && !data,
    error,
  };
}

export function useFolderContents(projectId: string, folderId?: string | null) {
  const { data, loading, error } = useQuery(GetFolderContentsDocument, {
    variables: { projectId, folderId },
  });

  const { folders, files } = useMemo(() => {
    const items = data?.folderContents ?? [];
    return {
      folders: items
        .filter((c) => c.__typename === "Folder")
        .map((f) => toFolder(f, { projectId, parentFolderId: folderId })),
      files: items
        .filter((c) => c.__typename === "File")
        .map((f) => toProjectFile(f, { projectId, folderId })),
    };
  }, [data, projectId, folderId]);

  return {
    folders,
    files,
    loading: loading && !data,
    error,
  };
}

// projectId isn't part of GetFolderTree's result (FolderFields carries no
// project id of its own), so the caller passes the one it already knows.
export function useFolderTree(projectId: string, folderId: string) {
  const { data, loading, error } = useQuery(GetFolderTreeDocument, {
    variables: { id: folderId },
  });

  const tree = useMemo(() => {
    if (!data?.folder) return undefined;
    const { parentFolder, childFolders, ...folder } = data.folder;
    return {
      folder: toFolder(folder, { projectId, parentFolderId: parentFolder?.id }),
      parentFolder: parentFolder
        ? toFolder(parentFolder, { projectId })
        : null,
      childFolders: childFolders.map((f) =>
        toFolder(f, { projectId, parentFolderId: folderId }),
      ),
    };
  }, [data, projectId, folderId]);

  return {
    tree,
    loading: loading && !data,
    error,
  };
}

export function useRenameFolder() {
    const [mutate,{loading}]=useMutation(RenameFolderDocument);
    async function renameFolder(name:string,folderId:string) {
        const result=await mutate({
            variables:{
                name:name,
                folderId,
            }
        })
        return result.data?.renameFolder
    }
    return {
        renameFolder,loading
    }
}

export function useMoveFolder() {
    const [mutate,{loading}]=useMutation(MoveFolderDocument);
    async function moveFolder(folderId:string, parentFolderId?:string|null) {
        const result=await mutate({
            variables:{
                folderId,
                parentFolderId,
            }
        })
        return result.data?.moveFolder
    }
    return {
        moveFolder,loading
    }
}

export function useDeleteFolder() {
    const [mutate,{loading}]=useMutation(DeleteFolderDocument);
    async function deleteFolder(folderId:string) {
        const result=await mutate({
            variables:{
                folderId
            }
        })
        return result.data?.deleteFolder
    }
    return {deleteFolder,loading}
}

// Folders are always project-scoped, so unlike files' trash there's no
// personal variant.
export function useTrashedFolders(projectId: string) {
  const { data, loading, error } = useQuery(GetTrashedFoldersDocument, {
    variables: { projectId },
  });

  const trashedFolders = useMemo(
    () => (data?.trashedFolders ?? []).map((f) => toFolder(f, { projectId })),
    [data, projectId],
  );

  return {
    trashedFolders,
    loading: loading && !data,
    error,
  };
}

// Soft delete (reversible via useRestoreFolder) - deleteFolder above is
// permanent. It does not cascade: contents of a trashed folder aren't
// themselves trashed. The caller is responsible for refetching whichever
// list (folders/trashedFolders) it's showing.
export function useTrashFolder() {
    const [mutate,{loading}]=useMutation(TrashFolderDocument);
    async function trashFolder(folderId:string) {
        const result=await mutate({
            variables:{
                folderId
            }
        })
        return result.data?.trashFolder
    }
    return {trashFolder,loading}
}

export function useRestoreFolder() {
    const [mutate,{loading}]=useMutation(RestoreFolderDocument);
    async function restoreFolder(folderId:string) {
        const result=await mutate({
            variables:{
                folderId
            }
        })
        return result.data?.restoreFolder
    }
    return {restoreFolder,loading}
}

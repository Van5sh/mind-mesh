"use client"

import { DeleteFolderDocument, GetFolderContentsDocument, GetFoldersDocument, GetFolderTreeDocument, MoveFolderDocument, RenameFolderDocument } from "@/graphql/generated/graphql";
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

"use client"

import {
    CreateFileDocument,
    DeleteFileDocument,
    DeleteFileShareDocument,
    GetFavoriteFilesDocument,
    GetRootFilesDocument,
    GetRootFoldersDocument,
    GetSharedWithMeDocument,
    MoveFileDocument,
    RenameFileDocument,
    SetFileFavoriteDocument,
    ShareFileDocument,
    UpdateFileSharePermissionDocument,
    type CreateFileInput,
    type FilePermission,
    type MoveFileInput,
    type ShareFileInput,
} from "@/graphql/generated/graphql"
import { toFolder } from "@/lib/mappers/folder";
import { toProjectFile } from "@/lib/mappers/file";
import { useMutation, useQuery } from "@apollo/client/react"
import { useMemo } from "react";

// projectId omitted - the current user's personal (project-less) files.
export function useRootFiles(projectId?:string) {
    const {data,loading,error}=useQuery(GetRootFilesDocument,{
        variables:{
            projectId
        }
    });
    const rootFiles=useMemo(
        ()=>(data?.rootFiles ?? []).map((f)=>toProjectFile(f,{projectId:projectId ?? "",folderId:null})),
        [data,projectId],
    );
    return {
        rootFiles,
        loading:loading && !data,
        error
    }
}

export function useFavoriteFiles(userId:string,projectId?:string) {
    const {data,loading,error}=useQuery(GetFavoriteFilesDocument,{
        variables:{
            userId,
            projectId
        }
    });
    const favorites=useMemo(
        ()=>(data?.favoriteFiles ?? []).map((f)=>toProjectFile(f,{projectId:projectId ?? "",folderId:null})),
        [data,projectId],
    )
    return {
        favorites,
        loading:loading && !data,
        error
    }
}

export function useRootFolders(projectId:string) {
    const {data,loading,error}=useQuery(GetRootFoldersDocument,{
        variables:{
            projectId
        }
    });
    const rootFolders=useMemo(
        ()=>(data?.rootFolders ?? []).map((f)=>toFolder(f,{projectId,parentFolderId:null})),
        [data,projectId],
    );
    return {
        rootFolders,
        loading:loading && !data,
        error
    }
}

export function useSharedWithMe(userId:string) {
    const {data,loading,error}=useQuery(GetSharedWithMeDocument,{
        variables:{
            userId
        }
    });
    const sharedWithMe=data?.sharedWithMe ?? [];
    return {
        sharedWithMe,
        loading:loading && !data,
        error
    }
}

export function useCreateFile() {
    const [mutate,{loading}]=useMutation(CreateFileDocument);
    async function createFile(input:CreateFileInput) {
        const result=await mutate({
            variables:{
                input
            }
        })
        return result.data?.createFile
    }
    return {createFile,loading}
}

export function useRenameFile() {
    const [mutate,{loading}]=useMutation(RenameFileDocument);
    async function renameFile(fileId:string,name:string) {
        const result=await mutate({
            variables:{
                fileId,
                name
            }
        })
        return result.data?.renameFile
    }
    return {renameFile,loading}
}

export function useMoveFile() {
    const [mutate,{loading}]=useMutation(MoveFileDocument);
    async function moveFile(input:MoveFileInput) {
        const result=await mutate({
            variables:{
                input
            }
        })
        return result.data?.moveFile
    }
    return {moveFile,loading}
}

export function useDeleteFile() {
    const [mutate,{loading}]=useMutation(DeleteFileDocument);
    async function deleteFile(fileId:string) {
        const result=await mutate({
            variables:{
                fileId
            }
        })
        return result.data?.deleteFile
    }
    return {deleteFile,loading}
}

export function useShareFile() {
    const [mutate,{loading}]=useMutation(ShareFileDocument);
    async function shareFile(input:ShareFileInput) {
        const result=await mutate({
            variables:{
                input
            }
        })
        return result.data?.shareFile
    }
    return {shareFile,loading}
}

export function useUpdateFileSharePermission() {
    const [mutate,{loading}]=useMutation(UpdateFileSharePermissionDocument);
    async function updateFileSharePermission(fileShareId:string,permission:FilePermission) {
        const result=await mutate({
            variables:{
                fileShareId,
                permission
            }
        })
        return result.data?.updateFileSharePermission
    }
    return {updateFileSharePermission,loading}
}

export function useDeleteFileShare() {
    const [mutate,{loading}]=useMutation(DeleteFileShareDocument);
    async function deleteFileShare(fileShareId:string) {
        const result=await mutate({
            variables:{
                fileShareId
            }
        })
        return result.data?.deleteFileShare
    }
    return {deleteFileShare,loading}
}

export function useSetFileFavorite() {
    const [mutate,{loading}]=useMutation(SetFileFavoriteDocument);
    async function setFileFavorite(fileId:string,userId:string,isFavorite:boolean) {
        const result=await mutate({
            variables:{
                input:{
                    fileId,
                    userId,
                    isFavorite
                }
            }
        })
        return result.data?.setFileFavorite
    }
    return {setFileFavorite,loading}
}
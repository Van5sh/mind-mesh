"use client"

import {
    GetFileDocument,
    GetFileWithSharesDocument,
    GetFilesDocument,
} from "@/graphql/generated/graphql"
import { toProjectFile } from "@/lib/mappers/file";
import { useQuery } from "@apollo/client/react"
import { useMemo } from "react";


export {
    useCreateFile,
    useRenameFile,
    useMoveFile,
    useDeleteFile,
    useShareFile,
    useUpdateFileSharePermission,
    useDeleteFileShare,
    useSetFileFavorite,
} from "./use-drive";


export function useFiles(projectId?:string,folderId?:string|null) {
    const {data,loading,error}=useQuery(GetFilesDocument,{
        variables:{
            projectId,
            folderId
        }
    });
    const files=useMemo(
        ()=>(data?.files ?? []).map((f)=>toProjectFile(f,{projectId:projectId ?? "",folderId})),
        [data,projectId,folderId],
    );
    return {
        files,
        loading:loading && !data,
        error
    }
}

export function useFile(projectId:string,id:string) {
    const {data,loading,error}=useQuery(GetFileDocument,{
        variables:{
            id
        }
    });
    const file=useMemo(
        ()=>data?.file ? toProjectFile(data.file,{projectId}) : undefined,
        [data,projectId],
    );
    return {
        file,
        loading:loading && !data,
        error
    }
}

export function useFileWithShares(id:string) {
    const {data,loading,error}=useQuery(GetFileWithSharesDocument,{
        variables:{
            id
        }
    });
    return {
        file:data?.file,
        loading:loading && !data,
        error
    }
}




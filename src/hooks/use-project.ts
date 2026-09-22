"use client"

import { GetProjectDocument, TransferProjectOwnershipDocument, TransferProjectOwnershipInput, UpdateProjectDocument, UpdateProjectInput } from "@/graphql/generated/graphql"
import { toProject } from "@/lib/mappers/project";
import { skipToken, useMutation, useQuery } from "@apollo/client/react"
import { useMemo } from "react";

export function useProject(id: string) {
  const { data, loading, error } = useQuery(
    GetProjectDocument,
    id ? { variables: { id } } : skipToken,
  );

  const project = useMemo(
    () => (data?.project ? toProject(data.project) : undefined),
    [data],
  );

  return {
    project,
    loading: loading && !data,
    error,
  };
}

export function useUpdateProject(){
    const [mutate,{loading}]=useMutation(UpdateProjectDocument);
    async function updateProject(id:string,input:UpdateProjectInput){
        const result=await mutate({
            variables:{id,input}
        })
        return result.data?.updateProject
    }
    return {
        updateProject,
        loading
    }
}

export function useTransferOwnerShip(){
    const [mutate,{loading}]=useMutation(TransferProjectOwnershipDocument)
    async function transferOwnerShip(input:TransferProjectOwnershipInput){
        const resutl=await mutate({
            variables:{
                input
            }
        })
        return resutl.data?.transferProjectOwnership
    }
    return {
        transferOwnerShip,
        loading
    }
}

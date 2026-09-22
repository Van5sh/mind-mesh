"use client"

import {
    CreateActivityLogDocument,
    DeleteActivityLogByIdDocument,
    GetActivityLogsDocument,
    type CreateActivityLogInput,
} from "@/graphql/generated/graphql"
import { toActivityLog } from "@/lib/mappers/activity";
import { useMutation, useQuery } from "@apollo/client/react"
import { useMemo } from "react";

// projectId and userId are both optional in the schema - pass one to scope
// the list (a project's activity, or one user's activity), or neither for
// everything the caller is allowed to see.
export function useActivityLogs(projectId?:string,userId?:string) {
    const {data,loading,error}=useQuery(GetActivityLogsDocument,{
        variables:{
            projectId,
            userId
        }
    });
    const activity=useMemo(
        ()=>(data?.activityLogs ?? []).map((a)=>toActivityLog(a,projectId ?? "")),
        [data,projectId],
    );
    return {
        activity,
        loading:loading && !data,
        error
    }
}

export function useCreateActivityLog() {
    const [mutate,{loading}]=useMutation(CreateActivityLogDocument);
    async function createActivityLog(input:CreateActivityLogInput) {
        const result=await mutate({
            variables:{
                input
            }
        })
        return result.data?.createActivityLog
    }
    return {createActivityLog,loading}
}

export function useDeleteActivityLog() {
    const [mutate,{loading}]=useMutation(DeleteActivityLogByIdDocument);
    async function deleteActivityLog(id:string) {
        const result=await mutate({
            variables:{
                id
            }
        })
        return result.data?.deleteActivityLogByID
    }
    return {deleteActivityLog,loading}
}

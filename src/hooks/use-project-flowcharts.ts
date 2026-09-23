"use client"

import {
    CreateFlowchartDocument,
    DeleteFlowchartDocument,
    GetFlowchartDocument,
    GetFlowchartsDocument,
    UpdateFlowchartDocument,
    type CreateFlowchartInput,
    type UpdateFlowchartInput,
} from "@/graphql/generated/graphql"
import { toFlowchart } from "@/lib/mappers/flowchart";
import { useMutation, useQuery } from "@apollo/client/react"
import { useMemo } from "react";

export function useFlowcharts(projectId:string) {
    const {data,loading,error}=useQuery(GetFlowchartsDocument,{
        variables:{
            projectId
        }
    });
    const flowcharts=useMemo(
        ()=>(data?.flowcharts ?? []).map((f)=>toFlowchart(f,projectId)),
        [data,projectId],
    );
    return {
        flowcharts,
        loading:loading && !data,
        error
    }
}

// FlowchartFields carries no projectId of its own, so the caller passes the
// one it already knows.
export function useFlowchart(projectId:string,id:string) {
    const {data,loading,error}=useQuery(GetFlowchartDocument,{
        variables:{
            id
        }
    });
    const flowchart=useMemo(
        ()=>data?.flowchart ? toFlowchart(data.flowchart,projectId) : undefined,
        [data,projectId],
    );
    return {
        flowchart,
        loading:loading && !data,
        error
    }
}

export function useCreateFlowchart() {
    const [mutate,{loading}]=useMutation(CreateFlowchartDocument);
    async function createFlowchart(input:CreateFlowchartInput) {
        const result=await mutate({
            variables:{
                input
            }
        })
        return result.data?.createFlowchart
    }
    return {createFlowchart,loading}
}

export function useUpdateFlowchart() {
    const [mutate,{loading}]=useMutation(UpdateFlowchartDocument);
    async function updateFlowchart(id:string,input:UpdateFlowchartInput) {
        const result=await mutate({
            variables:{
                id,
                input
            }
        })
        return result.data?.updateFlowchart
    }
    return {updateFlowchart,loading}
}

export function useDeleteFlowchart() {
    const [mutate,{loading}]=useMutation(DeleteFlowchartDocument);
    async function deleteFlowchart(id:string) {
        const result=await mutate({
            variables:{
                id
            }
        })
        return result.data?.deleteFlowchart
    }
    return {deleteFlowchart,loading}
}

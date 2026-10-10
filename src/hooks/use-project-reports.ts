"use client"

import { CreateReportDocument, DeleteReportDocument, GetReportDocument, GetReportsDocument, UpdateReportDocument, type CreateReportInput, type UpdateReportInput } from "@/graphql/generated/graphql"
import { toReport } from "@/lib/mappers/report";
import { useMutation, useQuery } from "@apollo/client/react"
import { useMemo } from "react";


// GetReport returns ONE report (or null), not a list - ReportFields also
// carries no projectId, so the caller passes the one it already knows.
export function useReport(projectId:string, id:string) {
    const {data,loading,error}=useQuery(GetReportDocument,{
        variables:{
            id
        }
    });
    const report=useMemo(
        ()=>data?.report ? toReport(data.report, projectId) : undefined,
        [data,projectId],
    )

    return {
        report,
        loading:loading && !data,
        error
    }
}
export function useReports(id:string) {
    const {data,loading,error}=useQuery(GetReportsDocument,{
        variables:{
            projectId:id
        }
    });
    const reports=useMemo(()=>(data?.reports ?? []).map((r)=>toReport(r,id)),[data]);
    return {
        reports,
        loading:loading && !data,
        error
    }
}

export function useCreateReport() {
    const [mutate,{loading}]=useMutation(CreateReportDocument);
    async function createReport(input:CreateReportInput) {
        const result=await mutate({
            variables:{
                input
            }
        })
        return result.data?.createReport
    }
    return {createReport,loading}
}

export function useUpdateReport(){
    const [mutate,{loading}]=useMutation(UpdateReportDocument);
    async function updateReport(id:string,input:UpdateReportInput) {
        const update=await mutate({
            variables:{
                id,
                input
            }
        })
        return update.data?.updateReport
    }
    return {updateReport,loading}
}

export function useDeleteReport() {
    const [mutate,{loading}]=useMutation(DeleteReportDocument);
    async function deleteReport(id:string) {
        const result=await mutate({
            variables:{
                id
            }
        })
        return result.data?.deleteReport
    }
    return {deleteReport,loading}
}


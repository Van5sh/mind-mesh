"use server"

import { UpdateReportDocument, UpdateReportInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function updateReport(id:string,input:UpdateReportInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:UpdateReportDocument,
        variables:{
            id,
            input
        }
    })
    return data?.updateReport
}
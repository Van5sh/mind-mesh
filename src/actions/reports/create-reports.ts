"use server"

import { CreateReportDocument, type CreateReportInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function createReport(input:CreateReportInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:CreateReportDocument,
        variables:{
            input
        }
    })
    return data?.createReport
}
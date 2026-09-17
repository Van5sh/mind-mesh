"use server"

import { DeleteReportDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function deleeteReport(id:string) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:DeleteReportDocument,
        variables:{
            id
        }
    })
    return data?.deleteReport;
}
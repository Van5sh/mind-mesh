"use server"

import { DeleteFlowchartDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function deleteflowchart(id:string) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:DeleteFlowchartDocument,
        variables:{
            id
        }
    })
    return data?.deleteFlowchart;
}
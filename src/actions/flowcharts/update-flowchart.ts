"use server"

import { UpdateFlowchartDocument, UpdateFlowchartInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function updateFlowcharts(id:string,input:UpdateFlowchartInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:UpdateFlowchartDocument,
        variables:{
            id,
            input
        }
    })
    return data?.updateFlowchart
}
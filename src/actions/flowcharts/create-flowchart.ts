"use server"

import { CreateFlowchartDocument, CreateFlowchartInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function createFlowchart(input:CreateFlowchartInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:CreateFlowchartDocument,
        variables:{
            input
        }
    })
    return data?.createFlowchart
}
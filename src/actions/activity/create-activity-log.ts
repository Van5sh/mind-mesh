"use server"

import { CreateActivityLogDocument, CreateActivityLogInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function createActivity(input:CreateActivityLogInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:CreateActivityLogDocument,
        variables:{
            input
        }
    })
    return data?.createActivityLog
}
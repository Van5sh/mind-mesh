"use server"

import { UpdateChatMessageDocument, UpdateChatMessageInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function updateChatMessage(id:string,input:UpdateChatMessageInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:UpdateChatMessageDocument,
        variables:{
            input,
        }
    })
}
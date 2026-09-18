"use server"

import { UpdateChatDocument, UpdateChatInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function updateChat(id:string,input:UpdateChatInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:UpdateChatDocument,
        variables:{
            id,
            input
        }
    })
    return data?.updateChat
}
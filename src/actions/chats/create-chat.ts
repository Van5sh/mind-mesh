"use server"

import { CreateChatDocument, CreateChatInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function createChat(input:CreateChatInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:CreateChatDocument,
        variables:{
            input
        }
    })
    return data?.createChat
}
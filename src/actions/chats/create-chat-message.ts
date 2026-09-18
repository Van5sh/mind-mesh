"use server"

import {  CreateChatMessageDocument, CreateChatMessageInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function CreateChatMessage(input:CreateChatMessageInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:CreateChatMessageDocument,
        variables:{
            input,    
        }
    })
    return data?.createChatMessage
}
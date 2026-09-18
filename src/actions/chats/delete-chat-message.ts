"use server"

import { DeleteChatMessageDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function deleteChatMessage(id:string) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:DeleteChatMessageDocument,
        variables:{
            id,
        }
    })
    return data?.deleteChatMessage
}
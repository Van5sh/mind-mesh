"use server"

import { DeleteChatDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function deleteChat(id:string) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:DeleteChatDocument,
        variables:{
            id
        }
    })

    return data?.deleteChat
}
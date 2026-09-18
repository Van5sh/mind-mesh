"use server"

import { MoveFileDocument, MoveFileInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function moveFile(input:MoveFileInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:MoveFileDocument,
        variables:{
            input
        }
    })
    return data?.moveFile
}
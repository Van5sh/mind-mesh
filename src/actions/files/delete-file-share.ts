"use server"

import { DeleteFileShareDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function deleteFileShare(id:string) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:DeleteFileShareDocument,
        variables:{
            fileShareId:id,
        }
    })
    return data?.deleteFileShare
}
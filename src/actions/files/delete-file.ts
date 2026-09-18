"use server"

import { DeleteFileDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function deleteFile(id:string) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:DeleteFileDocument,
        variables:{
            fileId:id,
        }
    })
    return data?.deleteFile
}
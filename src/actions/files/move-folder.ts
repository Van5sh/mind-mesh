"use server"

import { MoveFolderDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function moveFolder(folderId:string,parentFolderId:string) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:MoveFolderDocument,
        variables:{
            folderId,
            parentFolderId,
        }
    })
    return data?.moveFolder
}
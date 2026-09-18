"use server"

import { RenameFolderDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function renameFolder(id:string,name:string) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:RenameFolderDocument,
        variables:{
            folderId:id,
            name
        }
    })
    return data?.renameFolder
}
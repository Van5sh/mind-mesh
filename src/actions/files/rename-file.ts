"use server"

import { RenameFileDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function renameFile(id:string,name:string) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:RenameFileDocument,
        variables:{
            fileId:id,
            name,
        }
    })
    return data?.renameFile
}
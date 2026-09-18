"use server"

import { type FilePermission, UpdateFileSharePermissionDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function updateFileSharePermission(fileId:string,permission:FilePermission) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:UpdateFileSharePermissionDocument,
        variables:{
            fileShareId:fileId,
            permission:permission
        }
    })
    return data?.updateFileSharePermission
}
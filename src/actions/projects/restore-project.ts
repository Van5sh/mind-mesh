"use server"

import { RestoreProjectDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function restoreProject(projectId:string) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:RestoreProjectDocument,
        variables:{
            projectId
        }
    })
    return data?.restoreProject
}
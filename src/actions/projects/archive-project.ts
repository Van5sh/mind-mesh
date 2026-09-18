"use server"

import { ArchiveProjectDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function archiveProject(id:string) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:ArchiveProjectDocument,
        variables:{
            projectId: id
        }
    })
    return data?.archiveProject
}
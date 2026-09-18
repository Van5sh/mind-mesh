"use server"

import { DeleteProjectDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function deleteProject(id:string) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:DeleteProjectDocument,
        variables:{
            id
        }
    })
    return data?.deleteProject
}
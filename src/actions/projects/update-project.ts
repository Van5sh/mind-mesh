"use server"

import { UpdateProjectDocument, UpdateProjectInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function updateProject(id:string,input:UpdateProjectInput){
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:UpdateProjectDocument,
        variables:{
            id,
            input
        }
    })
    return data?.updateProject
}
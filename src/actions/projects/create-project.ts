"use server"

import { CreateProjectDocument, CreateProjectInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function createProject(input:CreateProjectInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:CreateProjectDocument,
        variables:{
            input
        }
    })
    return data?.createProject
}
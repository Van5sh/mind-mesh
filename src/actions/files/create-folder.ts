"use server"

import { CreateFolderDocument, CreateFolderInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function createFolder(input:CreateFolderInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:CreateFolderDocument,
        variables:{
            input
        }
    })
    return data?.createFolder
}
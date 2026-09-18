"use server"

import { CreateFileDocument, CreateFileInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function createFile(input:CreateFileInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:CreateFileDocument,
        variables:{
            input
        }
    })
    return data?.createFile
}
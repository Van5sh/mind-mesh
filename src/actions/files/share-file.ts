"use server"

import { ShareFileDocument, ShareFileInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function shareFile(input:ShareFileInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:ShareFileDocument,
        variables:{
            input
        }
    })
    return data?.shareFile
}
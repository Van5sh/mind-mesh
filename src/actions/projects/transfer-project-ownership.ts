"use server"

import { TransferProjectOwnershipDocument, TransferProjectOwnershipInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function transferProjectOwnerShip(input:TransferProjectOwnershipInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:TransferProjectOwnershipDocument,
        variables:{
            input
        }
    })
    return data?.transferProjectOwnership
}
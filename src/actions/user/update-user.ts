"use server"

import { getServerApolloClient } from '@/lib/apollo/server';
import { UpdateUserDocument, type UpdateUserInput } from "@/graphql/generated/graphql";

export async function updateUser(
    id: string,
    input: UpdateUserInput
    ) {
    const client=await getServerApolloClient()
    const {data}=await client.mutate({
        mutation:UpdateUserDocument,
        variables:{
            id,
            input
        }
    })
    return data?.updateUser
}

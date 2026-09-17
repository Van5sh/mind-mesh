"use server"

import { DeleteUserDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function deleteUser(id:string) {
    const client =await getServerApolloClient();

    const {data}=await client.mutate({
        mutation:DeleteUserDocument,
        variables:{
            id
        }
    })
    return data?.deleteUser
}
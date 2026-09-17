"use server"

import { UpdateUserProfileDocument, type UpdateUserProfileInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function updateUserProfile(id:string,input:UpdateUserProfileInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:UpdateUserProfileDocument,
        variables:{
            id,
            input
        }
    })
    return data?.updateUserProfile
}
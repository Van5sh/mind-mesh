"use server"

import { UpdateUserAvatarDocument, type UpdateUserAvatarInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";


export async function updateUserAvatar(id:string,input:UpdateUserAvatarInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:UpdateUserAvatarDocument,
        variables:{
            id,
            input
        }
    })
    return data?.updateUserAvatar
}
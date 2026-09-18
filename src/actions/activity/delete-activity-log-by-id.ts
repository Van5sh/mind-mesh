"use server"

import { DeleteActivityLogByIdDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function deleteActivityLog(id:string) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:DeleteActivityLogByIdDocument,
        variables:{
            id
        }
    });
    return data?.deleteActivityLogByID
}
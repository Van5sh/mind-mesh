"use server"

import { RemoveProjectMemberDocument } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server"

export async function removeProjectMember(id:string,userId:string) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:RemoveProjectMemberDocument,
        variables:{
            projectId:id,
            userId
        }
    })
    return data?.removeProjectMember
}
"use server"

import { UpdateProjectMemberRoleDocument, UpdateProjectMemberRoleInput } from "@/graphql/generated/graphql";
import { getServerApolloClient } from "@/lib/apollo/server";

export async function updateProjectMemberRole(input:UpdateProjectMemberRoleInput) {
    const client=await getServerApolloClient();
    const {data}=await client.mutate({
        mutation:UpdateProjectMemberRoleDocument,
        variables:{
            input
        }
    })
    return data?.updateProjectMemberRole
}
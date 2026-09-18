"use server"

import { getServerApolloClient } from '@/lib/apollo/server';
import { AddProjectMemberDocument, AddProjectMemberInput } from "@/graphql/generated/graphql";

export async function AddProjectMember(input:AddProjectMemberInput){
    const client=await getServerApolloClient()
    const {data}=await client.mutate({
        mutation:AddProjectMemberDocument,
        variables:{
            input
        }
    })
    return data?.addProjectMember
}
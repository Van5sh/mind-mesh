"use client"

import { AddProjectMemberDocument, AddProjectMemberInput, GetAllUsersDocument, GetProjectMembersDocument, RemoveProjectMemberDocument, UpdateProjectMemberRoleDocument, UpdateProjectMemberRoleInput } from "@/graphql/generated/graphql"
import { toProjectMember } from "@/lib/mappers/project"
import { toUser } from "@/lib/mappers/user"
import { useMutation, useQuery } from "@apollo/client/react"
import { useMemo } from "react"

export function useGetMembers(id:string){
    const {data,loading,error}=useQuery(GetProjectMembersDocument,{
        variables:{
            projectId:id
        }
    })
    const members=useMemo(()=>(data?.projectMembers ?? []).map((m)=>toProjectMember(m,id)),[data,id])
    return {
        members,
        loading: loading && !data,
        error
    }
}

export function useAddProjectMember(){
    const [mutate,{loading}]=useMutation(AddProjectMemberDocument);
    async function addProjectMember(input:AddProjectMemberInput) {
        const result=await mutate({
            variables:{
                input
            },
            // A newly added member isn't already in the cached GetProjectMembers
            // list, so cache normalization has nothing to splice it into -
            // refetch that list explicitly.
            refetchQueries:[{query:GetProjectMembersDocument, variables:{projectId:input.projectId}}],
        })
        return result.data?.addProjectMember
    }
    return {addProjectMember,loading}
}

/** Every user in the system - used to build the "invite a member" picker. */
export function useAllUsers(){
    const {data,loading,error}=useQuery(GetAllUsersDocument);
    const users=useMemo(()=>(data?.allUsers ?? []).map((u)=>toUser(u)),[data]);
    return {users,loading:loading && !data,error}
}

export function useUpdateMemberRole(){
    const [mutate,{loading}]=useMutation(UpdateProjectMemberRoleDocument);
    async function updateMemberRole(input:UpdateProjectMemberRoleInput) {
        const result=await mutate({
            variables:{
                input
            }
        })
        return result.data?.updateProjectMemberRole
    }
    return {
        updateMemberRole,
        loading
    }
}

export function useRemoveProjectMember(){
    const [mutate,{loading}]=useMutation(RemoveProjectMemberDocument)
    async function removeMember(projectId:string,userId:string) {
        const result=await mutate({
            variables:{
                projectId:projectId,
                userId:userId
            },
            // removeProjectMember only returns a boolean, and the removed
            // member needs to disappear from the list - refetch it.
            refetchQueries:[{query:GetProjectMembersDocument, variables:{projectId}}],
        })
        return result.data?.removeProjectMember
    }
    return {
        removeMember,
        loading
    }
}


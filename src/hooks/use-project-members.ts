"use client"

import { AddProjectMemberDocument, AddProjectMemberInput, GetProjectMembersDocument, RemoveProjectMemberDocument, UpdateProjectMemberRoleDocument, UpdateProjectMemberRoleInput } from "@/graphql/generated/graphql"
import { toProjectMember } from "@/lib/mappers/project"
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
            }
        })
        return result.data?.addProjectMember
    }
    return {addProjectMember,loading}
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
            }
        })   
        return result.data?.removeProjectMember
    }
    return {
        removeMember,
        loading
    }
}


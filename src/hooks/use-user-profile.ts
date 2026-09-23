"use client"

import {
    MeDocument,
    UpdateUserAvatarDocument,
    UpdateUserDocument,
    UpdateUserProfileDocument,
    type UpdateUserAvatarInput,
    type UpdateUserInput,
    type UpdateUserProfileInput,
} from "@/graphql/generated/graphql"
import { useMutation, useQuery } from "@apollo/client/react"
import { useMemo } from "react";

export function useMe() {
    const {data,loading,error}=useQuery(MeDocument);
    const user=useMemo(()=>(data?.me),[data])
    return {
        user,
        loading:loading && !data,
        error
    }
}

export function useUpdateUser() {
    const [mutate,{loading}]=useMutation(UpdateUserDocument);
    async function updateUser(id:string,input:UpdateUserInput) {
        const result=await mutate({
            variables:{
                id,
                input
            }
        })
        return result.data?.updateUser
    }
    return {updateUser,loading}
}

export function useUpdateUserProfile() {
    const [mutate,{loading}]=useMutation(UpdateUserProfileDocument);
    async function updateUserProfile(id:string,input:UpdateUserProfileInput) {
        const result=await mutate({
            variables:{
                id,
                input
            }
        })
        return result.data?.updateUserProfile
    }
    return {updateUserProfile,loading}
}

export function useUpdateUserAvatar() {
    const [mutate,{loading}]=useMutation(UpdateUserAvatarDocument);
    async function updateUserAvatar(id:string,input:UpdateUserAvatarInput) {
        const result=await mutate({
            variables:{
                id,
                input
            }
        })
        return result.data?.updateUserAvatar
    }
    return {updateUserAvatar,loading}
}

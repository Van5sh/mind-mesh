"use client"

import { MeDocument, UpdateUserDocument, UpdateUserInput } from "@/graphql/generated/graphql"
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

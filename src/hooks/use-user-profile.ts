"use client"

import { MeDocument, UpdateUserDocument, UpdateUserInput } from "@/graphql/generated/graphql"
import { useMutation, useQuery } from "@apollo/client/react"
import { useMemo } from "react";

export function Me() {
    const {data,loading,error}=useQuery(MeDocument);
    const user=useMemo(()=>(data?.me),[data])
    return {
        user,
        loading:loading && !data,
        error
    }
}

export function UpdateUser() {
    const [mutate,{loading}]=useMutation(UpdateUserDocument);
    async function updateUser(id:string,input:UpdateUserInput) {
        const user=mutate({
            variables:{
                id,
                input
            }
        })
    }
    return {updateUser,loading}
}

"use client"

import { CreateChatDocument, GetChatsDocument, GetMyChatsDocument } from "@/graphql/generated/graphql"
import { useMutation, useQuery } from "@apollo/client/react"
import { useMemo } from "react";

export function useGetChats(id:string) {
    const {data,loading,error}=useQuery(GetChatsDocument,{
        variables:{
            projectId:id
        }
    });
    const chats=useMemo(()=>(data?.chats),[data]);
    return {
        chats,
        loading:loading && !data,
        error
    }
}

export function useGetMyChats() {
    const {data,loading,error}=useQuery(GetMyChatsDocument);
    const chats=useMemo(()=>(data?.myChats),[data]);
    return {
        chats,
        loading:loading && !data,
        error
    }
}

export function useCreateChat() {
    const [mutate,{loading}]=useMutation(CreateChatDocument);
}
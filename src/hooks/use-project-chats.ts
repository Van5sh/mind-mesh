"use client"

import {
    CreateChatDocument,
    DeleteChatDocument,
    GetChatDocument,
    GetChatsDocument,
    GetMyChatsDocument,
    UpdateChatDocument,
    type CreateChatInput,
    type UpdateChatInput,
} from "@/graphql/generated/graphql"
import { toChat } from "@/lib/mappers/chat";
import { useMutation, useQuery } from "@apollo/client/react"
import { useMemo } from "react";

export function useGetChats(id:string) {
    const {data,loading,error}=useQuery(GetChatsDocument,{
        variables:{
            projectId:id
        }
    });
    const chats=useMemo(()=>(data?.chats ?? []).map((c)=>toChat(c,id)),[data,id]);
    return {
        chats,
        loading:loading && !data,
        error
    }
}

// $projectId is optional in the schema - omit it for a user's chats across
// every project. ChatFields carries no projectId of its own, so if you
// omit it here the mapped chats fall back to "" for it, same limitation as
// useFavoriteFiles in use-drive.ts.
export function useGetMyChats(projectId?:string) {
    const {data,loading,error}=useQuery(GetMyChatsDocument,{
        variables:{
            projectId
        }
    });
    const chats=useMemo(
        ()=>(data?.myChats ?? []).map((c)=>toChat(c,projectId ?? "")),
        [data,projectId],
    );
    return {
        chats,
        loading:loading && !data,
        error
    }
}

export function useGetChat(id:string) {
    const {data,loading,error}=useQuery(GetChatDocument,{
        variables:{
            id
        }
    });
    const chat=useMemo(
        ()=>data?.chat ? toChat(data.chat, "") : undefined,
        [data],
    );
    return {
        chat,
        loading:loading && !data,
        error
    }
}

export function useCreateChat() {
    const [mutate,{loading}]=useMutation(CreateChatDocument);
    async function createChat(input:CreateChatInput) {
        const result=await mutate({
            variables:{
                input
            }
        })
        return result.data?.createChat
    }
    return {createChat,loading}
}

export function useUpdateChat() {
    const [mutate,{loading}]=useMutation(UpdateChatDocument);
    async function updateChat(id:string,input:UpdateChatInput) {
        const result=await mutate({
            variables:{
                id,
                input
            }
        })
        return result.data?.updateChat
    }
    return {updateChat,loading}
}

export function useDeleteChat() {
    const [mutate,{loading}]=useMutation(DeleteChatDocument);
    async function deleteChat(id:string) {
        const result=await mutate({
            variables:{
                id
            }
        })
        return result.data?.deleteChat
    }
    return {deleteChat,loading}
}

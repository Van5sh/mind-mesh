"use client"

import { ChatMessageAddedDocument, CreateChatMessageDocument, CreateChatMessageInput, DeleteChatMessageDocument, GetChatMessagesDocument, UpdateChatMessageDocument, UpdateChatMessageInput } from "@/graphql/generated/graphql"
import { toChatMessage } from "@/lib/mappers/chat";
import { useApolloClient, useMutation, useQuery, useSubscription } from "@apollo/client/react"
import { useMemo } from "react";

export function useGetChatMessages(chatId:string) {
    const {data,loading,error}=useQuery(GetChatMessagesDocument,{
        variables:{
            chatId
        }
    });
    const chats=useMemo(()=>(data?.chatMessages)?.map((c)=>toChatMessage(c,chatId)),[data]);
    return {
        chats,
        loading:loading && !data,
        error
    }
}

export function useCreateChatMessage(){
    const [mutate,{loading}]=useMutation(CreateChatMessageDocument);
    async function createChat(input:CreateChatMessageInput) {
        const result=await mutate({
            variables:{
                input
            }
        })
        return result.data?.createChatMessage
    }
    return { createChat, loading }
}

export function useUpdateChatMessage() {
    const [mutate,{loading}]=useMutation(UpdateChatMessageDocument);
    async function updateChatMessage(input:UpdateChatMessageInput) {
        const result=await mutate({
            variables:{
                input,
            }
        });
        return result.data?.updateChatMessage    
    }
    return { updateChatMessage,loading }
}

export function useDeleteChatMessage() {
    const [mutate,{loading}]=useMutation(DeleteChatMessageDocument);
    async function deleteChatMessage(id:string) {
        const result=await mutate({
            variables:{
                id
            }
        })
        return result.data?.deleteChatMessage
    }
    return { deleteChatMessage,loading }
}

export function useChatMessageAdded(chatId:string) {
    const client=useApolloClient();
    useSubscription(ChatMessageAddedDocument,{
        variables: {chatId},
        onData: ({data})=>{
            const message=data.data?.chatMessageAdded
            if (!message) return;
            client.cache.updateQuery(
                {query:GetChatMessagesDocument,variables:{
                    chatId
                }},
                (prev)=>prev?{chatMessages:[...prev.chatMessages,message]}:prev
            )
        }
    })
}

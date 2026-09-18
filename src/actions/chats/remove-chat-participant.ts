import { getServerApolloClient } from '@/lib/apollo/server';
import { RemoveChatParticipantDocument } from './../../graphql/generated/graphql';
"use server"

export async function removeChatParticipantDocument(chatId:string,userId:string) {
    const client=await getServerApolloClient();
    const data=await client.mutate({
        mutation:RemoveChatParticipantDocument,
        variables:{
            chatId,
            userId
        }
    })
    return data.data?.removeChatParticipant
    
}
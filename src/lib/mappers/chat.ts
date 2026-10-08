import type {
  ChatFieldsFragment,
  ChatMessageFieldsFragment,
} from "@/graphql/generated/graphql";
import type { Chat, ChatMessage, ID } from "@/lib/types";

/** ChatFields has no project; it comes from where you fetched it. */
export function toChat(c: ChatFieldsFragment, projectId: ID): Chat {
  return {
    id: c.id,
    projectId,
    title: c.title,
    type: c.type,
    status: c.status,
    lastActivityAt: c.lastActivityAt,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

/** ChatMessageFields has no chat id; it comes from where you fetched it. */
export function toChatMessage(m: ChatMessageFieldsFragment, chatId: ID): ChatMessage {
  return {
    id: m.id,
    chatId,
    senderId: m.sender?.id ?? null,
    role: m.role,
    content: m.content,
    createdAt: m.createdAt,
    mentionedUsers: m.mentionedUsers.map((u) => ({ id: u.id, username: u.username })),
    referencedFiles: m.referencedFiles.map((f) => ({ id: f.id, name: f.name })),
  };
}

import type { UserFieldsFragment } from "@/graphql/generated/graphql";
import type { User } from "@/lib/types";

/** The three fields every nested `{ id username email }` selection carries. */
export type UserRef = Pick<User, "id" | "username" | "email">;

export function toUserRef(u: { id: string; username: string; email: string }): UserRef {
  return { id: u.id, username: u.username, email: u.email };
}

export function toUser(u: UserFieldsFragment): User {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    firstName: u.profile?.firstName,
    lastName: u.profile?.lastName,
    bio: u.profile?.bio ?? null,
    avatarUrl: u.profile?.avatarUrl ?? null,
    createdAt: u.createdAt,
  };
}

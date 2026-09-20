import type {
  ProjectFieldsFragment,
  ProjectMemberFieldsFragment,
} from "@/graphql/generated/graphql";
import type { ID, Project, ProjectMember } from "@/lib/types";
import { toUserRef, type UserRef } from "./user";

/**
 * `ProjectMember` with a lightweight user: the member selection carries only
 * id / username / email, not the profile or createdAt a full `User` needs.
 */
export type ProjectMemberRow = Omit<ProjectMember, "user"> & { user: UserRef };

/** `memberIds` is not part of ProjectFields; pass it when you have the members. */
export function toProject(p: ProjectFieldsFragment, memberIds: ID[] = []): Project {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    visibility: p.visibility,
    ownerId: p.owner.id,
    memberIds,
    archivedAt: p.archivedAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export function toProjectMember(
  m: ProjectMemberFieldsFragment,
  projectId: ID,
): ProjectMemberRow {
  return {
    id: m.id,
    projectId,
    user: toUserRef(m.user),
    role: m.role,
    createdAt: m.createdAt,
  };
}

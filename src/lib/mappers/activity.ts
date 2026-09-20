import type { ActivityLogFieldsFragment } from "@/graphql/generated/graphql";
import type { ActivityLog, ID } from "@/lib/types";

export type ActivityRow = ActivityLog & { actor: string };

export function toActivityLog(a: ActivityLogFieldsFragment, projectId: ID): ActivityRow {
  return {
    id: a.id,
    projectId,
    userId: a.user?.id ?? null,
    action: a.action,
    entityType: a.entityType,
    entityId: a.entityId,
    createdAt: a.createdAt,
    actor: a.user?.username ?? "Someone",
  };
}

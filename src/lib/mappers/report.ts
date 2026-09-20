import type { ReportFieldsFragment } from "@/graphql/generated/graphql";
import type { ID, Report } from "@/lib/types";

/** ReportFields has no project; it comes from where you fetched it. */
export function toReport(r: ReportFieldsFragment, projectId: ID): Report {
  return {
    id: r.id,
    projectId,
    title: r.title,
    content: r.content,
    format: r.format,
    properties: {
      generatedById: r.properties.generatedBy.id,
      generatedByAI: r.properties.generatedByAI,
      status: r.properties.status,
      sourceChatId: r.properties.sourceChat?.id ?? null,
    },
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

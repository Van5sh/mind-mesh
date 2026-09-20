import type { FlowchartFieldsFragment } from "@/graphql/generated/graphql";
import type { Flowchart, ID } from "@/lib/types";

/**
 * The API sends `data` as free-form JSON; the flow builder wants a JSON
 * string. Already a string: keep it. Anything else: serialise it.
 */
function toDataString(data: unknown): string {
  return typeof data === "string" ? data : JSON.stringify(data ?? null);
}

/** FlowchartFields has no project; it comes from where you fetched it. */
export function toFlowchart(f: FlowchartFieldsFragment, projectId: ID): Flowchart {
  return {
    id: f.id,
    projectId,
    name: f.name,
    data: toDataString(f.data),
    generatedById: f.generatedBy?.id ?? null,
    generatedByAI: f.generatedByAI,
    status: f.status,
    sourceChatId: f.sourceChat?.id ?? null,
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
  };
}

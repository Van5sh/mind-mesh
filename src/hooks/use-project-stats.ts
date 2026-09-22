"use client"

import { GetProjectStatsDocument } from "@/graphql/generated/graphql"
import { useQuery } from "@apollo/client/react"
import { useMemo } from "react";

export function useProjectStats(id: string) {
  const { data, loading, error } = useQuery(GetProjectStatsDocument, {
    variables: {
      projectId: id
    }
  });
  const stats = useMemo(() => data?.projectStats, [data]);
  return {
    stats,
    loading: loading && !data,
    error
  };
}

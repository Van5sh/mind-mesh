"use client"

import { GetDashboardDocument } from "@/graphql/generated/graphql"
import { toDashboardProject } from "@/lib/mappers/dashboard";
import { useQuery } from "@apollo/client/react"
import { useMemo } from "react";

export function useDashboard() {
    const {data,loading,error}=useQuery(GetDashboardDocument);
    const projects=useMemo(
        ()=>(data?.projects ?? []).map(toDashboardProject)
    ,[data]
    );
    return {
        projects,
        loading:loading && !data,
        error
    }
}
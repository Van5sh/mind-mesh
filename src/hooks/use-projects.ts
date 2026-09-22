"use client";

import { skipToken, useMutation, useQuery } from "@apollo/client/react";
import {
  ArchiveProjectDocument,
  CreateProjectDocument,
  GetArchivedProjectsForUserDocument,
  GetDashboardDocument,
  GetProjectsDocument,
  GetProjectsForUserDocument,
  RestoreProjectDocument,
  type CreateProjectInput,
} from "@/graphql/generated/graphql";
import { useMemo } from "react";
import { toProject } from "@/lib/mappers/project";
import { useAuth } from "@/lib/auth-context";

export function useCreateProject() {
  const [mutate, { loading }] = useMutation(CreateProjectDocument, {
    refetchQueries: [GetDashboardDocument],
  });

  async function createProject(input: CreateProjectInput) {
    const result = await mutate({ variables: { input } });
    return result.data?.createProject;
  }

  return { createProject, loading };
}


export function useProjects() {
  const { data, loading, error } = useQuery(GetProjectsDocument);

  const projects = useMemo(
    () => (data?.projects ?? []).map((p) => toProject(p)),
    [data],
  );

  return {
    projects,
    loading: loading && !data,
    error,
  };
}

export function useProjectsForUser(){
  const {user}=useAuth();
  const {data,loading,error}=useQuery(GetProjectsForUserDocument,
    user ? {variables:{userId:user.id}}:skipToken,
  );
  const projects=useMemo(
    ()=>(data?.projectsForUser ?? []).map((p)=>toProject(p)),[data]
  )   
  return {
    projects,
    loading: loading && !data,
    error
  }
}

export function useArchiveProject() {
  const [mutate,{loading}]=useMutation(ArchiveProjectDocument,{
    refetchQueries:[GetProjectsDocument, GetDashboardDocument],
  });
  async function archiveProject(id:string){
    const result=await mutate({variables:{
      projectId:id
    }});
    return result.data?.archiveProject
  }
  return {archiveProject,loading}
}

export function useRestoreProject() {
  const [mutate,{loading}]=useMutation(RestoreProjectDocument,{
    refetchQueries:[GetProjectsDocument, GetDashboardDocument],
  });
  async function restoreProject(id:string) {
    const result=await mutate({variables:{
      projectId:id
    }});
    return result.data?.restoreProject
  }
  return {restoreProject,loading}
}

export function useArchivedProjectsForUser() {
  const { user } = useAuth();
  const { data, loading, error } = useQuery(
    GetArchivedProjectsForUserDocument,
    user ? { variables: { userId: user.id } } : skipToken,
  );

  const projects = useMemo(
    () => (data?.archivedProjectsForUser ?? []).map((p) => toProject(p)),
    [data],
  );

  return {
    projects,
    loading: loading && !data,
    error,
  };
}

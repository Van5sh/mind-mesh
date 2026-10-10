"use client";

import { skipToken, useMutation, useQuery } from "@apollo/client/react";
import {
  ArchiveProjectDocument,
  CreateProjectDocument,
  DeleteProjectDocument,
  GetArchivedProjectsForUserDocument,
  GetDashboardDocument,
  GetProjectDocument,
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

// Same GetProjects query as useProjects() (Apollo dedupes the identical
// request/cache entry) - this just also reads the members/files GetProjects
// now carries, for ProjectCard's avatar stack and file count on
// projects/page.tsx. See the GraphQL integration guide, open question 1.
export function useProjectsWithCounts() {
  const { data, loading, error } = useQuery(GetProjectsDocument);

  const projects = useMemo(
    () =>
      (data?.projects ?? []).map((p) => ({
        project: toProject(p),
        members: p.members.map((m) => ({ id: m.user.id, username: m.user.username })),
        fileCount: p.files.length,
      })),
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
  const [mutate,{loading}]=useMutation(ArchiveProjectDocument);
  async function archiveProject(id:string){
    const result=await mutate({
      variables:{ projectId:id },
      // Also refetch this single project (not just the lists) so a page
      // like project settings, watching GetProject for this id, sees the
      // new archivedAt without a manual reload - the mutation itself only
      // returns a boolean, so Apollo's cache has nothing to merge in.
      refetchQueries:[GetProjectsDocument, GetDashboardDocument, {query:GetProjectDocument, variables:{id}}],
    });
    return result.data?.archiveProject
  }
  return {archiveProject,loading}
}

export function useRestoreProject() {
  const [mutate,{loading}]=useMutation(RestoreProjectDocument);
  async function restoreProject(id:string) {
    const result=await mutate({
      variables:{ projectId:id },
      refetchQueries:[GetProjectsDocument, GetDashboardDocument, {query:GetProjectDocument, variables:{id}}],
    });
    return result.data?.restoreProject
  }
  return {restoreProject,loading}
}

export function useDeleteProject() {
  const [mutate,{loading}]=useMutation(DeleteProjectDocument,{
    refetchQueries:[GetProjectsDocument, GetDashboardDocument],
  });
  async function deleteProject(id:string) {
    const result=await mutate({variables:{
      id
    }});
    return result.data?.deleteProject
  }
  return {deleteProject,loading}
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

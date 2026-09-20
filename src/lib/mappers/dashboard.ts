import type { GetDashboardQuery } from "@/graphql/generated/graphql";
import type { Project, ProjectRole } from "@/lib/types";
import { toActivityLog, type ActivityRow } from "./activity";
import { toProject } from "./project";

type GqlDashboardProject = GetDashboardQuery["projects"][number];

export interface DashboardMember {
  id: string;
  role: ProjectRole;
  userId: string;
  username: string;
}

export interface DashboardProject {
  project: Project;
  members: DashboardMember[];
  fileCount: number;
  chatCount: number;
  reportCount: number;
  flowchartCount: number;
  activity: ActivityRow[];
}

export function toDashboardProject(p: GqlDashboardProject): DashboardProject {
  const members = p.members.map((m) => ({
    id: m.id,
    role: m.role,
    userId: m.user.id,
    username: m.user.username,
  }));

  return {
    project: toProject(p, members.map((m) => m.userId)),
    members,
    fileCount: p.files.length,
    chatCount: p.chats.length,
    reportCount: p.reports.length,
    flowchartCount: p.flowcharts.length,
    activity: p.activityLogs.map((a) => toActivityLog(a, p.id)),
  };
}

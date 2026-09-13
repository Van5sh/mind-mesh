import type {
  ActivityLog,
  Chat,
  ChatMessage,
  DriveFile,
  DriveFolder,
  Flowchart,
  Folder,
  ProjectFile,
  ProjectMember,
  Project,
  Report,
  User,
} from "./types";

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 86_400_000).toISOString();

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export const mockUsers: User[] = [
  {
    id: "user-1",
    username: "vansh",
    email: "vansh@meshmind.dev",
    firstName: "Vansh",
    lastName: "Sethi",
    bio: "Building MeshMind.",
    avatarUrl: null,
    createdAt: daysAgo(120),
  },
  {
    id: "user-2",
    username: "priya.raman",
    email: "priya@meshmind.dev",
    firstName: "Priya",
    lastName: "Raman",
    bio: "Product design.",
    avatarUrl: null,
    createdAt: daysAgo(90),
  },
  {
    id: "user-3",
    username: "arjun.mehta",
    email: "arjun@meshmind.dev",
    firstName: "Arjun",
    lastName: "Mehta",
    bio: null,
    avatarUrl: null,
    createdAt: daysAgo(60),
  },
];

export const CURRENT_USER_ID = "user-1";

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Series A Data Room",
    description: "Diligence documents, financials, and investor Q&A for the Series A raise.",
    visibility: "PRIVATE",
    ownerId: "user-1",
    memberIds: ["user-1", "user-2", "user-3"],
    archivedAt: null,
    createdAt: daysAgo(45),
    updatedAt: daysAgo(1),
  },
  {
    id: "proj-2",
    name: "Product Research — Q3",
    description: "Competitive analysis, user interviews, and market sizing for the Q3 roadmap.",
    visibility: "TEAM",
    ownerId: "user-1",
    memberIds: ["user-1", "user-2"],
    archivedAt: null,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(2),
  },
  {
    id: "proj-3",
    name: "Legal Contracts Archive",
    description: "Vendor agreements, NDAs, and employment contracts.",
    visibility: "PRIVATE",
    ownerId: "user-2",
    memberIds: ["user-1", "user-2"],
    archivedAt: null,
    createdAt: daysAgo(200),
    updatedAt: daysAgo(10),
  },
  {
    id: "proj-4",
    name: "2024 Marketing Retrospective",
    description: "Campaign performance reports and creative assets from last year.",
    visibility: "TEAM",
    ownerId: "user-1",
    memberIds: ["user-1"],
    archivedAt: daysAgo(5),
    createdAt: daysAgo(400),
    updatedAt: daysAgo(5),
  },
];

export const mockProjectMembers: ProjectMember[] = [
  { id: "pm-1", projectId: "proj-1", user: mockUsers[0], role: "OWNER", createdAt: daysAgo(45) },
  { id: "pm-2", projectId: "proj-1", user: mockUsers[1], role: "EDITOR", createdAt: daysAgo(40) },
  { id: "pm-3", projectId: "proj-1", user: mockUsers[2], role: "VIEWER", createdAt: daysAgo(20) },
  { id: "pm-4", projectId: "proj-2", user: mockUsers[0], role: "OWNER", createdAt: daysAgo(30) },
  { id: "pm-5", projectId: "proj-2", user: mockUsers[1], role: "EDITOR", createdAt: daysAgo(28) },
  { id: "pm-6", projectId: "proj-3", user: mockUsers[1], role: "OWNER", createdAt: daysAgo(200) },
  { id: "pm-7", projectId: "proj-3", user: mockUsers[0], role: "ADMIN", createdAt: daysAgo(190) },
  { id: "pm-8", projectId: "proj-4", user: mockUsers[0], role: "OWNER", createdAt: daysAgo(400) },
];

// ---------------------------------------------------------------------------
// Folders & Files
// ---------------------------------------------------------------------------

export const mockFolders: Folder[] = [
  { id: "fold-1", projectId: "proj-1", parentFolderId: null, name: "Financials", createdAt: daysAgo(44), updatedAt: daysAgo(10) },
  { id: "fold-2", projectId: "proj-1", parentFolderId: null, name: "Legal", createdAt: daysAgo(44), updatedAt: daysAgo(8) },
  { id: "fold-3", projectId: "proj-1", parentFolderId: "fold-1", name: "Q1 2026", createdAt: daysAgo(30), updatedAt: daysAgo(3) },
  { id: "fold-4", projectId: "proj-2", parentFolderId: null, name: "Interviews", createdAt: daysAgo(29), updatedAt: daysAgo(2) },
  { id: "fold-5", projectId: "proj-3", parentFolderId: null, name: "Vendor Agreements", createdAt: daysAgo(150), updatedAt: daysAgo(10) },
];

function file(
  id: string,
  projectId: string,
  folderId: string | null,
  name: string,
  mimeType: string,
  size: number,
  status: ProjectFile["aiMetadata"]["processingStatus"],
  createdDaysAgo: number,
  summary?: string,
): ProjectFile {
  return {
    id,
    projectId,
    folderId,
    name,
    size,
    storage: {
      bucketName: "meshmind-dev",
      objectKey: `projects/${projectId}/files/${id}/${name}`,
      mimeType,
      uploadedById: "user-1",
      downloadUrl: "#mock-download",
      createdAt: daysAgo(createdDaysAgo),
    },
    aiMetadata: {
      processingStatus: status,
      summary: summary ?? null,
      errorMessage: status === "FAILED" ? "Could not extract text — file may be corrupted." : null,
      extractedText: status === "COMPLETED" ? "…extracted text would appear here…" : null,
      embeddingSynced: status === "COMPLETED",
      indexedAt: status === "COMPLETED" ? daysAgo(createdDaysAgo - 0.01) : null,
    },
    createdAt: daysAgo(createdDaysAgo),
    updatedAt: daysAgo(Math.max(createdDaysAgo - 1, 0)),
  };
}

export const mockFiles: ProjectFile[] = [
  file("file-1", "proj-1", "fold-3", "cap-table.pdf", "application/pdf", 482_000, "COMPLETED", 10,
    "A capitalization table detailing founder, employee, and investor equity ownership as of Q1 2026, including option pool allocation."),
  file("file-2", "proj-1", "fold-3", "income-statement-q1.pdf", "application/pdf", 210_500, "COMPLETED", 9,
    "Q1 2026 income statement showing revenue growth of 34% QoQ, driven primarily by expansion in the enterprise segment."),
  file("file-3", "proj-1", "fold-2", "founders-agreement.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 88_200, "COMPLETED", 40,
    "Founders' agreement outlining equity vesting schedules, IP assignment, and decision-making authority among the three co-founders."),
  file("file-4", "proj-1", "fold-2", "series-a-term-sheet-draft.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 54_000, "PROCESSING", 0.02),
  file("file-5", "proj-1", null, "pitch-deck-v7.pdf", "application/pdf", 3_400_000, "PENDING", 0.002),
  file("file-6", "proj-1", null, "corrupted-export.pdf", "application/pdf", 12_000, "FAILED", 3),
  file("file-7", "proj-2", "fold-4", "interview-notes-acme-corp.txt", "text/plain", 8_200, "COMPLETED", 5,
    "Interview with Acme Corp's Head of Ops revealed strong demand for automated compliance reporting, with pricing sensitivity around per-seat models."),
  file("file-8", "proj-2", "fold-4", "interview-notes-globex.txt", "text/plain", 6_100, "COMPLETED", 4,
    "Globex's team highlighted integration complexity as the top blocker to adoption, particularly around SSO and existing data pipelines."),
  file("file-9", "proj-2", null, "competitive-landscape.pdf", "application/pdf", 1_150_000, "COMPLETED", 12,
    "Overview of six direct competitors, comparing pricing tiers, AI feature depth, and target customer segments."),
  file("file-10", "proj-3", "fold-5", "aws-vendor-agreement.pdf", "application/pdf", 320_000, "COMPLETED", 100,
    "Standard AWS enterprise agreement with negotiated volume discounts and a 3-year commitment term."),
  file("file-11", "proj-3", "fold-5", "nda-template.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 22_000, "COMPLETED", 150,
    "Mutual non-disclosure agreement template used for prospective vendor and partner discussions."),
];

// ---------------------------------------------------------------------------
// Chats & messages
// ---------------------------------------------------------------------------

export const mockChats: Chat[] = [
  { id: "chat-1", projectId: "proj-1", title: "Ask the data room", type: "AI_ASSISTANT", status: "ACTIVE", lastActivityAt: daysAgo(0.1), createdAt: daysAgo(10), updatedAt: daysAgo(0.1) },
  { id: "chat-2", projectId: "proj-1", title: "Diligence checklist review", type: "GENERAL", status: "ACTIVE", lastActivityAt: daysAgo(1), createdAt: daysAgo(20), updatedAt: daysAgo(1) },
  { id: "chat-3", projectId: "proj-2", title: "Research assistant", type: "AI_ASSISTANT", status: "ACTIVE", lastActivityAt: daysAgo(2), createdAt: daysAgo(15), updatedAt: daysAgo(2) },
  { id: "chat-4", projectId: "proj-1", title: "Old investor thread", type: "GENERAL", status: "ARCHIVED", lastActivityAt: daysAgo(30), createdAt: daysAgo(40), updatedAt: daysAgo(30) },
];

export const mockChatMessages: ChatMessage[] = [
  { id: "msg-1", chatId: "chat-1", senderId: "user-1", role: "USER", content: "What's our current burn rate based on the Q1 income statement?", createdAt: daysAgo(0.12) },
  { id: "msg-2", chatId: "chat-1", senderId: null, role: "AI", content: "Based on the Q1 2026 income statement, your net burn is approximately $410K/month, with revenue covering about 62% of operating expenses. This is a 12% improvement in burn multiple compared to Q4 2025, driven mainly by the enterprise segment growth noted in the same document.", createdAt: daysAgo(0.11) },
  { id: "msg-3", chatId: "chat-1", senderId: "user-1", role: "USER", content: "How is equity split according to the founders' agreement?", createdAt: daysAgo(0.1) },
  { id: "msg-4", chatId: "chat-1", senderId: null, role: "AI", content: "Per the founders' agreement, equity is split 45/35/20 among the three co-founders, each subject to a 4-year vesting schedule with a 1-year cliff. A 12% option pool is carved out separately for employees.", createdAt: daysAgo(0.09) },
  { id: "msg-5", chatId: "chat-2", senderId: "user-2", role: "USER", content: "Can someone confirm the term sheet draft is uploaded?", createdAt: daysAgo(1) },
  { id: "msg-6", chatId: "chat-2", senderId: "user-1", role: "USER", content: "Yep, uploaded this morning — still processing on our end.", createdAt: daysAgo(0.9) },
  { id: "msg-7", chatId: "chat-3", senderId: "user-1", role: "USER", content: "Summarize the main blocker across both customer interviews.", createdAt: daysAgo(2) },
  { id: "msg-8", chatId: "chat-3", senderId: null, role: "AI", content: "Both Acme Corp and Globex independently flagged integration complexity as a major concern — specifically around SSO setup and connecting existing data pipelines. Acme also raised pricing sensitivity for per-seat models, suggesting usage-based pricing may reduce friction for larger deployments.", createdAt: daysAgo(1.95) },
];

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

export const mockReports: Report[] = [
  {
    id: "report-1",
    projectId: "proj-1",
    title: "Series A Readiness Summary",
    format: "MARKDOWN",
    content:
      "# Series A Readiness Summary\n\n## Financial Position\nQ1 2026 revenue grew 34% quarter-over-quarter, with net burn holding at approximately $410K/month against $2.1M in the bank — roughly 5 months of runway at the current rate.\n\n## Cap Table\nFounder equity is split 45/35/20 with a standard 4-year vest and 1-year cliff. A 12% option pool has been reserved for employee grants.\n\n## Open Items\n- Term sheet draft still under legal review\n- Pitch deck v7 pending final numbers\n\n## Recommendation\nThe data room is largely diligence-ready. Prioritize finalizing the term sheet and refreshing the pitch deck before scheduling investor calls.",
    properties: { generatedById: null, generatedByAI: true, status: "READY", sourceChatId: "chat-1" },
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    id: "report-2",
    projectId: "proj-2",
    title: "Q3 Competitive Landscape Brief",
    format: "MARKDOWN",
    content:
      "# Q3 Competitive Landscape Brief\n\nSix direct competitors were evaluated across pricing, AI feature depth, and target segment. Two clear pricing tiers emerged in the market — per-seat and usage-based — with usage-based pricing gaining ground among enterprise buyers who cited seat-based pricing as a blocker in our own interviews.\n\n## Recommendation\nConsider piloting a usage-based tier for the enterprise segment in Q4.",
    properties: { generatedById: "user-1", generatedByAI: false, status: "READY", sourceChatId: null },
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
  },
  {
    id: "report-3",
    projectId: "proj-1",
    title: "Investor Q&A Draft",
    format: "MARKDOWN",
    content: "",
    properties: { generatedById: null, generatedByAI: true, status: "GENERATING", sourceChatId: "chat-1" },
    createdAt: daysAgo(0.02),
    updatedAt: daysAgo(0.02),
  },
];

// ---------------------------------------------------------------------------
// Flowcharts
// ---------------------------------------------------------------------------

const emptyFlow = JSON.stringify({
  nodes: [
    { id: "1", position: { x: 0, y: 0 }, data: { label: "Start" }, type: "input" },
    { id: "2", position: { x: 260, y: 120 }, data: { label: "Review documents" } },
    { id: "3", position: { x: 520, y: 240 }, data: { label: "Investor call" }, type: "output" },
  ],
  edges: [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3" },
  ],
});

export const mockFlowcharts: Flowchart[] = [
  { id: "flow-1", projectId: "proj-1", name: "Diligence Process", data: emptyFlow, generatedById: "user-1", generatedByAI: false, status: "READY", sourceChatId: null, createdAt: daysAgo(15), updatedAt: daysAgo(3) },
  { id: "flow-2", projectId: "proj-1", name: "Funding Timeline", data: emptyFlow, generatedById: null, generatedByAI: true, status: "READY", sourceChatId: "chat-1", createdAt: daysAgo(5), updatedAt: daysAgo(5) },
  { id: "flow-3", projectId: "proj-2", name: "Research Workflow", data: emptyFlow, generatedById: "user-1", generatedByAI: false, status: "DRAFT", sourceChatId: null, createdAt: daysAgo(8), updatedAt: daysAgo(1) },
];

// ---------------------------------------------------------------------------
// Activity
// ---------------------------------------------------------------------------

export const mockActivity: ActivityLog[] = [
  { id: "act-1", projectId: "proj-1", userId: "user-1", action: "uploaded a file", entityType: "File", entityId: "file-5", createdAt: daysAgo(0.002) },
  { id: "act-2", projectId: "proj-1", userId: "user-1", action: "asked the AI assistant a question", entityType: "Chat", entityId: "chat-1", createdAt: daysAgo(0.1) },
  { id: "act-3", projectId: "proj-1", userId: "user-2", action: "joined the project", entityType: "ProjectMember", entityId: "pm-2", createdAt: daysAgo(40) },
  { id: "act-4", projectId: "proj-1", userId: "user-1", action: "created a report", entityType: "Report", entityId: "report-1", createdAt: daysAgo(2) },
  { id: "act-5", projectId: "proj-2", userId: "user-1", action: "created a flowchart", entityType: "Flowchart", entityId: "flow-3", createdAt: daysAgo(8) },
  { id: "act-6", projectId: "proj-1", userId: "user-3", action: "viewed cap-table.pdf", entityType: "File", entityId: "file-1", createdAt: daysAgo(1.2) },
  { id: "act-7", projectId: "proj-3", userId: "user-2", action: "renamed a folder", entityType: "Folder", entityId: "fold-5", createdAt: daysAgo(10) },
];

// ---------------------------------------------------------------------------
// Personal drive — a simple, independent upload-and-store space (not tied
// to any project), in the spirit of Google Drive / iCloud Drive.
// ---------------------------------------------------------------------------

export const mockDriveFolders: DriveFolder[] = [
  { id: "dfold-1", parentId: null, name: "Personal", deletedAt: null, createdAt: daysAgo(60), updatedAt: daysAgo(4) },
  { id: "dfold-2", parentId: null, name: "Screenshots", deletedAt: null, createdAt: daysAgo(50), updatedAt: daysAgo(2) },
  { id: "dfold-3", parentId: "dfold-1", name: "Taxes 2025", deletedAt: null, createdAt: daysAgo(45), updatedAt: daysAgo(45) },
];

function driveFile(
  id: string,
  folderId: string | null,
  name: string,
  mimeType: string,
  size: number,
  createdDaysAgo: number,
  opts?: { starred?: boolean; deleted?: boolean },
): DriveFile {
  return {
    id,
    folderId,
    name,
    mimeType,
    size,
    downloadUrl: "#mock-download",
    starred: opts?.starred ?? false,
    deletedAt: opts?.deleted ? daysAgo(0.5) : null,
    createdAt: daysAgo(createdDaysAgo),
    updatedAt: daysAgo(Math.max(createdDaysAgo - 1, 0)),
  };
}

export const mockDriveFiles: DriveFile[] = [
  driveFile("dfile-1", null, "Resume — 2026.pdf", "application/pdf", 182_000, 3, { starred: true }),
  driveFile("dfile-2", null, "Team offsite photo.jpg", "image/jpeg", 4_200_000, 6),
  driveFile("dfile-3", "dfold-2", "Screenshot 2026-09-01.png", "image/png", 860_000, 13),
  driveFile("dfile-4", "dfold-2", "Screenshot 2026-08-27.png", "image/png", 720_000, 18),
  driveFile("dfile-5", "dfold-1", "Passport scan.pdf", "application/pdf", 1_100_000, 40, { starred: true }),
  driveFile("dfile-6", "dfold-3", "W2-2025.pdf", "application/pdf", 240_000, 44),
  driveFile("dfile-7", null, "Notes — onboarding.txt", "text/plain", 4_800, 1),
  driveFile("dfile-8", null, "old-draft.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 96_000, 20, { deleted: true }),
];

export function userById(id: string | null | undefined): User | undefined {
  if (!id) return undefined;
  return mockUsers.find((u) => u.id === id);
}

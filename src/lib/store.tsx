"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  mockActivity,
  mockChatMessages,
  mockChats,
  mockDriveFiles,
  mockDriveFolders,
  mockFiles,
  mockFlowcharts,
  mockFolders,
  mockProjectMembers,
  mockProjects,
  mockReports,
  mockUsers,
  CURRENT_USER_ID,
} from "./mock-data";
import type {
  ActivityLog,
  Chat,
  ChatMessage,
  ChatType,
  DriveFile,
  DriveFolder,
  Flowchart,
  Folder,
  ProjectFile,
  ProjectMember,
  Project,
  ProjectRole,
  ProjectVisibility,
  Report,
  ReportFormat,
  User,
} from "./types";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function now() {
  return new Date().toISOString();
}

const AI_REPLY_BANK = [
  "Based on the documents indexed in this project, here's what I found — this is a simulated response for the frontend-only build; real answers will be grounded in your actual files once the backend is connected.",
  "I looked through the project's indexed content and put together a summary. (This response is mocked for now — the real AI assistant will cite the specific files it drew from.)",
  "Here's a draft answer based on what's been uploaded so far. Once connected to the real backend, this will search the project's embeddings and generate a grounded response.",
  "Good question — here's a placeholder answer for the demo. The production version will retrieve relevant chunks from Qdrant and ground the response in your actual documents.",
];

interface StoreState {
  users: User[];
  projects: Project[];
  members: ProjectMember[];
  folders: Folder[];
  files: ProjectFile[];
  chats: Chat[];
  messages: ChatMessage[];
  reports: Report[];
  flowcharts: Flowchart[];
  activity: ActivityLog[];
  driveFolders: DriveFolder[];
  driveFiles: DriveFile[];
}

interface StoreActions {
  // Projects
  createProject: (input: {
    name: string;
    description?: string;
    visibility: ProjectVisibility;
  }) => Project;
  updateProject: (
    id: string,
    input: Partial<Pick<Project, "name" | "description" | "visibility">>,
  ) => void;
  archiveProject: (id: string) => void;
  restoreProject: (id: string) => void;
  deleteProject: (id: string) => void;
  addMember: (projectId: string, userId: string, role: ProjectRole) => void;
  updateMemberRole: (projectId: string, userId: string, role: ProjectRole) => void;
  removeMember: (projectId: string, userId: string) => void;
  transferOwnership: (projectId: string, newOwnerUserId: string) => void;

  // Folders / files
  createFolder: (projectId: string, name: string, parentFolderId?: string | null) => Folder;
  renameFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  uploadFile: (
    projectId: string,
    file: { name: string; size: number; mimeType: string },
    folderId?: string | null,
  ) => ProjectFile;
  renameFile: (id: string, name: string) => void;
  moveFile: (id: string, folderId: string | null) => void;
  deleteFile: (id: string) => void;

  // Chats
  createChat: (projectId: string, title: string, type: ChatType) => Chat;
  renameChat: (id: string, title: string) => void;
  archiveChat: (id: string) => void;
  deleteChat: (id: string) => void;
  sendMessage: (chatId: string, content: string) => void;

  // Reports
  createReport: (
    projectId: string,
    input: { title: string; content: string; format: ReportFormat },
  ) => Report;
  generateAIReport: (projectId: string, title: string, sourceChatId?: string | null) => Report;
  updateReport: (id: string, input: Partial<Pick<Report, "title" | "content" | "format">>) => void;
  deleteReport: (id: string) => void;

  // Flowcharts
  createFlowchart: (projectId: string, name: string) => Flowchart;
  generateAIFlowchart: (projectId: string, name: string, sourceChatId?: string | null) => Flowchart;
  renameFlowchart: (id: string, name: string) => void;
  saveFlowchartData: (id: string, data: string) => void;
  deleteFlowchart: (id: string) => void;

  logActivity: (
    projectId: string,
    action: string,
    entityType?: string,
    entityId?: string,
  ) => void;

  // Personal drive
  createDriveFolder: (name: string, parentId?: string | null) => DriveFolder;
  renameDriveFolder: (id: string, name: string) => void;
  trashDriveFolder: (id: string) => void;
  restoreDriveFolder: (id: string) => void;
  deleteDriveFolderForever: (id: string) => void;
  uploadDriveFile: (
    file: { name: string; size: number; mimeType: string },
    folderId?: string | null,
  ) => DriveFile;
  renameDriveFile: (id: string, name: string) => void;
  toggleStarDriveFile: (id: string) => void;
  trashDriveFile: (id: string) => void;
  restoreDriveFile: (id: string) => void;
  deleteDriveFileForever: (id: string) => void;
  emptyDriveTrash: () => void;
}

type StoreValue = StoreState & StoreActions & { currentUserId: string };

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [users] = useState<User[]>(mockUsers);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [members, setMembers] = useState<ProjectMember[]>(mockProjectMembers);
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [files, setFiles] = useState<ProjectFile[]>(mockFiles);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [flowcharts, setFlowcharts] = useState<Flowchart[]>(mockFlowcharts);
  const [activity, setActivity] = useState<ActivityLog[]>(mockActivity);
  const [driveFolders, setDriveFolders] = useState<DriveFolder[]>(mockDriveFolders);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>(mockDriveFiles);

  const logActivity = useCallback(
    (projectId: string, action: string, entityType?: string, entityId?: string) => {
      setActivity((prev) => [
        {
          id: uid("act"),
          projectId,
          userId: CURRENT_USER_ID,
          action,
          entityType: entityType ?? null,
          entityId: entityId ?? null,
          createdAt: now(),
        },
        ...prev,
      ]);
    },
    [],
  );

  // -- Projects --------------------------------------------------------

  const createProject: StoreActions["createProject"] = useCallback(
    ({ name, description, visibility }) => {
      const project: Project = {
        id: uid("proj"),
        name,
        description: description ?? null,
        visibility,
        ownerId: CURRENT_USER_ID,
        memberIds: [CURRENT_USER_ID],
        archivedAt: null,
        createdAt: now(),
        updatedAt: now(),
      };
      setProjects((prev) => [project, ...prev]);
      logActivity(project.id, "created the project", "Project", project.id);
      return project;
    },
    [logActivity],
  );

  const updateProject: StoreActions["updateProject"] = useCallback((id, input) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...input, updatedAt: now() } : p)),
    );
  }, []);

  const archiveProject: StoreActions["archiveProject"] = useCallback((id) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, archivedAt: now(), updatedAt: now() } : p)),
    );
  }, []);

  const restoreProject: StoreActions["restoreProject"] = useCallback((id) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, archivedAt: null, updatedAt: now() } : p)),
    );
  }, []);

  const deleteProject: StoreActions["deleteProject"] = useCallback((id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addMember: StoreActions["addMember"] = useCallback((projectId, userId, role) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) return;
    setMembers((prev) => [
      ...prev,
      { id: uid("pm"), projectId, user, role, createdAt: now() },
    ]);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, memberIds: [...new Set([...p.memberIds, userId])] } : p,
      ),
    );
    logActivity(projectId, `added ${user.username} to the project`, "ProjectMember", userId);
  }, [logActivity]);

  const updateMemberRole: StoreActions["updateMemberRole"] = useCallback(
    (projectId, userId, role) => {
      setMembers((prev) =>
        prev.map((m) =>
          m.projectId === projectId && m.user.id === userId ? { ...m, role } : m,
        ),
      );
    },
    [],
  );

  const removeMember: StoreActions["removeMember"] = useCallback((projectId, userId) => {
    setMembers((prev) => prev.filter((m) => !(m.projectId === projectId && m.user.id === userId)));
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, memberIds: p.memberIds.filter((id) => id !== userId) } : p,
      ),
    );
  }, []);

  const transferOwnership: StoreActions["transferOwnership"] = useCallback(
    (projectId, newOwnerUserId) => {
      const previousOwnerId = projects.find((p) => p.id === projectId)?.ownerId;
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, ownerId: newOwnerUserId, updatedAt: now() } : p)),
      );
      setMembers((prev) => {
        const hasNewOwnerRow = prev.some((m) => m.projectId === projectId && m.user.id === newOwnerUserId);
        const updated = prev.map((m) => {
          if (m.projectId !== projectId) return m;
          if (m.user.id === newOwnerUserId) return { ...m, role: "OWNER" as ProjectRole };
          if (m.user.id === previousOwnerId) return { ...m, role: "ADMIN" as ProjectRole };
          return m;
        });
        if (hasNewOwnerRow) return updated;
        const newOwnerUser = mockUsers.find((u) => u.id === newOwnerUserId);
        if (!newOwnerUser) return updated;
        return [...updated, { id: uid("pm"), projectId, user: newOwnerUser, role: "OWNER" as ProjectRole, createdAt: now() }];
      });
      logActivity(projectId, "transferred project ownership", "Project", projectId);
    },
    [projects, logActivity],
  );

  // -- Folders / files ---------------------------------------------------

  const createFolder: StoreActions["createFolder"] = useCallback(
    (projectId, name, parentFolderId = null) => {
      const folder: Folder = {
        id: uid("fold"),
        projectId,
        parentFolderId,
        name,
        createdAt: now(),
        updatedAt: now(),
      };
      setFolders((prev) => [...prev, folder]);
      logActivity(projectId, `created folder "${name}"`, "Folder", folder.id);
      return folder;
    },
    [logActivity],
  );

  const renameFolder: StoreActions["renameFolder"] = useCallback((id, name) => {
    setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name, updatedAt: now() } : f)));
  }, []);

  const deleteFolder: StoreActions["deleteFolder"] = useCallback((id) => {
    setFolders((prev) => prev.filter((f) => f.id !== id));
    setFiles((prev) => prev.filter((f) => f.folderId !== id));
  }, []);

  const uploadFile: StoreActions["uploadFile"] = useCallback(
    (projectId, fileInput, folderId = null) => {
      const id = uid("file");
      const record: ProjectFile = {
        id,
        projectId,
        folderId,
        name: fileInput.name,
        size: fileInput.size,
        storage: {
          bucketName: "meshmind-dev",
          objectKey: `projects/${projectId}/files/${id}/${fileInput.name}`,
          mimeType: fileInput.mimeType,
          uploadedById: CURRENT_USER_ID,
          downloadUrl: "#mock-download",
          createdAt: now(),
        },
        aiMetadata: {
          processingStatus: "PENDING",
          summary: null,
          errorMessage: null,
          extractedText: null,
          embeddingSynced: false,
          indexedAt: null,
        },
        createdAt: now(),
        updatedAt: now(),
      };
      setFiles((prev) => [record, ...prev]);
      logActivity(projectId, `uploaded ${fileInput.name}`, "File", id);

      // Simulate the real pipeline: PENDING -> PROCESSING -> COMPLETED,
      // matching the polling pattern documented in BACKEND_HANDOFF.md §5.
      window.setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? { ...f, aiMetadata: { ...f.aiMetadata, processingStatus: "PROCESSING" } }
              : f,
          ),
        );
      }, 1200);

      window.setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  updatedAt: now(),
                  aiMetadata: {
                    processingStatus: "COMPLETED",
                    summary: `AI-generated summary of ${fileInput.name} (simulated — the real summary will be produced by the document-processing worker).`,
                    errorMessage: null,
                    extractedText: "…extracted text would appear here…",
                    embeddingSynced: true,
                    indexedAt: now(),
                  },
                }
              : f,
          ),
        );
      }, 4000);

      return record;
    },
    [logActivity],
  );

  const renameFile: StoreActions["renameFile"] = useCallback((id, name) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name, updatedAt: now() } : f)));
  }, []);

  const moveFile: StoreActions["moveFile"] = useCallback((id, folderId) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, folderId, updatedAt: now() } : f)));
  }, []);

  const deleteFile: StoreActions["deleteFile"] = useCallback((id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // -- Chats ---------------------------------------------------------

  const createChat: StoreActions["createChat"] = useCallback(
    (projectId, title, type) => {
      const chat: Chat = {
        id: uid("chat"),
        projectId,
        title,
        type,
        status: "ACTIVE",
        lastActivityAt: now(),
        createdAt: now(),
        updatedAt: now(),
      };
      setChats((prev) => [chat, ...prev]);
      logActivity(projectId, `started a new chat "${title}"`, "Chat", chat.id);
      return chat;
    },
    [logActivity],
  );

  const renameChat: StoreActions["renameChat"] = useCallback((id, title) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title, updatedAt: now() } : c)));
  }, []);

  const archiveChat: StoreActions["archiveChat"] = useCallback((id) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, status: "ARCHIVED", updatedAt: now() } : c)));
  }, []);

  const deleteChat: StoreActions["deleteChat"] = useCallback((id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    setMessages((prev) => prev.filter((m) => m.chatId !== id));
  }, []);

  const sendMessage: StoreActions["sendMessage"] = useCallback(
    (chatId, content) => {
      const chat = chats.find((c) => c.id === chatId);
      const userMessage: ChatMessage = {
        id: uid("msg"),
        chatId,
        senderId: CURRENT_USER_ID,
        role: "USER",
        content,
        createdAt: now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, lastActivityAt: now() } : c)),
      );

      if (chat?.type !== "AI_ASSISTANT") return;

      // Mirrors the real backend's behavior (BACKEND_HANDOFF.md §5): the AI
      // reply is generated after the fact and appears once ready. We show a
      // pending "typing" message, then swap in the real reply.
      const pendingId = uid("msg");
      setMessages((prev) => [
        ...prev,
        { id: pendingId, chatId, senderId: null, role: "AI", content: "", pending: true, createdAt: now() },
      ]);
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, status: "GENERATING" } : c)),
      );

      window.setTimeout(() => {
        const reply = AI_REPLY_BANK[Math.floor(Math.random() * AI_REPLY_BANK.length)];
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingId ? { ...m, content: reply, pending: false, createdAt: now() } : m,
          ),
        );
        setChats((prev) =>
          prev.map((c) => (c.id === chatId ? { ...c, status: "ACTIVE", lastActivityAt: now() } : c)),
        );
      }, 1800 + Math.random() * 1200);
    },
    [chats],
  );

  // -- Reports ---------------------------------------------------------

  const createReport: StoreActions["createReport"] = useCallback(
    (projectId, input) => {
      const report: Report = {
        id: uid("report"),
        projectId,
        title: input.title,
        content: input.content,
        format: input.format,
        properties: {
          generatedById: CURRENT_USER_ID,
          generatedByAI: false,
          status: "READY",
          sourceChatId: null,
        },
        createdAt: now(),
        updatedAt: now(),
      };
      setReports((prev) => [report, ...prev]);
      logActivity(projectId, `created report "${input.title}"`, "Report", report.id);
      return report;
    },
    [logActivity],
  );

  const generateAIReport: StoreActions["generateAIReport"] = useCallback(
    (projectId, title, sourceChatId = null) => {
      const report: Report = {
        id: uid("report"),
        projectId,
        title,
        content: "",
        format: "MARKDOWN",
        properties: {
          generatedById: null,
          generatedByAI: true,
          status: "GENERATING",
          sourceChatId,
        },
        createdAt: now(),
        updatedAt: now(),
      };
      setReports((prev) => [report, ...prev]);
      logActivity(projectId, `asked the AI to generate a report "${title}"`, "Report", report.id);

      window.setTimeout(() => {
        setReports((prev) =>
          prev.map((r) =>
            r.id === report.id
              ? {
                  ...r,
                  updatedAt: now(),
                  content: `# ${title}\n\nThis is an AI-generated summary based on the project's indexed documents and conversations. (Simulated content — the real report will be produced by the backend once connected.)\n\n## Key Points\n- Point one drawn from the project's files\n- Point two drawn from recent chat activity\n- Point three highlighting an open question\n\n## Recommendation\nReview the source documents referenced in this project before sharing this report externally.`,
                  properties: { ...r.properties, status: "READY" },
                }
              : r,
          ),
        );
      }, 2600);

      return report;
    },
    [logActivity],
  );

  const updateReport: StoreActions["updateReport"] = useCallback((id, input) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, ...input, updatedAt: now() } : r)));
  }, []);

  const deleteReport: StoreActions["deleteReport"] = useCallback((id) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // -- Flowcharts --------------------------------------------------------

  const createFlowchart: StoreActions["createFlowchart"] = useCallback(
    (projectId, name) => {
      const flowchart: Flowchart = {
        id: uid("flow"),
        projectId,
        name,
        data: JSON.stringify({ nodes: [], edges: [] }),
        generatedById: CURRENT_USER_ID,
        generatedByAI: false,
        status: "DRAFT",
        sourceChatId: null,
        createdAt: now(),
        updatedAt: now(),
      };
      setFlowcharts((prev) => [flowchart, ...prev]);
      logActivity(projectId, `created flowchart "${name}"`, "Flowchart", flowchart.id);
      return flowchart;
    },
    [logActivity],
  );

  const generateAIFlowchart: StoreActions["generateAIFlowchart"] = useCallback(
    (projectId, name, sourceChatId = null) => {
      const flowchart: Flowchart = {
        id: uid("flow"),
        projectId,
        name,
        data: JSON.stringify({ nodes: [], edges: [] }),
        generatedById: null,
        generatedByAI: true,
        status: "GENERATING",
        sourceChatId,
        createdAt: now(),
        updatedAt: now(),
      };
      setFlowcharts((prev) => [flowchart, ...prev]);
      logActivity(projectId, `asked the AI to generate a flowchart "${name}"`, "Flowchart", flowchart.id);

      window.setTimeout(() => {
        setFlowcharts((prev) =>
          prev.map((f) =>
            f.id === flowchart.id
              ? {
                  ...f,
                  updatedAt: now(),
                  status: "READY",
                  data: JSON.stringify({
                    nodes: [
                      { id: "1", type: "input", position: { x: 0, y: 0 }, data: { label: "Start" } },
                      { id: "2", position: { x: 260, y: 120 }, data: { label: "AI-suggested step" } },
                      { id: "3", type: "output", position: { x: 520, y: 240 }, data: { label: "Outcome" } },
                    ],
                    edges: [
                      { id: "e1-2", source: "1", target: "2" },
                      { id: "e2-3", source: "2", target: "3" },
                    ],
                  }),
                }
              : f,
          ),
        );
      }, 2600);

      return flowchart;
    },
    [logActivity],
  );

  const renameFlowchart: StoreActions["renameFlowchart"] = useCallback((id, name) => {
    setFlowcharts((prev) => prev.map((f) => (f.id === id ? { ...f, name, updatedAt: now() } : f)));
  }, []);

  const saveFlowchartData: StoreActions["saveFlowchartData"] = useCallback((id, data) => {
    setFlowcharts((prev) =>
      prev.map((f) => (f.id === id ? { ...f, data, status: "READY", updatedAt: now() } : f)),
    );
  }, []);

  const deleteFlowchart: StoreActions["deleteFlowchart"] = useCallback((id) => {
    setFlowcharts((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // -- Personal drive ---------------------------------------------------

  const createDriveFolder: StoreActions["createDriveFolder"] = useCallback((name, parentId = null) => {
    const folder: DriveFolder = {
      id: uid("dfold"),
      parentId,
      name,
      deletedAt: null,
      createdAt: now(),
      updatedAt: now(),
    };
    setDriveFolders((prev) => [...prev, folder]);
    return folder;
  }, []);

  const renameDriveFolder: StoreActions["renameDriveFolder"] = useCallback((id, name) => {
    setDriveFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name, updatedAt: now() } : f)));
  }, []);

  const trashDriveFolder: StoreActions["trashDriveFolder"] = useCallback((id) => {
    setDriveFolders((prev) => prev.map((f) => (f.id === id ? { ...f, deletedAt: now() } : f)));
  }, []);

  const restoreDriveFolder: StoreActions["restoreDriveFolder"] = useCallback((id) => {
    setDriveFolders((prev) => prev.map((f) => (f.id === id ? { ...f, deletedAt: null } : f)));
  }, []);

  const deleteDriveFolderForever: StoreActions["deleteDriveFolderForever"] = useCallback((id) => {
    setDriveFolders((prev) => prev.filter((f) => f.id !== id));
    setDriveFiles((prev) => prev.filter((f) => f.folderId !== id));
  }, []);

  const uploadDriveFile: StoreActions["uploadDriveFile"] = useCallback((fileInput, folderId = null) => {
    const record: DriveFile = {
      id: uid("dfile"),
      folderId: folderId ?? null,
      name: fileInput.name,
      size: fileInput.size,
      mimeType: fileInput.mimeType,
      downloadUrl: "#mock-download",
      starred: false,
      deletedAt: null,
      createdAt: now(),
      updatedAt: now(),
    };
    setDriveFiles((prev) => [record, ...prev]);
    return record;
  }, []);

  const renameDriveFile: StoreActions["renameDriveFile"] = useCallback((id, name) => {
    setDriveFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name, updatedAt: now() } : f)));
  }, []);

  const toggleStarDriveFile: StoreActions["toggleStarDriveFile"] = useCallback((id) => {
    setDriveFiles((prev) => prev.map((f) => (f.id === id ? { ...f, starred: !f.starred } : f)));
  }, []);

  const trashDriveFile: StoreActions["trashDriveFile"] = useCallback((id) => {
    setDriveFiles((prev) => prev.map((f) => (f.id === id ? { ...f, deletedAt: now() } : f)));
  }, []);

  const restoreDriveFile: StoreActions["restoreDriveFile"] = useCallback((id) => {
    setDriveFiles((prev) => prev.map((f) => (f.id === id ? { ...f, deletedAt: null } : f)));
  }, []);

  const deleteDriveFileForever: StoreActions["deleteDriveFileForever"] = useCallback((id) => {
    setDriveFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const emptyDriveTrash: StoreActions["emptyDriveTrash"] = useCallback(() => {
    setDriveFiles((prev) => prev.filter((f) => !f.deletedAt));
    setDriveFolders((prev) => prev.filter((f) => !f.deletedAt));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      users,
      projects,
      members,
      folders,
      files,
      chats,
      messages,
      reports,
      flowcharts,
      activity,
      driveFolders,
      driveFiles,
      currentUserId: CURRENT_USER_ID,
      createProject,
      updateProject,
      archiveProject,
      restoreProject,
      deleteProject,
      addMember,
      updateMemberRole,
      removeMember,
      transferOwnership,
      createFolder,
      renameFolder,
      deleteFolder,
      uploadFile,
      renameFile,
      moveFile,
      deleteFile,
      createChat,
      renameChat,
      archiveChat,
      deleteChat,
      sendMessage,
      createReport,
      generateAIReport,
      updateReport,
      deleteReport,
      createFlowchart,
      generateAIFlowchart,
      renameFlowchart,
      saveFlowchartData,
      deleteFlowchart,
      logActivity,
      createDriveFolder,
      renameDriveFolder,
      trashDriveFolder,
      restoreDriveFolder,
      deleteDriveFolderForever,
      uploadDriveFile,
      renameDriveFile,
      toggleStarDriveFile,
      trashDriveFile,
      restoreDriveFile,
      deleteDriveFileForever,
      emptyDriveTrash,
    }),
    [
      users, projects, members, folders, files, chats, messages, reports, flowcharts, activity,
      driveFolders, driveFiles,
      createProject, updateProject, archiveProject, restoreProject, deleteProject,
      addMember, updateMemberRole, removeMember, transferOwnership,
      createFolder, renameFolder, deleteFolder, uploadFile, renameFile, moveFile, deleteFile,
      createChat, renameChat, archiveChat, deleteChat, sendMessage,
      createReport, generateAIReport, updateReport, deleteReport,
      createFlowchart, generateAIFlowchart, renameFlowchart, saveFlowchartData, deleteFlowchart,
      logActivity,
      createDriveFolder, renameDriveFolder, trashDriveFolder, restoreDriveFolder, deleteDriveFolderForever,
      uploadDriveFile, renameDriveFile, toggleStarDriveFile, trashDriveFile, restoreDriveFile,
      deleteDriveFileForever, emptyDriveTrash,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
}

// ---------------------------------------------------------------------------
// Derived-data helpers (kept here so components don't reimplement filtering)
// ---------------------------------------------------------------------------

export function useProject(projectId: string) {
  const store = useStore();
  return store.projects.find((p) => p.id === projectId);
}

export function useProjectFolders(projectId: string) {
  const store = useStore();
  return store.folders.filter((f) => f.projectId === projectId);
}

export function useProjectFiles(projectId: string, folderId?: string | null) {
  const store = useStore();
  return store.files.filter(
    (f) => f.projectId === projectId && (folderId === undefined || f.folderId === folderId),
  );
}

export function useProjectChats(projectId: string) {
  const store = useStore();
  return store.chats.filter((c) => c.projectId === projectId);
}

export function useChatMessages(chatId: string) {
  const store = useStore();
  return store.messages.filter((m) => m.chatId === chatId);
}

export function useProjectReports(projectId: string) {
  const store = useStore();
  return store.reports.filter((r) => r.projectId === projectId);
}

export function useProjectFlowcharts(projectId: string) {
  const store = useStore();
  return store.flowcharts.filter((f) => f.projectId === projectId);
}

export function useProjectMembers(projectId: string) {
  const store = useStore();
  return store.members.filter((m) => m.projectId === projectId);
}

export function useProjectActivity(projectId: string) {
  const store = useStore();
  return store.activity
    .filter((a) => a.projectId === projectId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function useMyProjects() {
  const store = useStore();
  return store.projects
    .filter(
      (p) => !p.archivedAt && (p.ownerId === store.currentUserId || p.memberIds.includes(store.currentUserId)),
    )
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export function useMyRole(projectId: string): "OWNER" | "ADMIN" | "EDITOR" | "VIEWER" | null {
  const store = useStore();
  const project = store.projects.find((p) => p.id === projectId);
  if (!project) return null;
  if (project.ownerId === store.currentUserId) return "OWNER";
  const membership = store.members.find(
    (m) => m.projectId === projectId && m.user.id === store.currentUserId,
  );
  return membership?.role ?? null;
}

export function useArchivedProjects() {
  const store = useStore();
  return store.projects.filter(
    (p) => p.archivedAt && (p.ownerId === store.currentUserId || p.memberIds.includes(store.currentUserId)),
  );
}
